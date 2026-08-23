import { executeQuery } from '@/lib/db/mysql';
import { getNearbyTransitStations, TransitStationResult } from './transitService';

export interface DormSearchParams {
  city?: string;
  district?: string;
  gender?: 'Kız' | 'Erkek' | 'kiz' | 'erkek' | string;
  query?: string;
  university?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  features?: string[];
  feature?: string;
  limit?: number;
}

export interface DormSearchResult {
  dormId: number;
  dormName: string;
  gender: string;
  dormType?: string;
  cityName: string;
  districtName: string;
  googleRating: number | null;
  googleReviewCount: number | null;
  predictedMinPrice: number | null;
  predictedMaxPrice: number | null;
  priceConfidence?: string | null;
  features: string[];
  pros: string[];
  cons: string[];
  reviewHighlight: string | null;
  phones: string[];
  whatsapp: string | null;
  website: string | null;
  address: string | null;
  detailPath: string;
  nearUniversities: string | null;
  distanceKm?: number | null;
  nearbyTransit?: TransitStationResult[];
}

export interface DormTransportationResult {
  dormId: number;
  dormName: string;
  cityName: string;
  districtName: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  hasSchoolShuttle: boolean;
  targetUniversityRoute: {
    searchedUniversity: string;
    matchedRoute: string | null;
  } | null;
  nearbyTransitStations: TransitStationResult[];
  transitHighlights: string[];
}

// Canonical feature dictionary for exact DB feature mapping
const FEATURE_SYNONYMS: Record<string, string[]> = {
  otopark: ['Otopark'],
  otoparkli: ['Otopark'],
  otoparklı: ['Otopark'],
  'park yeri': ['Otopark'],
  'arac parki': ['Otopark'],
  'araç parkı': ['Otopark'],
  havuz: ['Yüzme havuzu'],
  havuzlu: ['Yüzme havuzu'],
  yuzme: ['Yüzme havuzu'],
  yüzme: ['Yüzme havuzu'],
  'yüzme havuzu': ['Yüzme havuzu'],
  'yuzme havuzu': ['Yüzme havuzu'],
  spor: ['Fitness Salonu', 'Spor Salonu'],
  fitness: ['Fitness Salonu'],
  gym: ['Fitness Salonu', 'Spor Salonu'],
  'spor salonu': ['Fitness Salonu', 'Spor Salonu'],
  yemek: ['Restoran - Yemekhane', 'Yemekhane', 'Sabah Kahvaltısı', 'Akşam Yemeği'],
  yemekli: ['Restoran - Yemekhane', 'Yemekhane', 'Sabah Kahvaltısı', 'Akşam Yemeği'],
  yemekhane: ['Restoran - Yemekhane', 'Yemekhane'],
  kahvalti: ['Sabah Kahvaltısı'],
  kahvaltı: ['Sabah Kahvaltısı'],
  'sabah kahvaltısı': ['Sabah Kahvaltısı'],
  'aksam yemegi': ['Akşam Yemeği'],
  'akşam yemeği': ['Akşam Yemeği'],
  klima: ['Klima'],
  klimali: ['Klima'],
  klimalı: ['Klima'],
  servis: ['Okul Servisi'],
  servisli: ['Okul Servisi'],
  'okul servisi': ['Okul Servisi'],
  balkon: ['Balkon', 'Odalarda Balkon', 'Teras'],
  balkonlu: ['Balkon', 'Odalarda Balkon'],
  teras: ['Teras', 'Balkon'],
  kutuphane: ['Kütüphane'],
  kütüphane: ['Kütüphane'],
  etut: ['Etüt Odaları', 'Etüt Salonu'],
  etüt: ['Etüt Odaları', 'Etüt Salonu'],
  'etüt odası': ['Etüt Odaları', 'Etüt Salonu'],
  'calisma masasi': ['Kişiye Özel Çalışma Masası', 'Çalışma Masası'],
  'çalışma masası': ['Kişiye Özel Çalışma Masası', 'Çalışma Masası'],
  guvenlik: ['24 Saat Güvenlik', 'Güvenlik Kamerası'],
  güvenlik: ['24 Saat Güvenlik', 'Güvenlik Kamerası'],
  '24 saat güvenlik': ['24 Saat Güvenlik'],
  '7/24 guvenlik': ['24 Saat Güvenlik'],
  'sicak su': ['7/24 Sıcak Su', '24 Saat Sıcak Su'],
  'sıcak su': ['7/24 Sıcak Su', '24 Saat Sıcak Su'],
  '7/24 sıcak su': ['7/24 Sıcak Su', '24 Saat Sıcak Su'],
  camasir: ['Çamaşır Odası', 'Çamaşırhane', 'Çamaşır Makinesi'],
  çamaşır: ['Çamaşır Odası', 'Çamaşırhane', 'Çamaşır Makinesi'],
  çamaşırhane: ['Çamaşırhane', 'Çamaşır Odası'],
  wifi: ['Ücretsiz Wi-Fi', 'Wifi', 'Ücretsiz İnternet'],
  internet: ['Ücretsiz Wi-Fi', 'Wifi', 'Ücretsiz İnternet'],
  'ucretsiz wifi': ['Ücretsiz Wi-Fi'],
  'ücretsiz wi-fi': ['Ücretsiz Wi-Fi'],
  mescit: ['Mescit'],
  sauna: ['Sauna'],
  hamam: ['Hamam'],
  spa: ['Spa ve sağlık merkezi', 'Sauna', 'Hamam'],
  asansor: ['Asansör'],
  asansör: ['Asansör'],
  jenerator: ['Jeneratör'],
  jeneratör: ['Jeneratör'],
  bahce: ['Bahçe', 'Bahçe Manzaralı'],
  bahçe: ['Bahçe', 'Bahçe Manzaralı'],
};

