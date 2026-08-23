/**
 * Eyurtlar Yurt Özellikleri Nadirlik ve Frekans Haritası
 * 
 * Veritabanındaki 1.468 aktif yurt üzerinden hesaplanmıştır.
 * Toplamda yurtların %30 veya daha azında bulunan özellikler "Nadir / Öne Çıkan Özellik" (Rare Feature)
 * olarak kabul edilir ve listelemelerde en başa alınır.
 */

export interface FeatureStats {
  count: number;
  ratio: number; // 0.0 - 1.0 (örn: 0.047 = %4.7)
  pct: number;   // Yüzde (örn: 4.7)
}

// 1.468 Yurt Üzerindeki Kesin DB Frekans Dağılımı
export const FEATURE_FREQUENCY_MAP: Record<string, FeatureStats> = {
  // === ÇOK NADİR VE SEÇKİN ÖZELLİKLER (<= %5) ===
  'özel banyo': { count: 2, ratio: 0.0014, pct: 0.14 },
  'bahçe manzaralı': { count: 3, ratio: 0.0020, pct: 0.20 },
  'havlu değişimi': { count: 3, ratio: 0.0020, pct: 0.20 },
  'deniz manzaralı': { count: 3, ratio: 0.0020, pct: 0.20 },
  'yerden ısıtma': { count: 6, ratio: 0.0041, pct: 0.41 },
  'hamam': { count: 7, ratio: 0.0048, pct: 0.48 },
  'spa ve sağlık merkezi': { count: 13, ratio: 0.0089, pct: 0.89 },
  'sauna': { count: 14, ratio: 0.0095, pct: 0.95 },
  '7/24 resepsiyon': { count: 22, ratio: 0.0150, pct: 1.50 },
  'balkon': { count: 23, ratio: 0.0157, pct: 1.57 },
  'oyun konsolları': { count: 24, ratio: 0.0163, pct: 1.63 },
  'bilardo': { count: 26, ratio: 0.0177, pct: 1.77 },
  'bulaşık makinesi': { count: 27, ratio: 0.0184, pct: 1.84 },
  'mutfak aletleri': { count: 33, ratio: 0.0225, pct: 2.25 },
  'çamaşır yıkama hizmeti': { count: 34, ratio: 0.0232, pct: 2.32 },
  'kanepe': { count: 35, ratio: 0.0238, pct: 2.38 },
  'lig tv': { count: 35, ratio: 0.0238, pct: 2.38 },
  'okul servisi': { count: 39, ratio: 0.0266, pct: 2.66 },
  'yemek masası': { count: 48, ratio: 0.0327, pct: 3.27 },
  'klima': { count: 50, ratio: 0.0341, pct: 3.41 },
  'otopark': { count: 50, ratio: 0.0341, pct: 3.41 },
  'çarşaf değişimi': { count: 60, ratio: 0.0409, pct: 4.09 },
  'temizlik hizmeti': { count: 61, ratio: 0.0416, pct: 4.16 },
  'yazıcı/fotokopi': { count: 65, ratio: 0.0443, pct: 4.43 },
  'yüzme havuzu': { count: 69, ratio: 0.0470, pct: 4.70 },

  // === NADİR VE AYIRT EDİCİ ÖZELLİKLER (%5 - %15) ===
  'kurutma makinesi': { count: 81, ratio: 0.0552, pct: 5.52 },
  'odalarda balkon': { count: 85, ratio: 0.0579, pct: 5.79 },
  'ücretsiz internet': { count: 92, ratio: 0.0627, pct: 6.27 },
  'tv': { count: 98, ratio: 0.0668, pct: 6.68 },
  'masa tenisi': { count: 100, ratio: 0.0681, pct: 6.81 },
  'parmak okuyucu giriş sistemi': { count: 106, ratio: 0.0722, pct: 7.22 },
  'etüt salonu': { count: 122, ratio: 0.0831, pct: 8.31 },
  'kafeterya': { count: 124, ratio: 0.0845, pct: 8.45 },
  'çizim odası': { count: 125, ratio: 0.0851, pct: 8.51 },
  'mutfak': { count: 130, ratio: 0.0886, pct: 8.86 },
  'teras': { count: 166, ratio: 0.1131, pct: 11.31 },
  'çamaşır makinesi': { count: 167, ratio: 0.1138, pct: 11.38 },
  'yemekhane': { count: 179, ratio: 0.1219, pct: 12.19 },
  'spor salonu': { count: 201, ratio: 0.1369, pct: 13.69 },
  'su deposu': { count: 205, ratio: 0.1396, pct: 13.96 },
  'revir': { count: 207, ratio: 0.1410, pct: 14.10 },
  'mini buzdolabı': { count: 218, ratio: 0.1485, pct: 14.85 },

  // === ÖNE ÇIKAN ÖZELLİKLER (%15 - %30) ===
  'mescit': { count: 237, ratio: 0.1614, pct: 16.14 },
  'dinlenme odası': { count: 239, ratio: 0.1628, pct: 16.28 },
  'bahçe': { count: 246, ratio: 0.1676, pct: 16.76 },
  'çamaşırhane': { count: 261, ratio: 0.1778, pct: 17.78 },
  'akşam yemeği': { count: 343, ratio: 0.2337, pct: 23.37 },
  'ütü odası': { count: 380, ratio: 0.2589, pct: 25.89 },
  'kütüphane': { count: 399, ratio: 0.2718, pct: 27.18 },
  'televizyon': { count: 414, ratio: 0.2820, pct: 28.20 },
  'kantin': { count: 432, ratio: 0.2943, pct: 29.43 },

  // === STANDART / YAYGIN BULUNAN ÖZELLİKLER (> %30) ===
  'fitness salonu': { count: 444, ratio: 0.3025, pct: 30.25 },
  'restoran - yemekhane': { count: 450, ratio: 0.3065, pct: 30.65 },
  'wifi': { count: 544, ratio: 0.3706, pct: 37.06 },
  'wc-banyo': { count: 571, ratio: 0.3890, pct: 38.90 },
  'gardırop': { count: 574, ratio: 0.3910, pct: 39.10 },
  'yatak ranzalı': { count: 578, ratio: 0.3937, pct: 39.37 },
  'ücretsiz içme suyu': { count: 612, ratio: 0.4169, pct: 41.69 },
  'banyo': { count: 615, ratio: 0.4189, pct: 41.89 },
  'sabah kahvaltısı': { count: 633, ratio: 0.4312, pct: 43.12 },
  'etüt odaları': { count: 640, ratio: 0.4360, pct: 43.60 },
  '24 saat yönetici': { count: 645, ratio: 0.4394, pct: 43.94 },
  'asansör': { count: 679, ratio: 0.4625, pct: 46.25 },
  'güvenlik kamerası': { count: 712, ratio: 0.4850, pct: 48.50 },
  '24 saat sıcak su': { count: 743, ratio: 0.5061, pct: 50.61 },
  'çamaşır odası': { count: 777, ratio: 0.5293, pct: 52.93 },
  'çalışma masası': { count: 785, ratio: 0.5347, pct: 53.47 },
  'temizlik': { count: 879, ratio: 0.5988, pct: 59.88 },
  'bavul odası': { count: 975, ratio: 0.6642, pct: 66.42 },
  'yatak bazalı': { count: 1001, ratio: 0.6819, pct: 68.19 },
  '7/24 sıcak su': { count: 1005, ratio: 0.6846, pct: 68.46 },
  'yangın alarmı': { count: 1046, ratio: 0.7125, pct: 71.25 },
  'yangın merdiveni': { count: 1088, ratio: 0.7411, pct: 74.11 },
  'jeneratör': { count: 1092, ratio: 0.7439, pct: 74.39 },
  '24 saat güvenlik': { count: 1100, ratio: 0.7493, pct: 74.93 },
  'kitaplık': { count: 1212, ratio: 0.8256, pct: 82.56 },
  'ücretsiz wi-fi': { count: 1227, ratio: 0.8358, pct: 83.58 },
  'oda temizliği': { count: 1233, ratio: 0.8399, pct: 83.99 },
  'kişiye özel çalışma masası': { count: 1245, ratio: 0.8481, pct: 84.81 },
  'kişisel dolap': { count: 1299, ratio: 0.8849, pct: 88.49 },
};

