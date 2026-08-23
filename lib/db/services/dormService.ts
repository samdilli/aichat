import { executeQuery } from '@/lib/db/mysql';
import { getNearbyTransitStations, TransitStationResult } from './transitService';
import { sortFeaturesByRarity } from '@/lib/constants/featureRarity';

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
  excludeDormIds?: number[];
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
  // Banyo & Tuvalet & Islak Hacim varyasyonları
  banyo: ['Banyo', 'Wc-Banyo', 'Özel Banyo'],
  banyolu: ['Banyo', 'Wc-Banyo', 'Özel Banyo'],
  'özel banyo': ['Özel Banyo', 'Banyo', 'Wc-Banyo'],
  'ozel banyo': ['Özel Banyo', 'Banyo', 'Wc-Banyo'],
  'kisisel banyo': ['Özel Banyo', 'Banyo', 'Wc-Banyo'],
  'kişisel banyo': ['Özel Banyo', 'Banyo', 'Wc-Banyo'],
  'oda içi banyo': ['Banyo', 'Wc-Banyo', 'Özel Banyo'],
  'oda ici banyo': ['Banyo', 'Wc-Banyo', 'Özel Banyo'],
  'odada banyo': ['Banyo', 'Wc-Banyo', 'Özel Banyo'],
  'oda banyolu': ['Banyo', 'Wc-Banyo', 'Özel Banyo'],
  tuvalet: ['Wc-Banyo', 'Banyo'],
  tuvaletli: ['Wc-Banyo', 'Banyo'],
  wc: ['Wc-Banyo', 'Banyo'],
  'wc-banyo': ['Wc-Banyo', 'Banyo'],
  'wc banyo': ['Wc-Banyo', 'Banyo'],
  'banyo-tuvalet': ['Wc-Banyo', 'Banyo'],
  'banyo tuvalet': ['Wc-Banyo', 'Banyo'],
  'banyo - tuvalet': ['Wc-Banyo', 'Banyo'],
  'banyo - tuvalet (oda içinde)': ['Wc-Banyo', 'Banyo'],
  'banyo - tuvalet (oda icinde)': ['Wc-Banyo', 'Banyo'],
  'oda içinde tuvalet': ['Wc-Banyo', 'Banyo'],
  'oda icinde tuvalet': ['Wc-Banyo', 'Banyo'],
  dus: ['Banyo', 'Wc-Banyo'],
  duş: ['Banyo', 'Wc-Banyo'],
  duşlu: ['Banyo', 'Wc-Banyo'],
  duslu: ['Banyo', 'Wc-Banyo'],

  // Otopark
  otopark: ['Otopark'],
  otoparkli: ['Otopark'],
  otoparklı: ['Otopark'],
  'park yeri': ['Otopark'],
  'arac parki': ['Otopark'],
  'araç parkı': ['Otopark'],

  // Havuz & Spa & Hamam & Sauna
  havuz: ['Yüzme havuzu'],
  havuzlu: ['Yüzme havuzu'],
  yuzme: ['Yüzme havuzu'],
  yüzme: ['Yüzme havuzu'],
  'yüzme havuzu': ['Yüzme havuzu'],
  'yuzme havuzu': ['Yüzme havuzu'],
  sauna: ['Sauna'],
  hamam: ['Hamam'],
  spa: ['Spa ve sağlık merkezi', 'Sauna', 'Hamam'],

  // Spor & Fitness
  spor: ['Fitness Salonu', 'Spor Salonu'],
  fitness: ['Fitness Salonu'],
  gym: ['Fitness Salonu', 'Spor Salonu'],
  'spor salonu': ['Fitness Salonu', 'Spor Salonu'],
  'fitness salonu': ['Fitness Salonu'],

  // Yemek & Beslenme
  yemek: ['Restoran - Yemekhane', 'Yemekhane', 'Sabah Kahvaltısı', 'Akşam Yemeği'],
  yemekli: ['Restoran - Yemekhane', 'Yemekhane', 'Sabah Kahvaltısı', 'Akşam Yemeği'],
  yemekhane: ['Restoran - Yemekhane', 'Yemekhane'],
  restoran: ['Restoran - Yemekhane', 'Yemekhane'],
  'restoran - yemekhane': ['Restoran - Yemekhane'],
  kahvalti: ['Sabah Kahvaltısı'],
  kahvaltı: ['Sabah Kahvaltısı'],
  'sabah kahvaltısı': ['Sabah Kahvaltısı'],
  'sabah kahvaltisi': ['Sabah Kahvaltısı'],
  'aksam yemegi': ['Akşam Yemeği'],
  'akşam yemeği': ['Akşam Yemeği'],
  kantin: ['Kantin', 'Kafeterya'],
  kafeterya: ['Kafeterya', 'Kantin'],
  mutfak: ['Mutfak', 'Mutfak Aletleri'],

  // İklimlendirme & Konfor
  klima: ['Klima'],
  klimali: ['Klima'],
  klimalı: ['Klima'],
  'yerden isitma': ['Yerden Isıtma'],
  'yerden ısıtma': ['Yerden Isıtma'],

  // Ulaşım
  servis: ['Okul Servisi'],
  servisli: ['Okul Servisi'],
  'okul servisi': ['Okul Servisi'],
  shuttle: ['Okul Servisi'],
  ring: ['Okul Servisi'],

  // Dış Mekan / Manzara
  balkon: ['Balkon', 'Odalarda Balkon', 'Teras'],
  balkonlu: ['Balkon', 'Odalarda Balkon'],
  'odalarda balkon': ['Odalarda Balkon', 'Balkon'],
  teras: ['Teras', 'Balkon'],
  bahce: ['Bahçe', 'Bahçe Manzaralı'],
  bahçe: ['Bahçe', 'Bahçe Manzaralı'],
  'bahçe manzaralı': ['Bahçe Manzaralı', 'Bahçe'],
  'deniz manzaralı': ['Deniz Manzaralı'],

  // Çalışma & Kütüphane
  kutuphane: ['Kütüphane'],
  kütüphane: ['Kütüphane'],
  etut: ['Etüt Odaları', 'Etüt Salonu'],
  etüt: ['Etüt Odaları', 'Etüt Salonu'],
  'etüt odası': ['Etüt Odaları', 'Etüt Salonu'],
  'etut odasi': ['Etüt Odaları', 'Etüt Salonu'],
  'etüt salonu': ['Etüt Salonu', 'Etüt Odaları'],
  'çizim odası': ['Çizim Odası'],
  'cizim odasi': ['Çizim Odası'],
  'calisma masasi': ['Kişiye Özel Çalışma Masası', 'Çalışma Masası'],
  'çalışma masası': ['Kişiye Özel Çalışma Masası', 'Çalışma Masası'],
  'kisiye ozel calisma masasi': ['Kişiye Özel Çalışma Masası', 'Çalışma Masası'],
  'kişiye özel çalışma masası': ['Kişiye Özel Çalışma Masası', 'Çalışma Masası'],
  kitaplik: ['Kitaplık'],
  kitaplık: ['Kitaplık'],

  // Güvenlik & İdari
  guvenlik: ['24 Saat Güvenlik', 'Güvenlik Kamerası'],
  güvenlik: ['24 Saat Güvenlik', 'Güvenlik Kamerası'],
  '24 saat güvenlik': ['24 Saat Güvenlik'],
  '24 saat guvenlik': ['24 Saat Güvenlik'],
  '7/24 guvenlik': ['24 Saat Güvenlik'],
  '7/24 güvenlik': ['24 Saat Güvenlik'],
  'guvenlik kamerasi': ['Güvenlik Kamerası', '24 Saat Güvenlik'],
  'güvenlik kamerası': ['Güvenlik Kamerası', '24 Saat Güvenlik'],
  '24 saat yonetici': ['24 Saat Yönetici'],
  '24 saat yönetici': ['24 Saat Yönetici'],
  '7/24 resepsiyon': ['7/24 Resepsiyon', '24 Saat Yönetici'],
  'parmak izi': ['Parmak Okuyucu Giriş Sistemi'],
  'parmak okuyucu': ['Parmak Okuyucu Giriş Sistemi'],
  'yangin alarmi': ['Yangın Alarmı'],
  'yangın alarmı': ['Yangın Alarmı'],
  'yangin merdiveni': ['Yangın Merdiveni'],
  'yangın merdiveni': ['Yangın Merdiveni'],

  // Su & Altyapı
  'sicak su': ['7/24 Sıcak Su', '24 Saat Sıcak Su'],
  'sıcak su': ['7/24 Sıcak Su', '24 Saat Sıcak Su'],
  '7/24 sıcak su': ['7/24 Sıcak Su', '24 Saat Sıcak Su'],
  '24 saat sıcak su': ['24 Saat Sıcak Su', '7/24 Sıcak Su'],
  'icme suyu': ['Ücretsiz İçme Suyu'],
  'içme suyu': ['Ücretsiz İçme Suyu'],
  'ücretsiz içme suyu': ['Ücretsiz İçme Suyu'],
  'ucretsiz icme suyu': ['Ücretsiz İçme Suyu'],
  aritma: ['Ücretsiz İçme Suyu'],
  arıtma: ['Ücretsiz İçme Suyu'],
  jenerator: ['Jeneratör'],
  jeneratör: ['Jeneratör'],
  asansor: ['Asansör'],
  asansör: ['Asansör'],
  'su deposu': ['Su Deposu'],

  // Çamaşır & Temizlik
  camasir: ['Çamaşır Odası', 'Çamaşırhane', 'Çamaşır Makinesi'],
  çamaşır: ['Çamaşır Odası', 'Çamaşırhane', 'Çamaşır Makinesi'],
  çamaşırhane: ['Çamaşırhane', 'Çamaşır Odası'],
  camasirhane: ['Çamaşırhane', 'Çamaşır Odası'],
  'çamaşır odası': ['Çamaşır Odası', 'Çamaşırhane'],
  'camasir odasi': ['Çamaşır Odası', 'Çamaşırhane'],
  'çamaşır makinesi': ['Çamaşır Makinesi', 'Çamaşır Odası', 'Çamaşırhane'],
  'kurutma makinesi': ['Kurutma Makinesi', 'Çamaşır Odası'],
  'bulaşık makinesi': ['Bulaşık Makinesi'],
  'ütü odası': ['Ütü Odası'],
  'utu odasi': ['Ütü Odası'],
  temizlik: ['Oda Temizliği', 'Temizlik', 'Temizlik Hizmeti'],
  'oda temizliği': ['Oda Temizliği', 'Temizlik'],
  'oda temizligi': ['Oda Temizliği', 'Temizlik'],

  // İnternet
  wifi: ['Ücretsiz Wi-Fi', 'Wifi', 'Ücretsiz İnternet'],
  internet: ['Ücretsiz Wi-Fi', 'Wifi', 'Ücretsiz İnternet'],
  'ucretsiz wifi': ['Ücretsiz Wi-Fi', 'Wifi'],
  'ücretsiz wi-fi': ['Ücretsiz Wi-Fi', 'Wifi'],
  'ücretsiz internet': ['Ücretsiz İnternet', 'Ücretsiz Wi-Fi', 'Wifi'],

  // Oda Eşyaları & Yatak & Dolap
  dolap: ['Kişisel Dolap', 'Gardırop'],
  gardirop: ['Gardırop', 'Kişisel Dolap'],
  gardırop: ['Gardırop', 'Kişisel Dolap'],
  'kisisel dolap': ['Kişisel Dolap', 'Gardırop'],
  'kişisel dolap': ['Kişisel Dolap', 'Gardırop'],
  baza: ['Yatak Bazalı'],
  bazali: ['Yatak Bazalı'],
  bazalı: ['Yatak Bazalı'],
  ranza: ['Yatak Ranzalı'],
  ranzali: ['Yatak Ranzalı'],
  ranzalı: ['Yatak Ranzalı'],
  'yatak bazalı': ['Yatak Bazalı'],
  'yatak ranzalı': ['Yatak Ranzalı'],
  'bavul odası': ['Bavul Odası'],
  'bavul odasi': ['Bavul Odası'],
  'mini buzdolabı': ['Mini Buzdolabı'],
  'mini buzdolabi': ['Mini Buzdolabı'],
  buzdolabi: ['Mini Buzdolabı'],
  buzdolabı: ['Mini Buzdolabı'],
  televizyon: ['Televizyon', 'TV'],
  tv: ['TV', 'Televizyon'],

  // Sosyal & İbadet
  mescit: ['Mescit'],
  revir: ['Revir'],
  'oyun konsolları': ['Oyun Konsolları'],
  bilardo: ['Bilardo'],
  'masa tenisi': ['Masa Tenisi'],
  'dinlenme odası': ['Dinlenme Odası'],
};

