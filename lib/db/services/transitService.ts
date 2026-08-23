import { executeQuery } from '@/lib/db/mysql';

export interface TransitStationResult {
  id: string;
  name: string;
  type: string;
  lineCode: string;
  lineName: string;
  city: string;
  lat: number;
  lng: number;
  distanceMeters?: number;
  distanceKm?: number;
}

export async function searchTransitStations(
  query?: string,
  city?: string,
  type?: string,
  limit = 8
): Promise<TransitStationResult[]> {
  const conditions: string[] = ['is_active = 1'];
  const params: any[] = [];

  if (city && city.trim()) {
    conditions.push('city LIKE ?');
    params.push(`%${city.trim()}%`);
  }

  if (type && type.trim()) {
    conditions.push('type = ?');
    params.push(type.trim().toLowerCase());
  }

  if (query && query.trim()) {
    const q = query.trim();
    conditions.push('(name LIKE ? OR line_code LIKE ? OR line_name LIKE ?)');
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }

  const whereClause = conditions.join(' AND ');
  const sql = `
    SELECT 
      id,
      name,
      type,
      line_code,
      line_name,
      city,
      lat,
      lng
    FROM transit_stations
    WHERE ${whereClause}
    ORDER BY city ASC, line_code ASC, name ASC
    LIMIT ?
  `;

  params.push(Math.min(Math.max(limit, 1), 15));

  const rows = await executeQuery<any>(sql, params);
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    lineCode: r.line_code,
    lineName: r.line_name,
    city: r.city,
    lat: Number(r.lat),
    lng: Number(r.lng),
  }));
}

/**
 * Calculates nearest metro/metrobüs/tramvay/marmaray stations for given coordinates
 */
export async function getNearbyTransitStations(
  lat: number,
  lng: number,
  city?: string,
  limit = 4,
  maxDistanceKm = 5.0
): Promise<TransitStationResult[]> {
  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    return [];
  }

  const conditions: string[] = ['is_active = 1'];
  const params: any[] = [];

  if (city && city.trim()) {
    conditions.push('city LIKE ?');
    params.push(`%${city.trim()}%`);
  }

  // Haversine formula calculation in SQL
  const sql = `
    SELECT 
      id,
      name,
      type,
      line_code,
      line_name,
      city,
      lat,
      lng,
      (
        6371 * ACOS(
          LEAST(1.0, GREATEST(-1.0, 
            COS(RADIANS(?)) * COS(RADIANS(lat)) * COS(RADIANS(lng) - RADIANS(?)) +
            SIN(RADIANS(?)) * SIN(RADIANS(lat))
          ))
        )
      ) AS distance_km
    FROM transit_stations
    WHERE ${conditions.join(' AND ')}
    HAVING distance_km <= ?
    ORDER BY distance_km ASC
    LIMIT ?
  `;

  params.unshift(lat, lng, lat);
  params.push(maxDistanceKm, Math.min(Math.max(limit, 1), 8));

  try {
    const rows = await executeQuery<any>(sql, params);
    
    // Group stations with same name (e.g. transfer stations serving multiple lines like A1 and M1)
    const groupedMap = new Map<string, TransitStationResult>();
    
    for (const r of rows) {
      const dKm = Number(r.distance_km);
      const nameKey = (r.name || '').trim().toLowerCase();
      
      if (groupedMap.has(nameKey)) {
        const existing = groupedMap.get(nameKey)!;
        if (r.line_code && !existing.lineCode?.includes(r.line_code)) {
          existing.lineCode = existing.lineCode ? `${existing.lineCode}, ${r.line_code}` : r.line_code;
        }
        if (r.line_name && !existing.lineName?.includes(r.line_name)) {
          existing.lineName = existing.lineName ? `${existing.lineName} / ${r.line_name}` : r.line_name;
        }
      } else {
        groupedMap.set(nameKey, {
          id: r.id,
          name: r.name,
          type: r.type,
          lineCode: r.line_code,
          lineName: r.line_name,
          city: r.city,
          lat: Number(r.lat),
          lng: Number(r.lng),
          distanceKm: Math.round(dKm * 100) / 100,
          distanceMeters: Math.round(dKm * 1000),
        });
      }
    }

    return Array.from(groupedMap.values()).slice(0, limit);
  } catch (err) {
    console.error('getNearbyTransitStations query failed:', err);
    return [];
  }
}