/**
 * Özellik adını normalize eder (Türkçe karakter ve küçük harf uyumu)
 */
export function normalizeFeatureKey(name: string): string {
  return name.trim().toLocaleLowerCase('tr');
}

/**
 * Belirtilen özelliğin nadirlik oranını (0.001 - 0.999) döndürür.
 * Bulunamazsa varsayılan 0.50 kabul edilir.
 */
export function getFeatureRarityRatio(featureName: string): number {
  const key = normalizeFeatureKey(featureName);
  if (FEATURE_FREQUENCY_MAP[key]) {
    return FEATURE_FREQUENCY_MAP[key].ratio;
  }
  // Kısmi eşleşme kontrolü
  for (const [mapKey, stats] of Object.entries(FEATURE_FREQUENCY_MAP)) {
    if (key.includes(mapKey) || mapKey.includes(key)) {
      return stats.ratio;
    }
  }
  return 0.50; // Bilinmeyen varsayılan
}

/**
 * Özellik %30 veya daha az yurtta mı bulunuyor? (Nadir/Seçkin mi?)
 */
export function isRareFeature(featureName: string, thresholdRatio = 0.30): boolean {
  return getFeatureRarityRatio(featureName) <= thresholdRatio;
}

/**
 * Özellikler listesini nadirlik sırasına göre sıralar (En nadir olanlar en başta).
 */
