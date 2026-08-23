import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db/mysql';
import { getNearbyTransitStations } from '@/lib/db/services/transitService';
import { sortFeaturesByRarity } from '@/lib/constants/featureRarity';

function parseJsonSafe(jsonStr: any, fallback: any = null) {
  if (!jsonStr) return fallback;
  if (typeof jsonStr === 'object') return jsonStr;
  try {
    return JSON.parse(jsonStr);
  } catch {
    return fallback;
  }
}

function formatFlatUniversityRoute(uni: {
  university_name: string;
  walking_minutes?: number | null;
  walking_distance_km?: number | string | null;
  driving_minutes?: number | null;
  driving_distance_km?: number | string | null;
}): string {
  const parts: string[] = [];
  if (uni.walking_minutes != null || uni.walking_distance_km != null) {
    const mins = uni.walking_minutes != null ? `${uni.walking_minutes} dk` : '';
    const dist = uni.walking_distance_km != null ? `${Number(uni.walking_distance_km).toFixed(2)} km` : '';
    const text = [mins, dist].filter(Boolean).join(' / ');
    if (text) parts.push(`Yürüyüş: ${text}`);
  }
  if (uni.driving_minutes != null || uni.driving_distance_km != null) {
    const mins = uni.driving_minutes != null ? `${uni.driving_minutes} dk` : '';
    const dist = uni.driving_distance_km != null ? `${Number(uni.driving_distance_km).toFixed(2)} km` : '';
    const text = [mins, dist].filter(Boolean).join(' / ');
    if (text) parts.push(`Araç: ${text}`);
  }

  if (parts.length > 0) {
    return `${uni.university_name} (${parts.join(' | ')})`;
  }
  return uni.university_name;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids') || '1061,893';
    const targetIds = idsParam
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id) && id > 0);

    if (targetIds.length === 0) {
      return NextResponse.json({ error: 'Geçersiz ID listesi' }, { status: 400 });
    }

    const placeholders = targetIds.map(() => '?').join(',');
    const sql = `
      SELECT 
        d.dorm_id,
        d.dorm_name,
        d.gender,
        d.dorm_type,
        d.city_name,
        d.district_name,
        d.lat,
        d.lng,
        d.google_rating,
        d.google_review_count,
        d.google_cid,
        d.contact_json,
        d.featured_image,
        d.gallery_images_json,
        d.description_snippet,
        d.feature_names_text,
        d.review_pros_raw,
        d.review_cons_raw,
        d.review_highlight,
        d.detail_path,
        p.predicted_min_price,
        p.predicted_max_price,
        p.confidence_level
      FROM ai_dorm_search_index d
      LEFT JOIN dorm_price_predictions p ON d.dorm_id = p.dorm_id
      WHERE d.dorm_id IN (${placeholders})
    `;

    const rows = await executeQuery<any>(sql, targetIds);

    // Üniversite rotaları
    const uniSql = `
      SELECT dorm_id, university_name, walking_minutes, walking_distance_km, driving_minutes, driving_distance_km, within_20km
      FROM ai_dorm_university_flat
      WHERE dorm_id IN (${placeholders}) AND within_20km = 1
      ORDER BY walking_distance_km ASC
    `;
    const uniRows = await executeQuery<any>(uniSql, targetIds).catch(() => []);

    const uniMap: Record<number, any[]> = {};
    for (const u of uniRows) {
      if (!uniMap[u.dorm_id]) uniMap[u.dorm_id] = [];
      uniMap[u.dorm_id].push(u);
    }

    // Her yurt için veriyi hazırla ve transit durakları ekle
    const dorms = await Promise.all(
      rows.map(async (row) => {
        const contact = parseJsonSafe(row.contact_json, {});
        const pros = parseJsonSafe(row.review_pros_raw, []);
        const cons = parseJsonSafe(row.review_cons_raw, []);
        let gallery = parseJsonSafe(row.gallery_images_json, []);

        if (!Array.isArray(gallery) || gallery.length === 0) {
          gallery = row.featured_image ? [row.featured_image] : [];
        }

        const rawFeatures = row.feature_names_text
          ? row.feature_names_text.split('|').map((s: string) => s.trim()).filter(Boolean)
          : [];
        const featuresList = sortFeaturesByRarity(rawFeatures);

        let nearbyTransit: any[] = [];
        if (row.lat && row.lng) {
          try {
            nearbyTransit = await getNearbyTransitStations(
              Number(row.lat),
              Number(row.lng),
              row.city_name,
              5
            );
          } catch {
            nearbyTransit = [];
          }
        }

        const myUnis = uniMap[row.dorm_id] || [];
        const closestUni = myUnis[0];
        const nearUniversitiesFormatted = myUnis.slice(0, 3).map(formatFlatUniversityRoute).join(' | ');

        const distanceKm = closestUni?.walking_distance_km != null
          ? Number(closestUni.walking_distance_km)
          : closestUni?.driving_distance_km != null
          ? Number(closestUni.driving_distance_km)
          : null;

        return {
          dormId: row.dorm_id,
          dormName: row.dorm_name,
          gender: row.gender || 'Belirtilmemiş',
          dormType: row.dorm_type || 'Özel',
          cityName: row.city_name,
          districtName: row.district_name || '',
          lat: row.lat ? Number(row.lat) : null,
          lng: row.lng ? Number(row.lng) : null,
          googleRating: row.google_rating ? Number(row.google_rating) : null,
          googleReviewCount: row.google_review_count ? Number(row.google_review_count) : null,
          googleCid: row.google_cid || null,
          predictedMinPrice: row.predicted_min_price || null,
          predictedMaxPrice: row.predicted_max_price || null,
          priceConfidence: row.confidence_level || null,
          features: featuresList,
          pros: Array.isArray(pros) ? pros : [],
          cons: Array.isArray(cons) ? cons : [],
          reviewHighlight: row.review_highlight || null,
          phones: Array.isArray(contact?.phones) ? contact.phones.filter(Boolean) : (contact?.phone ? [contact.phone] : []),
          whatsapp: contact?.whatsapp || null,
          website: contact?.website || null,
          address: contact?.address || null,
          detailPath: row.detail_path || `/yurtlar/${row.dorm_id}`,
          imageUrl: row.featured_image || gallery[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
          gallery: gallery.length > 0 ? gallery : [
            'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
          ],
          nearUniversities: nearUniversitiesFormatted || null,
          universities: myUnis.map((u: any) => ({
            name: u.university_name,
            walkingMinutes: u.walking_minutes,
            walkingKm: u.walking_distance_km ? Number(u.walking_distance_km) : null,
            drivingMinutes: u.driving_minutes,
            drivingKm: u.driving_distance_km ? Number(u.driving_distance_km) : null,
          })),
          closestUniversity: closestUni ? {
            name: closestUni.university_name,
            walkingMinutes: closestUni.walking_minutes,
            walkingKm: closestUni.walking_distance_km ? Number(closestUni.walking_distance_km) : null,
            drivingMinutes: closestUni.driving_minutes,
            drivingKm: closestUni.driving_distance_km ? Number(closestUni.driving_distance_km) : null,
          } : null,
          distanceKm,
          nearbyTransit,
        };
      })
    );

    // İstek sırasına göre sırala
    const sorted = targetIds.map((id) => dorms.find((d) => d.dormId === id)).filter(Boolean);

    return NextResponse.json({
      success: true,
      dorms: sorted,
    });
  } catch (error: any) {
    console.error('Error fetching sample dorms:', error);
    return NextResponse.json(
      { error: 'Yurt verileri getirilemedi: ' + (error?.message || 'Bilinmeyen hata') },
      { status: 500 }
    );
  }
}