function normalizeTurkishForSearch(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

function resolveFeatureMatches(featureInput: string): string[] {
  const norm = normalizeTurkishForSearch(featureInput);
  if (FEATURE_SYNONYMS[norm]) {
    return FEATURE_SYNONYMS[norm];
  }
  // Try partial match in dictionary
  for (const [key, values] of Object.entries(FEATURE_SYNONYMS)) {
    if (norm.includes(key) || key.includes(norm)) {
      return values;
    }
  }
  return [featureInput.trim()];
}

function parseJsonSafe(jsonStr: any, fallback: any = null) {
  if (!jsonStr) return fallback;
  if (typeof jsonStr === 'object') return jsonStr;
  try {
    return JSON.parse(jsonStr);
  } catch {
    return fallback;
  }
}

function normalizeTurkish(text: string): string {
  if (!text) return '';
  return text
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'c')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Common Turkish University Acronyms and Multi-word Aliases Map
 */
const UNIVERSITY_ALIASES: Record<string, string[]> = {
  itu: ['istanbul teknik', 'itu'],
  itü: ['istanbul teknik', 'itu'],
  'itu ayazaga': ['istanbul teknik universitesi (ayazaga', 'istanbul teknik universitesi', 'ayazaga'],
  'itü ayazağa': ['istanbul teknik universitesi (ayazaga', 'istanbul teknik universitesi', 'ayazaga'],
  'itu macka': ['istanbul teknik universitesi (macka', 'istanbul teknik universitesi', 'macka'],
  'itü maçka': ['istanbul teknik universitesi (macka', 'istanbul teknik universitesi', 'macka'],
  'itu taskisla': ['istanbul teknik universitesi (taskisla', 'istanbul teknik universitesi', 'taskisla'],
  'itü taşkışla': ['istanbul teknik universitesi (taskisla', 'istanbul teknik universitesi', 'taskisla'],
  'itu gumussuyu': ['istanbul teknik universitesi (gumussuyu', 'istanbul teknik universitesi', 'gumussuyu'],
  'itü gümüşsuyu': ['istanbul teknik universitesi (gumussuyu', 'istanbul teknik universitesi', 'gumussuyu'],
  'itu tuzla': ['istanbul teknik universitesi (tuzla', 'istanbul teknik universitesi', 'tuzla'],
  ytu: ['yildiz teknik', 'ytu'],
  ytü: ['yildiz teknik', 'ytu'],
  'ytu davutpasa': ['yildiz teknik universitesi (davutpasa', 'yildiz teknik', 'davutpasa'],
  'ytü davutpaşa': ['yildiz teknik universitesi (davutpasa', 'yildiz teknik', 'davutpasa'],
  'ytu yildiz': ['yildiz teknik universitesi (besiktas', 'yildiz teknik', 'besiktas'],
  'ytü yıldız': ['yildiz teknik universitesi (besiktas', 'yildiz teknik', 'besiktas'],
  'ytu besiktas': ['yildiz teknik universitesi (besiktas', 'yildiz teknik', 'besiktas'],
  'ytü beşiktaş': ['yildiz teknik universitesi (besiktas', 'yildiz teknik', 'besiktas'],
  odtu: ['orta dogu teknik', 'odtu', 'metu'],
  odtü: ['orta dogu teknik', 'odtu', 'metu'],
  metu: ['orta dogu teknik', 'odtu', 'metu'],
  boun: ['bogazici', 'boun'],
  boün: ['bogazici', 'boun'],
  bogazici: ['bogazici'],
  boğaziçi: ['bogazici'],
  bau: ['bahcesehir', 'bau'],
  bahcesehir: ['bahcesehir'],
  bahçeşehir: ['bahcesehir'],
  iu: ['istanbul universitesi', 'iu'],
  iü: ['istanbul universitesi', 'iu'],
  iuc: ['istanbul universitesi-cerrahpasa', 'cerrahpasa', 'iuc'],
  iüc: ['istanbul universitesi-cerrahpasa', 'cerrahpasa', 'iuc'],
  cerrahpasa: ['istanbul universitesi-cerrahpasa', 'cerrahpasa'],
  cerrahpaşa: ['istanbul universitesi-cerrahpasa', 'cerrahpasa'],
  gsu: ['galatasaray', 'gsu'],
  gsü: ['galatasaray', 'gsu'],
  marmara: ['marmara'],
  medipol: ['istanbul medipol', 'medipol'],
  bilgi: ['istanbul bilgi', 'bilgi'],
  aydin: ['istanbul aydin', 'aydin'],
  aydın: ['istanbul aydin', 'aydin'],
  gelisim: ['istanbul gelisim', 'gelisim'],
  gelişim: ['istanbul gelisim', 'gelisim'],
  khas: ['kadir has', 'khas'],
  'kadir has': ['kadir has'],
  sabanci: ['sabanci'],
  sabancı: ['sabanci'],
  koc: ['koc universitesi', 'koc'],
  koç: ['koc universitesi', 'koc'],
  ozyegin: ['ozyegin'],
  özyeğin: ['ozyegin'],
  ozu: ['ozyegin'],
  özü: ['ozyegin'],
  yeditepe: ['yeditepe'],
  bezmialem: ['bezm-i alem', 'bezmialem'],
  'bezmi alem': ['bezm-i alem', 'bezmialem'],
  biruni: ['biruni'],
  fsmvu: ['fatih sultan mehmet', 'fsmvu'],
  fsmvü: ['fatih sultan mehmet', 'fsmvu'],
  halic: ['halic'],
  haliç: ['halic'],
  istinye: ['istinye'],
  isu: ['istinye', 'isu'],
  isü: ['istinye', 'isu'],
  mef: ['mef'],
  msgsu: ['mimar sinan guzel sanatlar', 'mimar sinan', 'msgsu'],
  msgsü: ['mimar sinan guzel sanatlar', 'mimar sinan', 'msgsu'],
  tau: ['turk-alman', 'turk alman', 'tau'],
  taü: ['turk-alman', 'turk alman', 'tau'],
  uskudar: ['uskudar'],
  üsküdar: ['uskudar'],
  altinbas: ['altinbas'],
  altınbaş: ['altinbas'],
  beykoz: ['beykoz'],
  beykent: ['istanbul beykent', 'beykent'],
  nisantasi: ['istanbul nisantasi', 'nisantasi'],
  nişantaşı: ['istanbul nisantasi', 'nisantasi'],
  hacettepe: ['hacettepe'],
  gazi: ['gazi'],
  bilkent: ['ihsan dogramaci bilkent', 'bilkent'],
  tobb: ['tobb ekonomi', 'tobb'],
  'tobb etu': ['tobb ekonomi', 'tobb'],
  'tobb etü': ['tobb ekonomi', 'tobb'],
  deu: ['dokuz eylul', 'deu'],
  deü: ['dokuz eylul', 'deu'],
  ege: ['ege'],
  iyte: ['izmir yuksek teknoloji', 'iyte'],
  iztek: ['izmir yuksek teknoloji', 'iyte'],
  katu: ['karadeniz teknik', 'katu'],
  katü: ['karadeniz teknik', 'katu'],
  gtu: ['gebze teknik', 'gtu'],
  gtü: ['gebze teknik', 'gtu'],
  esogu: ['eskisehir osmangazi', 'esogu'],
  esogü: ['eskisehir osmangazi', 'esogu'],
  anadolu: ['anadolu universitesi', 'anadolu'],
  akdeniz: ['akdeniz'],
  cukurova: ['cukurova'],
  çukurova: ['cukurova'],
  cu: ['cukurova'],
  çü: ['cukurova'],
  uludag: ['bursa uludag', 'uludag'],
  uludağ: ['bursa uludag', 'uludag'],
  kou: ['kocaeli universitesi', 'kou'],
  koü: ['kocaeli universitesi', 'kou'],
  sau: ['sakarya universitesi', 'sau'],
  saü: ['sakarya universitesi', 'sau'],
  sbu: ['saglik bilimleri', 'sbu'],
  sbü: ['saglik bilimleri', 'sbu'],
  'piri reis': ['piri reis'],
  isik: ['isik universitesi'],
  ışık: ['isik universitesi'],
  'ibn haldun': ['ibn haldun'],
  iszu: ['sabahattin zaim', 'iszu'],
  iszü: ['sabahattin zaim', 'iszu'],
  istun: ['saglik ve teknoloji', 'istun'],
  istün: ['saglik ve teknoloji', 'istun'],
  'yeni yuzyil': ['yeni yuzyil'],
  'yeni yüzyıl': ['yeni yuzyil'],
  maltepe: ['maltepe'],
  ted: ['ted universitesi', 'ted'],
  tedu: ['ted universitesi', 'ted'],
  tedü: ['ted universitesi', 'ted'],
  atilim: ['atilim'],
  atılım: ['atilim'],
  baskent: ['baskent'],
  başkent: ['baskent'],
  cankaya: ['cankaya'],
  çankaya: ['cankaya'],
  fenerbahce: ['fenerbahce'],
  fenerbahçe: ['fenerbahce'],
  dogus: ['dogus'],
  doğuş: ['dogus'],
  'demiroglu bilim': ['demiroglu bilim'],
  'demiroğlu bilim': ['demiroglu bilim'],
};

function resolveUniversityKeywords(targetUniversity?: string, query?: string): string[] {
  const keywordsSet = new Set<string>();

  const processTerm = (rawTerm: string) => {
    if (!rawTerm || !rawTerm.trim()) return;
    const normalized = normalizeTurkish(rawTerm);
    keywordsSet.add(normalized);

    // Direct alias dictionary lookup
    if (UNIVERSITY_ALIASES[normalized]) {
      UNIVERSITY_ALIASES[normalized].forEach((alias) => keywordsSet.add(normalizeTurkish(alias)));
    }

    // Clean university boilerplate suffixes
    const cleaned = normalized
      .replace(/\b(universitesi|universite|uni|kampusu|kampus|yerleskesi|yerleske)\b/g, '')
      .trim();

    if (cleaned.length >= 2) {
      keywordsSet.add(cleaned);
      if (UNIVERSITY_ALIASES[cleaned]) {
        UNIVERSITY_ALIASES[cleaned].forEach((alias) => keywordsSet.add(normalizeTurkish(alias)));
      }
    }

    // Split words to catch abbreviations like "itu ayazaga"
    const words = normalized.split(/\s+/).filter((w) => w.length >= 2);
    for (const w of words) {
      if (UNIVERSITY_ALIASES[w]) {
        UNIVERSITY_ALIASES[w].forEach((alias) => keywordsSet.add(normalizeTurkish(alias)));
      }
      if (w.length >= 3 && !['universitesi', 'universite', 'kampusu', 'yerleskesi'].includes(w)) {
        keywordsSet.add(w);
      }
    }
  };

  if (targetUniversity) {
    processTerm(targetUniversity);
  }

  if (query && /üni|uni|kampüs|kampus|yerleşke|yerleske/i.test(query)) {
    processTerm(query);
  }

  return Array.from(keywordsSet).filter(Boolean);
}

function filterTargetUniversity(
  nearUniversitiesText: string | null | undefined,
  targetUniversity?: string,
  query?: string
): string | null {
  if (!nearUniversitiesText) return null;

  const entries = nearUniversitiesText
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);

  if (entries.length === 0) return null;

  const searchKeywords = resolveUniversityKeywords(targetUniversity, query);

  // If user searched for a specific university, ONLY return matched entries for that university!
  if (searchKeywords.length > 0) {
    const matched = entries.filter((entry) => {
      const entryNormalized = normalizeTurkish(entry);
      return searchKeywords.some((kw) => kw && entryNormalized.includes(kw));
    });

    if (matched.length > 0) {
      return matched.join(' | ');
    }
    // If user searched for a specific university but this dorm has no record for it,
    // do NOT return unrelated universities!
    return null;
  }

  // If no specific university was requested, return only the top 2 closest universities
  return entries.slice(0, 2).join(' | ');
}