export function sortFeaturesByRarity(features: string[]): string[] {
  if (!features || !Array.isArray(features)) return [];
  return [...features].sort((a, b) => {
    const ratioA = getFeatureRarityRatio(a);
    const ratioB = getFeatureRarityRatio(b);
    return ratioA - ratioB;
  });
}

/**
 * Özellikleri "Nadir / Öne Çıkan" (<= %30) ve "Standart / Yaygın" (> %30) olarak ikiye ayırır.
 */
export function categorizeFeatures(features: string[], thresholdRatio = 0.30): {
  rareFeatures: string[];
  standardFeatures: string[];
} {
  const sorted = sortFeaturesByRarity(features);
  const rareFeatures: string[] = [];
  const standardFeatures: string[] = [];

  for (const feat of sorted) {
    if (getFeatureRarityRatio(feat) <= thresholdRatio) {
      rareFeatures.push(feat);
    } else {
      standardFeatures.push(feat);
    }
  }

  return { rareFeatures, standardFeatures };
}

/**
 * Özellik için uygun görsel ikon veya emoji döndürür.
 */
export function getFeatureIcon(featureName: string): string {
  const key = normalizeFeatureKey(featureName);
  if (key.includes('havuz')) return '🏊';
  if (key.includes('spa') || key.includes('hamam') || key.includes('sauna')) return '🧖';
  if (key.includes('klima')) return '❄️';
  if (key.includes('servis')) return '🚌';
  if (key.includes('otopark')) return '🚗';
  if (key.includes('spor') || key.includes('fitness')) return '🏋️';
  if (key.includes('balkon') || key.includes('teras')) return '🌿';
  if (key.includes('akşam yemeği')) return '🍲';
  if (key.includes('kahvaltı')) return '🍳';
  if (key.includes('yemek')) return '🍽️';
  if (key.includes('çizim')) return '📐';
  if (key.includes('yazıcı') || key.includes('fotokopi')) return '🖨️';
  if (key.includes('mutfak')) return '🍳';
  if (key.includes('çamaşır') || key.includes('kurutma')) return '🧺';
  if (key.includes('oyun') || key.includes('bilardo') || key.includes('konsol')) return '🎮';
  if (key.includes('bahçe')) return '🌳';
  if (key.includes('revir')) return '🩺';
  if (key.includes('kütüphane') || key.includes('etüt')) return '📚';
  if (key.includes('banyo')) return '🚿';
  if (key.includes('wifi') || key.includes('internet')) return '📶';
  if (key.includes('güvenlik')) return '🛡️';
  return '✨';
}
