import { executeQuery } from '@/lib/db/mysql';

export interface UniversityResult {
  id: number;
  name: string;
  slug: string;
  cityName?: string;
  lat: number | null;
  lng: number | null;
}

const UNIVERSITY_ACRONYM_MAP: Record<string, string[]> = {
  itu: ['İstanbul Teknik', 'İTÜ'],
  itü: ['İstanbul Teknik', 'İTÜ'],
  ytu: ['Yıldız Teknik', 'YTÜ'],
  ytü: ['Yıldız Teknik', 'YTÜ'],
  odtu: ['Orta Doğu Teknik', 'ODTÜ'],
  odtü: ['Orta Doğu Teknik', 'ODTÜ'],
  metu: ['Orta Doğu Teknik', 'ODTÜ'],
  boun: ['Boğaziçi', 'BOÜN'],
  boün: ['Boğaziçi', 'BOÜN'],
  bau: ['Bahçeşehir', 'BAU'],
  iu: ['İstanbul Üniversitesi', 'İÜ'],
  iü: ['İstanbul Üniversitesi', 'İÜ'],
  iuc: ['İstanbul Üniversitesi-Cerrahpaşa', 'İÜC', 'Cerrahpaşa'],
  iüc: ['İstanbul Üniversitesi-Cerrahpaşa', 'İÜC', 'Cerrahpaşa'],
  gsu: ['Galatasaray', 'GSÜ'],
  gsü: ['Galatasaray', 'GSÜ'],
  khas: ['Kadir Has'],
  deu: ['Dokuz Eylül', 'DEÜ'],
  deü: ['Dokuz Eylül', 'DEÜ'],
  iyte: ['İzmir Yüksek Teknoloji', 'İYTE'],
  gtu: ['Gebze Teknik', 'GTÜ'],
  gtü: ['Gebze Teknik', 'GTÜ'],
  katu: ['Karadeniz Teknik', 'KTÜ'],
  katü: ['Karadeniz Teknik', 'KTÜ'],
  esogu: ['Eskişehir Osmangazi', 'ESOGÜ'],
  esogü: ['Eskişehir Osmangazi', 'ESOGÜ'],
  kou: ['Kocaeli Üniversitesi', 'KOÜ'],
  koü: ['Kocaeli Üniversitesi', 'KOÜ'],
  sau: ['Sakarya Üniversitesi', 'SAÜ'],
  saü: ['Sakarya Üniversitesi', 'SAÜ'],
  sbu: ['Sağlık Bilimleri', 'SBÜ'],
  sbü: ['Sağlık Bilimleri', 'SBÜ'],
  tau: ['Türk-Alman', 'TAÜ'],
  taü: ['Türk-Alman', 'TAÜ'],
  fsmvu: ['Fatih Sultan Mehmet', 'FSMVÜ'],
  fsmvü: ['Fatih Sultan Mehmet', 'FSMVÜ'],
  msgsu: ['Mimar Sinan Güzel Sanatlar', 'MSGSÜ'],
  msgsü: ['Mimar Sinan Güzel Sanatlar', 'MSGSÜ'],
  tobb: ['TOBB Ekonomi', 'TOBB'],
  tedu: ['TED Üniversitesi', 'TEDÜ'],
  tedü: ['TED Üniversitesi', 'TEDÜ'],
};

export async function searchUniversities(
  query: string,
  cityName?: string,
  limit = 6
): Promise<UniversityResult[]> {
  const conditions: string[] = [];
  const params: any[] = [];

  if (query && query.trim()) {
    const q = query.trim();
    const qLower = q.toLowerCase();
    const searchTerms = [q, `%${q}%`];

    if (UNIVERSITY_ACRONYM_MAP[qLower]) {
      UNIVERSITY_ACRONYM_MAP[qLower].forEach((term) => searchTerms.push(term));
    }

    const orClauses: string[] = [];
    searchTerms.forEach((term) => {
      orClauses.push('u.name LIKE ?', 'u.slug LIKE ?', 'u.name_en LIKE ?');
      params.push(`%${term}%`, `%${term.toLowerCase()}%`, `%${term}%`);
    });

    conditions.push(`(${orClauses.join(' OR ')})`);
  }

  if (cityName && cityName.trim()) {
    conditions.push('c.name LIKE ?');
    params.push(`%${cityName.trim()}%`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `
    SELECT 
      u.id,
      u.name,
      u.slug,
      c.name AS city_name,
      u.lat,
      u.lng
    FROM universities u
    LEFT JOIN cities c ON u.cityId = c.id
    ${whereClause}
    ORDER BY u.name ASC
    LIMIT ?
  `;

  params.push(Math.min(Math.max(limit, 1), 10));

  const rows = await executeQuery<any>(sql, params);
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    cityName: r.city_name || undefined,
    lat: r.lat ? Number(r.lat) : null,
    lng: r.lng ? Number(r.lng) : null,
  }));
}