function extractDistanceToUniversity(
  nearUniversitiesText: string | null | undefined,
  targetUniversity?: string,
  query?: string
): number {
  if (!nearUniversitiesText) return 99999;

  const entries = nearUniversitiesText
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);

  if (entries.length === 0) return 99999;

  const searchKeywords = resolveUniversityKeywords(targetUniversity, query);

  if (searchKeywords.length === 0) return 99999;

  const matchedEntries = entries.filter((entry) => {
    const entryNormalized = normalizeTurkish(entry);
    return searchKeywords.some((kw) => kw && entryNormalized.includes(kw));
  });

  if (matchedEntries.length === 0) return 99999;

  let minKm = 99999;

  for (const entry of matchedEntries) {
    // Match driving distance
    const drivingMatch = entry.match(/araç[^,:]*?\/\s*(\d+(?:[.,]\d+)?)\s*(km|m)\b/i);
    if (drivingMatch) {
      const val = parseFloat(drivingMatch[1].replace(',', '.'));
      const km = drivingMatch[2].toLowerCase() === 'm' ? val / 1000 : val;
      if (km < minKm) minKm = km;
    }

    // Match walking distance
    const walkingMatch = entry.match(/yürüyüş[^,:]*?\/\s*(\d+(?:[.,]\d+)?)\s*(km|m)\b/i);
    if (walkingMatch) {
      const val = parseFloat(walkingMatch[1].replace(',', '.'));
      const km = walkingMatch[2].toLowerCase() === 'm' ? val / 1000 : val;
      if (km < minKm) minKm = km;
    }

    // General distance match if not caught by walking/driving prefix
    if (minKm === 99999) {
      const generalMatches = [...entry.matchAll(/\/\s*(\d+(?:[.,]\d+)?)\s*(km|m)\b/gi)];
      for (const gm of generalMatches) {
        const val = parseFloat(gm[1].replace(',', '.'));
        const km = gm[2].toLowerCase() === 'm' ? val / 1000 : val;
        if (km < minKm) minKm = km;
      }
    }
  }

  return minKm;
}

