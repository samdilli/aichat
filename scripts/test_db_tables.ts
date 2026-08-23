import mysql from 'mysql2/promise';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function runDatabaseHealthCheck() {
  console.log('====================================================');
  console.log('🚀 EYURTLAR VERİTABANI TABLO & SERVİS TESTİ BAŞLATILIYOR');
  console.log('====================================================\n');

  let conn: mysql.Connection | null = null;

  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST || '84.247.20.88',
      user: process.env.DB_USER || 'eyur_eyurtlark',
      password: process.env.DB_PASSWORD || 'Corleone86159669000*',
      database: process.env.DB_NAME || 'eyur_eyurtlar',
      port: Number(process.env.DB_PORT || 3306),
      connectTimeout: 10000,
    });

    console.log('✅ MySQL Bağlantısı Başarılı!\n');

    // Test listesi: Tablo adı, Açıklama, Test Sorgusu
    const testSuites = [
      {
        name: 'ai_dorm_search_index',
        title: 'Ana Yurt Arama & Dizin Tablosu',
        query: 'SELECT dorm_id, dorm_name, city_name, district_name, gender, google_rating, google_review_count FROM ai_dorm_search_index WHERE status = 1 LIMIT 3;',
      },
      {
        name: 'dorm_price_predictions',
        title: 'Fiyat Tahminleri Tablosu',
        query: 'SELECT dorm_id, predicted_min_price, predicted_max_price, confidence_level FROM dorm_price_predictions WHERE predicted_min_price IS NOT NULL LIMIT 3;',
      },
      {
        name: 'universities',
        title: 'Üniversiteler Tablosu',
        query: 'SELECT id, name, slug, cityId, lat, lng FROM universities LIMIT 3;',
      },
      {
        name: 'transit_stations',
        title: 'Toplu Taşıma İstasyonları Tablosu',
        query: 'SELECT id, name, type, line_code, line_name, city, lat, lng FROM transit_stations WHERE is_active = 1 LIMIT 3;',
      },
      {
        name: 'JOIN: ai_dorm_search_index + dorm_price_predictions',
        title: 'Yurt Arama + Fiyat Tahmini JOIN Testi',
        query: `
          SELECT 
            d.dorm_id, 
            d.dorm_name, 
            d.city_name, 
            d.district_name, 
            p.predicted_min_price, 
            p.predicted_max_price 
          FROM ai_dorm_search_index d
          LEFT JOIN dorm_price_predictions p ON d.dorm_id = p.dorm_id
          WHERE d.status = 1 AND p.predicted_min_price > 0
          LIMIT 3;
        `,
      },
      {
        name: 'ai_dorm_university_flat',
        title: 'Üniversite Mesafe & Süre Tablosu',
        query: 'SELECT dorm_id, university_name, walking_minutes, driving_minutes FROM ai_dorm_university_flat LIMIT 3;',
      },
      {
        name: 'dorm_reviews',
        title: 'Google Yorumları Tablosu',
        query: 'SELECT id, dorm_id, reviewer_name, rating, LEFT(review_text, 60) as short_review FROM dorm_reviews LIMIT 3;',
      },
      {
        name: 'cities & districts',
        title: 'Şehir & İlçe Tabloları (cityId ile JOIN)',
        query: 'SELECT c.name as city, d.name as district FROM cities c JOIN districts d ON d.cityId = c.id LIMIT 3;',
      }
    ];

    const results: Array<{ name: string; title: string; status: 'SUCCESS' | 'FAILED'; rowCount: number; durationMs: number; error?: string }> = [];

    for (let i = 0; i < testSuites.length; i++) {
      const suite = testSuites[i];
      console.log(`[${i + 1}/${testSuites.length}] Test Ediliyor: ${suite.title} (${suite.name})...`);

      const startTime = Date.now();
      try {
        const [rows]: any = await conn.query(suite.query);
        const duration = Date.now() - startTime;

        results.push({
          name: suite.name,
          title: suite.title,
          status: 'SUCCESS',
          rowCount: rows.length,
          durationMs: duration,
        });

        console.log(`   -> Durum: ✅ BAŞARILI (${rows.length} satır geldi, Süre: ${duration}ms)`);
      } catch (err: any) {
        const duration = Date.now() - startTime;
        results.push({
          name: suite.name,
          title: suite.title,
          status: 'FAILED',
          rowCount: 0,
          durationMs: duration,
          error: err.message,
        });

        console.log(`   -> Durum: ❌ HATA (${err.message})`);
      }

      // Her sorgu arasına 1.2 saniye bekleme süresi (Rate Limit & Sunucu yükü önlemi)
      if (i < testSuites.length - 1) {
        console.log('   ⏳ 1.2 saniye bekleniyor (rate-limit koruması)...');
        await sleep(1200);
      }
      console.log('');
    }

    console.log('====================================================');
    console.log('📊 TEST ÖZETİ VE RAPOR');
    console.log('====================================================');
    console.table(
      results.map((r) => ({
        Tablo: r.name,
        Durum: r.status === 'SUCCESS' ? '✅ Çalışıyor' : '❌ Hatalı',
        Kayıt: r.rowCount,
        'Süre (ms)': r.durationMs,
        Hata: r.error || '-',
      }))
    );

    const successCount = results.filter((r) => r.status === 'SUCCESS').length;
    console.log(`\nToplam Test: ${testSuites.length} | Başarılı: ${successCount} | Başarısız: ${testSuites.length - successCount}`);

  } catch (globalErr: any) {
    console.error('Kritik Bağlantı Hatası:', globalErr.message);
  } finally {
    if (conn) {
      await conn.end();
      console.log('\n🔒 Veritabanı bağlantısı güvenle kapatıldı.');
    }
  }
}

runDatabaseHealthCheck();