function normalizeTurkishForSearch(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/[()\-–—_.,;:*+/]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim();
}

export function resolveFeatureMatches(featureInput: string): string[] {
  if (!featureInput || !featureInput.trim()) return [];
  const rawClean = featureInput.trim();
  const norm = normalizeTurkishForSearch(rawClean);

  if (FEATURE_SYNONYMS[norm]) {
    return FEATURE_SYNONYMS[norm];
  }

  // Check sub-phrases / keywords in the input (e.g. "banyo - tuvalet (oda içinde)" -> matches "banyo", "tuvalet")
  const matchedSet = new Set<string>();

  // Direct word token check
  const tokens = norm.split(/\s+/).filter((t) => t.length >= 2);
  for (const token of tokens) {
    if (FEATURE_SYNONYMS[token]) {
      FEATURE_SYNONYMS[token].forEach((v) => matchedSet.add(v));
    }
  }

  // Substring checks in dictionary
  for (const [key, values] of Object.entries(FEATURE_SYNONYMS)) {
    if (norm.includes(key) || key.includes(norm)) {
      values.forEach((v) => matchedSet.add(v));
    }
  }

  if (matchedSet.size > 0) {
    return Array.from(matchedSet);
  }

  return [rawClean];
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

export async function searchDorms(params: DormSearchParams): Promise<DormSearchResult[]> {
  const limit = Math.min(Math.max(Number(params.limit) || 3, 1), 12);
  const isUniversitySearch = Boolean(
    (params.university && params.university.trim()) ||
    (params.query && /üni|uni|kampüs|kampus|yerleşke|yerleske/i.test(params.query))
  );

  // Common filters builder
  const buildConditions = (aliasPrefix = 'd.') => {
    const conditions: string[] = [`${aliasPrefix}status = 1`];
    const sqlParams: any[] = [];

    // Exclude previously seen dorm IDs if specified
    if (params.excludeDormIds && Array.isArray(params.excludeDormIds)) {
      const validExcludeIds = params.excludeDormIds
        .map((id) => Number(id))
        .filter((id) => !isNaN(id) && id > 0);

      if (validExcludeIds.length > 0) {
        const placeholders = validExcludeIds.map(() => '?').join(', ');
        conditions.push(`${aliasPrefix}dorm_id NOT IN (${placeholders})`);
        sqlParams.push(...validExcludeIds);
      }
    }

    if (params.city && params.city.trim()) {
      const cityTrim = params.city.trim();
      conditions.push(`(${aliasPrefix}city_name LIKE ? OR ${aliasPrefix}city_slug = ? OR ${aliasPrefix}city_name LIKE ?)`);
      sqlParams.push(`%${cityTrim}%`, cityTrim.toLowerCase(), `%${cityTrim.replace(/i/gi, 'İ')}%`);
    }

    if (params.district && params.district.trim()) {
      const distTrim = params.district.trim();
      conditions.push(`(${aliasPrefix}district_name LIKE ? OR ${aliasPrefix}district_slug = ? OR ${aliasPrefix}district_name LIKE ?)`);
      sqlParams.push(`%${distTrim}%`, distTrim.toLowerCase(), `%${distTrim.replace(/i/gi, 'İ')}%`);
    }

    if (params.gender && params.gender.trim()) {
      const g = params.gender.trim().toLowerCase();
      if (g.includes('kız') || g.includes('kiz') || g.includes('bayan') || g.includes('kadın')) {
        conditions.push(`${aliasPrefix}gender LIKE ?`);
        sqlParams.push('%Kız%');
      } else if (g.includes('erkek') || g.includes('bay')) {
        conditions.push(`${aliasPrefix}gender LIKE ?`);
        sqlParams.push('%Erkek%');
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
    if (textQuery && !isUniversitySearch) {
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
          conditions.push(`${aliasPrefix}feature_names_text LIKE ?`);
          sqlParams.push(`%${resolvedNames[0]}%`);
        } else if (resolvedNames.length > 1) {
          const featureOrClauses = resolvedNames.map(() => `${aliasPrefix}feature_names_text LIKE ?`).join(' OR ');
          conditions.push(`(${featureOrClauses})`);
          for (const rn of resolvedNames) {
            sqlParams.push(`%${rn}%`);
          }
        }
      }
    }

    if (textQuery && !isUniversitySearch) {
      conditions.push(
        `(${aliasPrefix}dorm_name LIKE ? OR ${aliasPrefix}feature_names_text LIKE ? OR ${aliasPrefix}description_snippet LIKE ?)`
      );
      sqlParams.push(`%${textQuery}%`, `%${textQuery}%`, `%${textQuery}%`);
    }

    if (params.minRating && params.minRating > 0) {
      conditions.push(`${aliasPrefix}google_rating >= ?`);
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

    return { conditions, sqlParams };
  };

  // Case 1: University search using ai_dorm_university_flat
  if (isUniversitySearch) {
    const { conditions, sqlParams } = buildConditions('d.');
    const uniKeywords = resolveUniversityKeywords(params.university, params.query);

    if (uniKeywords.length > 0) {
      const uniOrClauses = uniKeywords.slice(0, 6).map(() => 'uf.university_name LIKE ?').join(' OR ');
      conditions.push(`(${uniOrClauses})`);
      uniKeywords.slice(0, 6).forEach((kw) => sqlParams.push(`%${kw}%`));
    }

    conditions.push('uf.within_20km = 1');

    const whereClause = conditions.join(' AND ');
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
        d.detail_path,
        p.predicted_min_price,
        p.predicted_max_price,
        p.confidence_level,
        uf.university_id,
        uf.university_name,
        uf.walking_minutes,
        uf.walking_distance_km,
        uf.driving_minutes,
        uf.driving_distance_km
      FROM ai_dorm_university_flat uf
      JOIN ai_dorm_search_index d ON uf.dorm_id = d.dorm_id
      LEFT JOIN dorm_price_predictions p ON d.dorm_id = p.dorm_id
      WHERE ${whereClause}
      ORDER BY 
        uf.walking_distance_km ASC,
        uf.driving_distance_km ASC,
        d.google_rating DESC
      LIMIT ?
    `;

    // Fetch extra to handle multi-campus deduplication
    sqlParams.push(limit * 3);
    const rows = await executeQuery<any>(sql, sqlParams);

    const seenDorms = new Set<number>();
    const results: DormSearchResult[] = [];

    for (const row of rows) {
      if (seenDorms.has(row.dorm_id)) continue;
      seenDorms.add(row.dorm_id);

      const contact = parseJsonSafe(row.contact_json, {});
      const pros = parseJsonSafe(row.review_pros_raw, []);
      const cons = parseJsonSafe(row.review_cons_raw, []);
      const rawFeatures = row.feature_names_text
        ? row.feature_names_text.split('|').map((s: string) => s.trim()).filter(Boolean)
        : [];
      const featuresList = sortFeaturesByRarity(rawFeatures);
      const distanceKm = row.walking_distance_km != null
        ? Number(row.walking_distance_km)
        : row.driving_distance_km != null
        ? Number(row.driving_distance_km)
        : null;

      results.push({
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
        nearUniversities: formatFlatUniversityRoute(row),
        distanceKm,
      });

      if (results.length >= limit) break;
    }

    return results;
  }

  // Case 2: General / non-university search
  const { conditions, sqlParams } = buildConditions('d.');
  const whereClause = conditions.join(' AND ');

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

  sqlParams.push(limit);
  const rows = await executeQuery<any>(sql, sqlParams);

  if (rows.length === 0) return [];

  // Batch query closest universities for these dorms from ai_dorm_university_flat
  const dormIds = rows.map((r) => r.dorm_id);
  const dormUniversitiesMap = new Map<number, string[]>();

  if (dormIds.length > 0) {
    try {
      const placeholders = dormIds.map(() => '?').join(',');
      const uniRows = await executeQuery<any>(
        `SELECT dorm_id, university_name, walking_minutes, walking_distance_km, driving_minutes, driving_distance_km 
         FROM ai_dorm_university_flat 
         WHERE dorm_id IN (${placeholders}) AND within_20km = 1 
         ORDER BY walking_distance_km ASC`,
        dormIds
      );

      for (const uRow of uniRows) {
        if (!dormUniversitiesMap.has(uRow.dorm_id)) {
          dormUniversitiesMap.set(uRow.dorm_id, []);
        }
        const list = dormUniversitiesMap.get(uRow.dorm_id)!;
        if (list.length < 2) {
          list.push(formatFlatUniversityRoute(uRow));
        }
      }
    } catch {
      // Graceful fallback
    }
  }

  return rows.map((row) => {
    const contact = parseJsonSafe(row.contact_json, {});
    const pros = parseJsonSafe(row.review_pros_raw, []);
    const cons = parseJsonSafe(row.review_cons_raw, []);
    const rawFeatures = row.feature_names_text
      ? row.feature_names_text.split('|').map((s: string) => s.trim()).filter(Boolean)
      : [];
    const featuresList = sortFeaturesByRarity(rawFeatures);
    const closeUnis = dormUniversitiesMap.get(row.dorm_id);

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
      nearUniversities: closeUnis && closeUnis.length > 0 ? closeUnis.join(' | ') : null,
      distanceKm: null,
    };
  });
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
  const rawFeatures = row.feature_names_text
    ? row.feature_names_text.split('|').map((s: string) => s.trim()).filter(Boolean)
    : [];
  const featuresList = sortFeaturesByRarity(rawFeatures);

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

  // Fetch university routes from ai_dorm_university_flat
  let nearUniversitiesFormatted: string | null = null;
  let distanceKm: number | null = null;

  try {
    if (targetUniversity && targetUniversity.trim()) {
      const searchKeywords = resolveUniversityKeywords(targetUniversity);
      if (searchKeywords.length > 0) {
        const uniOrClauses = searchKeywords.slice(0, 6).map(() => 'university_name LIKE ?').join(' OR ');
        const flatParams = [row.dorm_id, ...searchKeywords.slice(0, 6).map((kw) => `%${kw}%`)];
        const flatRows = await executeQuery<any>(
          `SELECT university_name, walking_minutes, walking_distance_km, driving_minutes, driving_distance_km, within_20km 
           FROM ai_dorm_university_flat 
           WHERE dorm_id = ? AND (${uniOrClauses}) 
           ORDER BY walking_distance_km ASC 
           LIMIT 1`,
          flatParams
        );

        if (flatRows.length > 0) {
          nearUniversitiesFormatted = formatFlatUniversityRoute(flatRows[0]);
          distanceKm = flatRows[0].walking_distance_km != null
            ? Number(flatRows[0].walking_distance_km)
            : flatRows[0].driving_distance_km != null
            ? Number(flatRows[0].driving_distance_km)
            : null;
        }
      }
    } else {
      // Top 3 closest universities within 20km
      const flatRows = await executeQuery<any>(
        `SELECT university_name, walking_minutes, walking_distance_km, driving_minutes, driving_distance_km 
         FROM ai_dorm_university_flat 
         WHERE dorm_id = ? AND within_20km = 1 
         ORDER BY walking_distance_km ASC 
         LIMIT 3`,
        [row.dorm_id]
      );

      if (flatRows.length > 0) {
        nearUniversitiesFormatted = flatRows.map((f: any) => formatFlatUniversityRoute(f)).join(' | ');
      }
    }
  } catch {
    nearUniversitiesFormatted = null;
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
    nearUniversities: nearUniversitiesFormatted,
    distanceKm,
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