export async function searchDorms(params: DormSearchParams): Promise<DormSearchResult[]> {
  const conditions: string[] = ['d.status = 1'];
  const sqlParams: any[] = [];

  if (params.city && params.city.trim()) {
    const cityTrim = params.city.trim();
    conditions.push('(d.city_name LIKE ? OR d.city_slug = ? OR d.city_name LIKE ?)');
    sqlParams.push(`%${cityTrim}%`, cityTrim.toLowerCase(), `%${cityTrim.replace(/i/gi, 'İ')}%`);
  }

  if (params.district && params.district.trim()) {
    const distTrim = params.district.trim();
    conditions.push('(d.district_name LIKE ? OR d.district_slug = ? OR d.district_name LIKE ?)');
    sqlParams.push(`%${distTrim}%`, distTrim.toLowerCase(), `%${distTrim.replace(/i/gi, 'İ')}%`);
  }

  if (params.gender && params.gender.trim()) {
    const g = params.gender.trim().toLowerCase();
    if (g.includes('kız') || g.includes('kiz') || g.includes('bayan') || g.includes('kadın')) {
      conditions.push('d.gender LIKE ?');
      sqlParams.push('%Kız%');
    } else if (g.includes('erkek') || g.includes('bay')) {
      conditions.push('d.gender LIKE ?');
      sqlParams.push('%Erkek%');
    }
  }

  // Handle university filter explicitly using near_universities_text and acronym resolver
  if (params.university && params.university.trim()) {
    const keywords = resolveUniversityKeywords(params.university);
    if (keywords.length > 0) {
      const likeClauses = keywords.slice(0, 4).map(() => 'd.near_universities_text LIKE ?').join(' OR ');
      conditions.push(`(${likeClauses})`);
      keywords.slice(0, 4).forEach((kw) => sqlParams.push(`%${kw}%`));
    }
  }

  // Collect features from both features array and feature string
  const requestedFeatures: string[] = [];
  if (params.features && Array.isArray(params.features)) {
    requestedFeatures.push(...params.features.filter((f) => f && f.trim()));
  }
  if (params.feature && params.feature.trim()) {
    requestedFeatures.push(params.feature.trim());
  }

  // Check if query is actually a feature request (e.g. "otopark", "havuz", "spor salonu", "servis")
  let textQuery = params.query ? params.query.trim() : '';
  if (textQuery) {
    const normQ = normalizeTurkishForSearch(textQuery);
    if (FEATURE_SYNONYMS[normQ]) {
      requestedFeatures.push(textQuery);
      textQuery = ''; // Consumed as feature
    }
  }

  // Apply feature filters to SQL query
  if (requestedFeatures.length > 0) {
    for (const feat of requestedFeatures) {
      const resolvedNames = resolveFeatureMatches(feat);
      if (resolvedNames.length === 1) {
        conditions.push('d.feature_names_text LIKE ?');
        sqlParams.push(`%${resolvedNames[0]}%`);
      } else if (resolvedNames.length > 1) {
        const featureOrClauses = resolvedNames.map(() => 'd.feature_names_text LIKE ?').join(' OR ');
        conditions.push(`(${featureOrClauses})`);
        for (const rn of resolvedNames) {
          sqlParams.push(`%${rn}%`);
        }
      }
    }
  }

  if (textQuery) {
    conditions.push(
      '(d.dorm_name LIKE ? OR d.feature_names_text LIKE ? OR d.near_universities_text LIKE ? OR d.description_snippet LIKE ?)'
    );
    sqlParams.push(`%${textQuery}%`, `%${textQuery}%`, `%${textQuery}%`, `%${textQuery}%`);
  }

  if (params.minRating && params.minRating > 0) {
    conditions.push('d.google_rating >= ?');
    sqlParams.push(params.minRating);
  }

  if (params.minPrice && params.minPrice > 0) {
    conditions.push('p.predicted_min_price >= ?');
    sqlParams.push(params.minPrice);
  }

  if (params.maxPrice && params.maxPrice > 0) {
    conditions.push('p.predicted_max_price <= ?');
    sqlParams.push(params.maxPrice);
  }

  const limit = Math.min(Math.max(Number(params.limit) || 5, 1), 12);
  const whereClause = conditions.join(' AND ');
  const isUniversitySearch = Boolean(
    (params.university && params.university.trim()) ||
    (params.query && /üni|uni|kampüs|kampus/i.test(params.query))
  );

  const sql = `
    SELECT 
      d.dorm_id,
      d.dorm_name,
      d.gender,
      d.dorm_type,
      d.city_name,
      d.district_name,
      d.google_rating,
      d.google_review_count,
      d.contact_json,
      d.feature_names_text,
      d.review_pros_raw,
      d.review_cons_raw,
      d.review_highlight,
      d.near_universities_text,
      d.detail_path,
      p.predicted_min_price,
      p.predicted_max_price,
      p.confidence_level
    FROM ai_dorm_search_index d
    LEFT JOIN dorm_price_predictions p ON d.dorm_id = p.dorm_id
    WHERE ${whereClause}
    ORDER BY 
      CASE WHEN d.city_rank = 9999 THEN 1000 ELSE d.city_rank END ASC,
      d.google_rating DESC,
      d.google_review_count DESC
    LIMIT ?
  `;

  // Fetch more candidates for university searches so we can sort accurately by proximity
  sqlParams.push(isUniversitySearch ? 60 : limit);

  const rows = await executeQuery<any>(sql, sqlParams);

  const results: DormSearchResult[] = rows.map((row) => {
    const contact = parseJsonSafe(row.contact_json, {});
    const pros = parseJsonSafe(row.review_pros_raw, []);
    const cons = parseJsonSafe(row.review_cons_raw, []);
    const featuresList = row.feature_names_text
      ? row.feature_names_text.split('|').map((s: string) => s.trim()).filter(Boolean)
      : [];
    const calculatedDist = extractDistanceToUniversity(row.near_universities_text, params.university, params.query);

    return {
      dormId: row.dorm_id,
      dormName: row.dorm_name,
      gender: row.gender || 'Belirtilmemiş',
      dormType: row.dorm_type,
      cityName: row.city_name,
      districtName: row.district_name || '',
      googleRating: row.google_rating ? Number(row.google_rating) : null,
      googleReviewCount: row.google_review_count ? Number(row.google_review_count) : null,
      predictedMinPrice: row.predicted_min_price || null,
      predictedMaxPrice: row.predicted_max_price || null,
      priceConfidence: row.confidence_level || null,
      features: featuresList,
      pros: Array.isArray(pros) ? pros : [],
      cons: Array.isArray(cons) ? cons : [],
      reviewHighlight: row.review_highlight || null,
      phones: Array.isArray(contact?.phones) ? contact.phones.filter(Boolean) : [],
      whatsapp: contact?.whatsapp || null,
      website: contact?.website || null,
      address: contact?.address || null,
      detailPath: row.detail_path,
      nearUniversities: filterTargetUniversity(row.near_universities_text, params.university, params.query),
      distanceKm: calculatedDist < 99990 ? calculatedDist : null,
    };
  });

  if (isUniversitySearch) {
    results.sort((a, b) => {
      const distA = a.distanceKm ?? 99999;
      const distB = b.distanceKm ?? 99999;

      // If both have valid distances
      if (distA !== 99999 && distB !== 99999) {
        // If distance difference > 0.3 km, sort strictly by distance
        if (Math.abs(distA - distB) > 0.3) {
          return distA - distB;
        }
        // If distance is very close (within 300m), sort by rating and review count
        const ratingDiff = (b.googleRating || 0) - (a.googleRating || 0);
        if (Math.abs(ratingDiff) > 0.2) {
          return ratingDiff;
        }
        return (b.googleReviewCount || 0) - (a.googleReviewCount || 0);
      }

      // Dorms with matched distance come first
      if (distA !== 99999) return -1;
      if (distB !== 99999) return 1;

      // Fallback: rating sort
      return (b.googleRating || 0) - (a.googleRating || 0);
    });
  }

  return results.slice(0, limit);
}

export async function getDormByIdOrName(
  queryOrId: string | number,
  targetUniversity?: string
): Promise<DormSearchResult | null> {
  const isNumeric = !isNaN(Number(queryOrId));
  let sql = '';
  let params: any[] = [];

  const selectFields = `
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
    d.contact_json,
    d.feature_names_text,
    d.review_pros_raw,
    d.review_cons_raw,
    d.review_highlight,
    d.near_universities_text,
    d.detail_path,
    p.predicted_min_price,
    p.predicted_max_price,
    p.confidence_level
  `;

  if (isNumeric) {
    sql = `
      SELECT ${selectFields}
      FROM ai_dorm_search_index d
      LEFT JOIN dorm_price_predictions p ON d.dorm_id = p.dorm_id
      WHERE d.dorm_id = ?
      LIMIT 1
    `;
    params = [Number(queryOrId)];
  } else {
    const q = String(queryOrId).trim();
    sql = `
      SELECT ${selectFields}
      FROM ai_dorm_search_index d
      LEFT JOIN dorm_price_predictions p ON d.dorm_id = p.dorm_id
      WHERE d.dorm_name LIKE ? OR d.dorm_slug LIKE ?
      LIMIT 1
    `;
    params = [`%${q}%`, `%${q.toLowerCase()}%`];
  }

  const rows = await executeQuery<any>(sql, params);
  if (rows.length === 0) return null;

  const row = rows[0];
  const contact = parseJsonSafe(row.contact_json, {});
  const pros = parseJsonSafe(row.review_pros_raw, []);
  const cons = parseJsonSafe(row.review_cons_raw, []);
  const featuresList = row.feature_names_text
    ? row.feature_names_text.split('|').map((s: string) => s.trim()).filter(Boolean)
    : [];

  let nearbyTransitStations: TransitStationResult[] = [];
  if (row.lat && row.lng) {
    try {
      nearbyTransitStations = await getNearbyTransitStations(
        Number(row.lat),
        Number(row.lng),
        row.city_name,
        4
      );
    } catch {
      nearbyTransitStations = [];
    }
  }

  return {
    dormId: row.dorm_id,
    dormName: row.dorm_name,
    gender: row.gender || 'Belirtilmemiş',
    dormType: row.dorm_type,
    cityName: row.city_name,
    districtName: row.district_name || '',
    googleRating: row.google_rating ? Number(row.google_rating) : null,
    googleReviewCount: row.google_review_count ? Number(row.google_review_count) : null,
    predictedMinPrice: row.predicted_min_price || null,
    predictedMaxPrice: row.predicted_max_price || null,
    priceConfidence: row.confidence_level || null,
    features: featuresList,
    pros: Array.isArray(pros) ? pros : [],
    cons: Array.isArray(cons) ? cons : [],
    reviewHighlight: row.review_highlight || null,
    phones: Array.isArray(contact?.phones) ? contact.phones.filter(Boolean) : [],
    whatsapp: contact?.whatsapp || null,
    website: contact?.website || null,
    address: contact?.address || null,
    detailPath: row.detail_path,
    nearUniversities: filterTargetUniversity(row.near_universities_text, targetUniversity),
    nearbyTransit: nearbyTransitStations.length > 0 ? nearbyTransitStations : undefined,
  };
}

export async function getDormTransportation(
  queryOrId: string | number,
  targetUniversity?: string
): Promise<DormTransportationResult | null> {
  const dorm = await getDormByIdOrName(queryOrId, targetUniversity);
  if (!dorm) return null;

  const featuresText = dorm.features.join(' ');
  const hasSchoolShuttle = /servis|okul servisi/i.test(featuresText);

  const transitHighlights: string[] = [];
  if (hasSchoolShuttle) {
    transitHighlights.push('Yurdun okul servisi / ring ulaşım olanağı bulunmaktadır.');
  }

  if (dorm.nearbyTransit && dorm.nearbyTransit.length > 0) {
    for (const station of dorm.nearbyTransit) {
      transitHighlights.push(
        `${station.type.toUpperCase()}: ${station.name} (${station.lineCode ? station.lineCode + ' - ' : ''}${station.lineName || ''}) ~${station.distanceMeters ? station.distanceMeters + 'm' : station.distanceKm + ' km'}`
      );
    }
  }

  return {
    dormId: dorm.dormId,
    dormName: dorm.dormName,
    cityName: dorm.cityName,
    districtName: dorm.districtName,
    address: dorm.address,
    lat: null,
    lng: null,
    hasSchoolShuttle,
    targetUniversityRoute: targetUniversity
      ? {
          searchedUniversity: targetUniversity,
          matchedRoute: dorm.nearUniversities,
        }
      : null,
    nearbyTransitStations: dorm.nearbyTransit || [],
    transitHighlights,
  };
}
