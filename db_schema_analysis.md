# Eyurtlar Veritabanı Şema ve Veri Mimarisi Raporu

Oluşturulma Tarihi: 20.08.2026 17:45:26

## Tablo: `ai_dorm_search_index`

- **Toplam Kayıt:** 1469

### Sütun Yapısı
| Sütun Adı | Veri Tipi | Null | Anahtar (Key) | Varsayılan | Ekstra |
|---|---|---|---|---|---|
| `dorm_id` | bigint(20) unsigned | NO | PRI | NULL |  |
| `dorm_name` | varchar(512) | NO |  | NULL |  |
| `gender` | varchar(64) | YES |  | NULL |  |
| `dorm_type` | varchar(64) | YES |  | NULL |  |
| `status` | tinyint(4) | NO |  | 1 |  |
| `city_rank` | int(10) unsigned | YES |  | NULL |  |
| `city_id` | int(10) unsigned | NO | MUL | NULL |  |
| `city_name` | varchar(255) | NO |  | NULL |  |
| `city_slug` | varchar(191) | NO |  | NULL |  |
| `district_id` | int(10) unsigned | YES | MUL | NULL |  |
| `district_name` | varchar(255) | YES |  | NULL |  |
| `district_slug` | varchar(191) | YES |  | NULL |  |
| `dorm_slug` | varchar(191) | YES |  | NULL |  |
| `lat` | decimal(10,7) | YES |  | NULL |  |
| `lng` | decimal(10,7) | YES |  | NULL |  |
| `google_rating` | decimal(4,2) | YES | MUL | NULL |  |
| `google_review_count` | int(10) unsigned | YES |  | NULL |  |
| `google_cid` | varchar(64) | YES |  | NULL |  |
| `contact_json` | longtext | YES |  | NULL |  |
| `featured_image` | varchar(1024) | YES |  | NULL |  |
| `gallery_images_json` | longtext | YES |  | NULL |  |
| `description_snippet` | varchar(1000) | YES |  | NULL |  |
| `feature_names_text` | text | YES |  | NULL |  |
| `review_pros_raw` | mediumtext | YES |  | NULL |  |
| `review_cons_raw` | mediumtext | YES |  | NULL |  |
| `review_highlight` | varchar(768) | YES |  | NULL |  |
| `near_universities_text` | mediumtext | YES |  | NULL |  |
| `detail_path` | varchar(768) | NO |  | NULL |  |
| `indexed_at` | timestamp(3) | NO | MUL | current_timestamp(3) |  |

### İndeksler
- **PRIMARY**: (dorm_id)
- **idx_city_active**: (city_id, status)
- **idx_district**: (district_id, status)
- **idx_rating**: (google_rating, dorm_id)
- **idx_indexed**: (indexed_at)

### Örnek Kayıtlar
```json
[
  {
    "dorm_id": 369,
    "dorm_name": "Bilge Özel Kız Öğrenci Yurdu",
    "gender": "Kız",
    "dorm_type": "[\"Kız yurdu\"]",
    "status": 1,
    "city_rank": 9999,
    "city_id": 34,
    "city_name": "İstanbul",
    "city_slug": "istanbul",
    "district_id": 440,
    "district_name": "Eyüpsultan",
    "district_slug": "eyupsultan",
    "dorm_slug": "bilge-ozel-kiz-ogrenci-yurdu",
    "lat": "41.0676580",
    "lng": "28.9476644",
    "google_rating": "4.20",
    "google_review_count": 12,
    "google_cid": "9966754878841779280",
    "contact_json": {
      "phones": [
        "0541 626 94 94",
        "0212 626 94 94",
        null
      ],
      "whatsapp": "05416269494",
      "email": "info@bilgekonukevi.com",
      "website": "http://www.bilgekonukevi.com/",
      "address": "Emniyettepe, Mehtap Cd. No:16, 34060 Eyüpsultan/İstanbul, Türkiye"
    },
    "featured_image": "42dd5579-c539-4955-8d8c-8cb72e69d59c.webp",
    "gallery_images_json": [
      "42dd5579-c539-4955-8d8c-8cb72e69d59c.webp",
      "de8103d3-efd9-4fbe-bf46-4fe34584979e.webp",
      "6f4c32b8-7557-402e-90ac-38d1e0f8c038.webp",
      "c31b80fa-7f94-4a7f-ba0e-35d1606f0780.webp",
      "a1a86944-72bc-4f41-b08a-5f36d716e35d.webp",
      "aac1e7f9-e1d3-42bd-b755-86ede61ca414.webp",
      "77bee0a2-7a9d-40e2-a63e-92d2a3b07bda.webp",
      "a8423527-61d5-4d45-b581-678976d2c569.webp",
      "d42cbe3d-645e-408f-8b36-50d9d895c854.webp",
      "d0039abe-b4c4-41e1-bb46-aac893822668.webp"
    ],
    "description_snippet": "<h2>İstanbul'da Öğrencilere Yönelik Konaklama Seçeneği</h2>  \n<p>Bilge Özel Kız Öğrenci Yurdu, İstanbul'da modern yaşam alanları sunarak kız öğrencilerin hem eğitim hem de sosyal yaşamlarını desteklemeyi amaçlamaktadır.</p>  \n<br>  \n<h3>Yurt Özellikleri</h3>  \n<p>Yurt, birçok olanak ile donatılmıştır. İçerisinde revir, etüt odaları, kütüphane ve fitness salonu gibi yenilikçi alanlar bulunmaktadır. Ayrıca, yemek ihtiyaçları için restoran-yemekhane hizmeti sunulmakta ve hızla ulaşılabilen ücretsiz Wi-Fi mevcuttur. Yurt binası, güvenlik önlemlerinin yanı sıra yangın alarmı ile donatılmıştır.</p>  \n<br>  \n<h3>Oda Özellikleri</h3>  \n<p>Yurt odaları, 7/24 sıcak su imkanı ile rahat bir yaşam alanı sunmaktadır. Oda içerisinde yatak ranzalı veya yatak bazalı seçeneklerle birlikte, her öğrenciye özel çalışma masası, mini buzdolabı ve kitaplık gibi eşyalar bulunmaktadır. Her odada banyo da mevcuttur, bu da kişisel konforu artırmaktadır.</p>  \n<br>  ",
    "feature_names_text": "7/24 Sıcak Su | Bahçe | Banyo | Bavul Odası | Çamaşır Odası | Etüt Odaları | Fitness Salonu | Jeneratör | Kişiye Özel Çalışma Masası | Kitaplık | Kütüphane | Mini Buzdolabı | Okul Servisi | Restoran - Yemekhane | Revir | Televizyon | Temizlik | Teras | Ücretsiz Wi-Fi | Ütü Odası | Yangın Alarmı | Yatak Bazalı | Yatak Ranzalı",
    "review_pros_raw": "[\"Öğrenciler için uygun konaklama\",\"Temiz, huzurlu ve ev sıcaklığı hissi\",\"İyi dekore edilmiş odalar ve ortak alanlar\"]",
    "review_cons_raw": "[\"Temizlik uygulamalarında tutarsızlıklar bildirildi\",\"Yemek hizmetleri genelde ücretli ve sınırlı\"]",
    "review_highlight": "Analizde son tarihlere ve detaylı yorumlara ağırlık verildi. Genel görüşler ağırlıklı olarak olumlu; son ve detaylı incelemeler kurumun öğrenciler için uygun, iyi dekore edilmiş, güvenli ve fiyat/kalite dengesi sunduğunu vurguluyor. Bununla birlikte temizlik ve hizmet kalitesi hakkında çelişkili geri bildirimler mevcut; bazı kullanıcılar çok temiz olduğunu söylerken en az bir detaylı şikayette temizlik yetersizliği ifade ediliyor. Yemeklerin genellikle ücretli olması ve sauna erişim koşullarına ilişkin eleştiriler birkaç incelemede tekrar ediliyor. Özetle, güvenlik ve konfor sıkça övülürken temizlik ve hizmet uygulamalarındaki tutarsızlıklar en belirgin karışık görüş kaynağıdır.",
    "near_universities_text": "Marmara Üniversitesi: yürüyüş 3 sa 46 dk / 16.9 km, araç 20 dk / 17.7 km | Boğaziçi Üniversitesi: yürüyüş 3 sa 44 dk / 16.7 km, araç 23 dk / 19.9 km | İstanbul Teknik Üniversitesi: yürüyüş 4 sa 35 dk / 20.6 km, araç 24 dk / 21.7 km | İstanbul Üniversitesi: yürüyüş 3 sa 45 dk / 16.8 km, araç 20 dk / 17.7 km | Yıldız Teknik Üniversitesi: yürüyüş 3 sa 5 dk / 15.2 km, araç 19 dk / 17.4 km | Koç Üniversitesi: yürüyüş 5 sa 45 dk / 31.7 km, araç 44 dk / 36.4 km | Sabancı Üniversitesi: yürüyüş 6 sa 30 dk / 29.2 km, araç 26 dk / 28.4 km | Özyeğin Üniversitesi: yürüyüş 4 sa 22 dk / 19.6 km, araç 21 dk / 19.9 km | Bahçeşehir Üniversitesi: yürüyüş 3 sa 7 dk / 14.0 km, araç 18 dk / 17.1 km | İstanbul Bilgi Üniversitesi: yürüyüş 4 sa 43 dk / 21.2 km, araç 27 dk / 23.9 km | Altınbaş Üniversitesi: yürüyüş 7 sa 3 dk / 31.7 km, araç 34 dk / 35.5 km | Beykoz Üniversitesi: yürüyüş 5 sa 20 dk / 23.9 km, araç 29 dk / 32.0 km | Bezm-i Âlem Vakıf Üniversitesi: yürüyüş 4 sa 23 dk / 19.7 km, araç 23 dk / 20.0 km | Biruni Üniversitesi: yürüyüş 4 sa 52 dk / 21.8 km, araç 23 dk / 20.9 km | Demiroğlu Bilim Üniversitesi: yürüyüş 4 sa 27 dk / 20.0 km, araç 23 dk / 19.5 km | Doğuş Üniversitesi: yürüyüş 1 sa 34 dk / 7.0 km, araç 9 dk / 6.7 km | Fatih Sultan Mehmet Vakıf Üniversitesi: yürüyüş 1 sa 31 dk / 6.8 km, araç 10 dk / 8.3 km | Fenerbahçe Üniversitesi: yürüyüş 34 dk / 2.5 km, araç 6 dk / 3.1 km | Galatasaray Üniversitesi: yürüyüş 3 sa 23 dk / 15.2 km, araç 19 dk / 18.1 km | Haliç Üniversitesi: yürüyüş 4 sa 15 dk / 20.4 km, araç 21 dk / 21.2 km | Işık Üniversitesi: yürüyüş 14 sa 11 dk / 63.8 km, araç 45 dk / 51.0 km | İbn Haldun Üniversitesi: yürüyüş 9 sa 24 dk / 42.3 km, araç 44 dk / 42.8 km | İstanbul Aydın Üniversitesi: yürüyüş 7 sa 16 dk / 32.6 km, araç 32 dk / 33.9 km | İstanbul Beykent Üniversitesi: yürüyüş 4 sa 51 dk / 21.8 km, araç 25 dk / 21.9 km | İstanbul Gelişim Üniversitesi: yürüyüş 9 sa 10 dk / 41.2 km, araç 40 dk / 41.0 km | İstanbul Medeniyet Üniversitesi: yürüyüş 2 sa 37 dk / 11.8 km, araç 13 dk / 11.9 km | İstanbul Medipol Üniversitesi: yürüyüş 3 sa 58 dk / 17.8 km, araç 21 dk / 22.3 km | İstanbul Nişantaşı Üniversitesi: yürüyüş 5 sa 15 dk / 23.6 km, araç 27 dk / 22.4 km | İstanbul Sabahattin Zaim Üniversitesi: yürüyüş 7 sa 44 dk / 34.7 km, araç 38 dk / 37.2 km | İstanbul Sağlık ve Teknoloji Üniversitesi: yürüyüş 4 sa 28 dk / 20.1 km, araç 23 dk / 22.5 km | İstanbul Üniversitesi-Cerrahpaşa: yürüyüş 6 sa 39 dk / 29.9 km, araç 33 dk / 31.8 km | İstanbul Yeni Yüzyıl Üniversitesi: yürüyüş 5 sa 2 dk / 22.6 km, araç 26 dk / 27.5 km | İstinye Üniversitesi: yürüyüş 5 sa 5 dk / 22.8 km, araç 26 dk / 27.5 km | Kadir Has Üniversitesi: yürüyüş 17 sa 50 dk / 80.2 km, araç 1 sa 5 dk / 72.9 km | Maltepe Üniversitesi: yürüyüş 5 sa 50 dk / 29.2 km, araç 42 dk / 31.5 km | MEF Üniversitesi: yürüyüş 4 sa 49 dk / 21.6 km, araç 25 dk / 21.7 km | Mimar Sinan Güzel Sanatlar Üniversitesi: yürüyüş 3 sa 22 dk / 15.1 km, araç 24 dk / 20.9 km | Piri Reis Üniversitesi: yürüyüş 6 sa 57 dk / 31.2 km, araç 32 dk / 32.7 km | Sağlık Bilimleri Üniversitesi: yürüyüş 2 sa 25 dk / 10.8 km, araç 12 dk / 10.6 km | Türk-Alman Üniversitesi: yürüyüş 5 sa 20 dk / 23.9 km, araç 29 dk / 32.0 km | Üsküdar Üniversitesi: yürüyüş 2 sa 7 dk / 9.5 km, araç 12 dk / 11.2 km | Yeditepe Üniversitesi: yürüyüş 46 dk / 3.4 km, araç 9 dk / 5.4 km | İstanbul Beykent Üniversitesi (Ayazağa - Maslak) Yerleşkesi: yürüyüş 4 sa 51 dk / 21.8 km, araç 25 dk / 21.9 km | İstanbul Beykent Üniversitesi (Beylikdüzü): yürüyüş 11 sa 3 dk / 49.7 km, araç 47 dk / 49.5 km | İstanbul Beykent Üniversitesi (Hadımköy) Yerleşkesi: yürüyüş 13 sa 18 dk / 59.6 km, araç 54 dk / 62.4 km | İstanbul Beykent Üniversitesi (Taksim) Yerleşkesi: yürüyüş 3 sa 34 dk / 16.0 km, araç 24 dk / 21.0 km | İstanbul Teknik Üniversitesi (Ayazağa) Yerleşkesi: yürüyüş 4 sa 35 dk / 20.6 km, araç 24 dk / 21.7 km | İstanbul Teknik Üniversitesi (Maçka) Yerleşkesi: yürüyüş 3 sa 7 dk / 15.3 km, araç 21 dk / 18.5 km | İstanbul Teknik Üniversitesi (Gümüşsuyu) Yerleşkesi: yürüyüş 3 sa 21 dk / 15.0 km, araç 23 dk / 18.9 km | İstanbul Teknik Üniversitesi (Taşkışla) Yerleşkesi: yürüyüş 3 sa 26 dk / 15.4 km, araç 22 dk / 19.2 km | İstanbul Teknik Üniversitesi (Tuzla) Yerleşkesi: yürüyüş 6 sa 50 dk / 30.7 km, araç 28 dk / 31.5 km | Marmara Üniversitesi (Göztepe Kampüsü): yürüyüş 1 sa 41 dk / 7.6 km, araç 13 dk / 7.8 km | Marmara Üniversitesi (Recep Tayyip Erdoğan Kampüsü): yürüyüş 2 sa 21 dk / 10.5 km, araç 13 dk / 11.2 km | Marmara Üniversitesi (Başıbüyük Kampüsü): yürüyüş 1 sa 31 dk / 6.8 km, araç 9 dk / 8.1 km | Yıldız Teknik Üniversitesi (Davutpaşa Kampüsü): yürüyüş 5 sa 27 dk / 24.5 km, araç 30 dk / 29.2 km | Yıldız Teknik Üniversitesi (Beşiktaş - Yıldız Kampüsü): yürüyüş 3 sa 1 dk / 14.9 km, araç 18 dk / 17.0 km | Boğaziçi Üniversitesi (Güney Kampüsü): yürüyüş 3 sa 44 dk / 16.7 km, araç 23 dk / 20.0 km | Boğaziçi Üniversitesi (Kuzey Kampüsü): yürüyüş 3 sa 49 dk / 17.1 km, araç 22 dk / 19.8 km | Boğaziçi Üniversitesi (Kandilli Kampüsü): yürüyüş 2 sa 49 dk / 12.6 km, araç 20 dk / 16.9 km | Boğaziçi Üniversitesi (Kilyos - Sarıtepe Kampüsü): yürüyüş 7 sa 20 dk / 38.8 km, araç 52 dk / 45.2 km | İstanbul Medipol Üniversitesi (Kavacık Kampüsü): yürüyüş 3 sa 58 dk / 17.8 km, araç 21 dk / 22.3 km | İstanbul Medipol Üniversitesi (Haliç Kampüsü): yürüyüş 3 sa 57 dk / 17.7 km, araç 21 dk / 18.6 km | Marmara Üniversitesi (Maltepe Kampüsü): yürüyüş 2 sa 21 dk / 10.5 km, araç 13 dk / 11.2 km | Marmara Üniversitesi (Acıbadem Kampüsü): yürüyüş 1 sa 52 dk / 8.4 km, araç 9 dk / 8.3 km | Marmara Üniversitesi (Bağlarbaşı Kampüsü): yürüyüş 2 sa 20 dk / 10.4 km, araç 12 dk / 11.1 km | İstanbul Medipol Üniversitesi (Bağcılar Kampüsü): yürüyüş 6 sa 26 dk / 28.9 km, araç 33 dk / 34.7 km | İstanbul Bilgi Üniversitesi (Santralİstanbul Kampüsü): yürüyüş 4 sa 43 dk / 21.2 km, araç 27 dk / 23.9 km | İstanbul Bilgi Üniversitesi (Kuştepe Kampüsü): yürüyüş 3 sa 43 dk / 18.0 km, araç 20 dk / 18.2 km | İstanbul Bilgi Üniversitesi (Dolapdere Kampüsü): yürüyüş 3 sa 45 dk / 16.8 km, araç 24 dk / 23.6 km | Bahçeşehir Üniversitesi (Beşiktaş Kampüsü): yürüyüş 3 sa 7 dk / 14.0 km, araç 18 dk / 17.1 km | Bahçeşehir Üniversitesi (Göztepe Kampüsü): yürüyüş 1 sa 29 dk / 6.7 km, araç 10 dk / 8.0 km | Bahçeşehir Üniversitesi (Galata Kampüsü): yürüyüş 3 sa 43 dk / 16.7 km, araç 23 dk / 19.9 km | İstanbul Aydın Üniversitesi (Florya Halit Aydın Kampüsü): yürüyüş 7 sa 16 dk / 32.6 km, araç 32 dk / 33.9 km | İstanbul Gelişim Üniversitesi (Avcılar Yerleşkesi): yürüyüş 9 sa 10 dk / 41.2 km, araç 40 dk / 41.0 km",
    "detail_path": "/istanbul/bilge-ozel-kiz-ogrenci-yurdu/369",
    "indexed_at": "2026-05-09T15:09:40.589Z"
  },
  {
    "dorm_id": 372,
    "dorm_name": "Kadıköy Akademi Özel Erkek Öğrenci Yurdu",
    "gender": "Erkek",
    "dorm_type": "[\"Erkek yurdu\"]",
    "status": 1,
    "city_rank": 9999,
    "city_id": 34,
    "city_name": "İstanbul",
    "city_slug": "istanbul",
    "district_id": 444,
    "district_name": "Kadıköy",
    "district_slug": "kadikoy",
    "dorm_slug": "kadikoy-akademi-ozel-erkek-ogrenci-yurdu",
    "lat": "40.9912060",
    "lng": "29.0292428",
    "google_rating": "3.50",
    "google_review_count": 72,
    "google_cid": "8840897156730175588",
    "contact_json": {
      "phones": [
        "0216 330 37 76",
        "0507 947 89 13",
        null
      ],
      "whatsapp": "05079478913",
      "email": "kadikoyakademiyurdu@gmail.com",
      "website": "http://www.kadikoyakademi.com",
      "address": "Osmanağa Mahallesi Söğütlüçeşme Cad. &, Osmanağa, Mürver Çiçeği Sk. No:7, 34714 Kadıköy/İstanbul, Türkiye"
    },
    "featured_image": "a26d6b90-90e8-40f6-8d6a-a7d332299537.webp",
    "gallery_images_json": [
      "a26d6b90-90e8-40f6-8d6a-a7d332299537.webp",
      "9db8f1c0-2adf-4308-a6a9-de758f53524e.webp",
      "87c6e208-ec1f-4be8-84fc-7db0d07e3efc.webp",
      "c1a667ca-fecf-4d4d-81e6-232ac53ad11e.webp",
      "1c8f37c4-b0c5-47a7-a330-1a7c7550f5df.webp",
      "31fd8cbc-2302-4987-8e8c-5ed22a4bc6a0.webp",
      "6ae3d987-99b9-4086-86eb-bf087dfbfb27.webp",
      "e2d8a451-2181-4592-922a-bccafdee5767.webp",
      "35b7be51-2518-48ab-9e65-44fc511e7233.webp",
      "44e35910-10a3-4abe-9c08-8472ffdcb72b.webp"
    ],
    "description_snippet": "<h2>Açıklama</h2><br>\n<p>Kadıköy Akademi Özel Erkek Öğrenci Yurdu, İstanbul'un Kadıköy ilçesinde yer alan bir erkek yurdudur. Yurt, öğrencilere hem konforlu bir yaşam alanı sunmayı hem de akademik başarılarını desteklemeyi amaçlamaktadır.</p><br>\n\n<h3>Yurt Özellikleri</h3><br>\n<p>Yurt, öğrencilerin ihtiyaçlarına yönelik çeşitli olanaklarla donatılmıştır. 24 saat güvenlik hizmeti ile güvenli bir ortam sunulurken, revir sayesinde sağlık konularında destek sağlanmaktadır. Yemekhane, öğrencilere düzenli ve sağlıklı beslenme imkanı tanırken, ücretsiz Wi-Fi erişimi ile akademik çalışmalara destek sunulmaktadır. Ayrıca, etüt odaları, öğrencilerin ders çalışmasına ve grup projelerine yönelik bir alan sunarken, sıcak su ve televizyon gibi olanaklar, yurt yaşamını daha konforlu hale getirmektedir.</p><br>\n\n<h3>Oda Özellikleri</h3><br>\n<p>Yurtta kalan ö",
    "feature_names_text": "24 Saat Güvenlik | 7/24 Sıcak Su | Etüt Odaları | Kişisel Dolap | Kişiye Özel Çalışma Masası | Restoran - Yemekhane | Revir | Televizyon | Ücretsiz Wi-Fi",
    "review_pros_raw": "[\"Merkezi konum ve ulaşım kolaylığı\",\"Çarşıya ve merkeze yakın konum\",\"Samimi, aile ortamı hissi\"]",
    "review_cons_raw": "[\"Temizlik ve hijyen ciddi sıkıntı\",\"Yemek kalitesi ve porsiyon küçüklüğü\"]",
    "review_highlight": "Yorumlar iki kutuplu bir görünüm sergiliyor: birçok kısa olumlu yorum mekânın merkezi konumu, ulaşım rahatlığı, samimi atmosfer ve uygun fiyatı övüyor. Ancak daha detaylı ve tekrarlı olumsuz şikayetler temizlik ve hijyen eksiklikleri, yemeklerin düşük kalite ve küçük porsiyonları, çamaşırhane imkânlarının yetersizliği ile personel/yönetim iletişim problemlerine işaret ediyor. Güvenlik açısından özellikle oda arkadaşlığı değişimleri ve yoklama uygulamalarının zayıf olduğu yönünde tekrar eden endişeler bulunuyor; hijyen ve güvenlik bu geri bildirimlerde en kritik tekrarlayan riskler olarak öne çıkıyor. Olumsuz değerlendirmeler genellikle daha ayrıntılı olduğundan, incelemede negatif temalar ağırlık kazanıyor.",
    "near_universities_text": "Marmara Üniversitesi: yürüyüş 1 sa 30 dk / 7.5 km, araç 16 dk / 8.1 km | Boğaziçi Üniversitesi: yürüyüş 2 sa 36 dk / 13.0 km, araç 28 dk / 14.0 km | İstanbul Teknik Üniversitesi: yürüyüş 3 sa 11 dk / 15.9 km, araç 34 dk / 17.2 km | İstanbul Üniversitesi: yürüyüş 1 sa 31 dk / 7.5 km, araç 16 dk / 8.2 km | Yıldız Teknik Üniversitesi: yürüyüş 1 sa 44 dk / 8.7 km, araç 19 dk / 9.4 km | Koç Üniversitesi: yürüyüş 6 sa 3 dk / 30.2 km, araç 44 dk / 32.6 km | Sabancı Üniversitesi: yürüyüş 7 sa 50 dk / 39.2 km, araç 56 dk / 42.3 km | Özyeğin Üniversitesi: yürüyüş 4 sa 58 dk / 24.8 km, araç 36 dk / 26.8 km | Bahçeşehir Üniversitesi: yürüyüş 1 sa 28 dk / 7.4 km, araç 16 dk / 8.0 km | İstanbul Bilgi Üniversitesi: yürüyüş 2 sa 43 dk / 13.6 km, araç 29 dk / 14.7 km | Orta Doğu Teknik Üniversitesi: yürüyüş 85 sa 18 dk / 426.5 km, araç 6 sa 35 dk / 460.7 km | Hacettepe Üniversitesi: yürüyüş 84 sa 25 dk / 422.1 km, araç 6 sa 31 dk / 455.9 km | Ankara Üniversitesi: yürüyüş 84 sa 59 dk / 424.9 km, araç 6 sa 33 dk / 458.9 km | Bilkent Üniversitesi: yürüyüş 84 sa 44 dk / 423.7 km, araç 6 sa 32 dk / 457.6 km | Gazi Üniversitesi: yürüyüş 86 sa 50 dk / 434.1 km, araç 6 sa 42 dk / 468.9 km | TOBB Ekonomi ve Teknoloji Üniversitesi: yürüyüş 85 sa 6 dk / 425.5 km, araç 6 sa 34 dk / 459.5 km | Altınbaş Üniversitesi: yürüyüş 4 sa 45 dk / 23.7 km, araç 34 dk / 25.6 km | Ankara Hacı Bayram Veli Üniversitesi: yürüyüş 86 sa 50 dk / 434.1 km, araç 6 sa 42 dk / 468.9 km | Ankara Müzik ve Güzel Sanatlar Üniversitesi: yürüyüş 86 sa 41 dk / 433.4 km, araç 6 sa 41 dk / 468.1 km | Ankara Sosyal Bilimler Üniversitesi: yürüyüş 86 sa 0 dk / 430.0 km, araç 6 sa 38 dk / 464.4 km | Ankara Yıldırım Beyazıt Üniversitesi: yürüyüş 84 sa 59 dk / 424.9 km, araç 6 sa 33 dk / 458.9 km | Atılım Üniversitesi: yürüyüş 84 sa 42 dk / 423.5 km, araç 6 sa 32 dk / 457.4 km | Başkent Üniversitesi: yürüyüş 82 sa 36 dk / 413.0 km, araç 6 sa 22 dk / 446.1 km | Beykoz Üniversitesi: yürüyüş 4 sa 30 dk / 22.5 km, araç 32 dk / 24.3 km | Bezm-i Âlem Vakıf Üniversitesi: yürüyüş 2 sa 6 dk / 10.5 km, araç 23 dk / 11.4 km | Biruni Üniversitesi: yürüyüş 2 sa 28 dk / 12.4 km, araç 27 dk / 13.4 km | Demiroğlu Bilim Üniversitesi: yürüyüş 2 sa 7 dk / 10.6 km, araç 23 dk / 11.5 km | Doğuş Üniversitesi: yürüyüş 3 sa 6 dk / 15.5 km, araç 33 dk / 16.7 km | Fatih Sultan Mehmet Vakıf Üniversitesi: yürüyüş 1 sa 7 dk / 5.6 km, araç 12 dk / 6.0 km | Fenerbahçe Üniversitesi: yürüyüş 1 sa 55 dk / 9.6 km, araç 21 dk / 10.4 km | Galatasaray Üniversitesi: yürüyüş 1 sa 32 dk / 7.7 km, araç 17 dk / 8.3 km | Haliç Üniversitesi: yürüyüş 2 sa 49 dk / 14.1 km, araç 30 dk / 15.2 km | Işık Üniversitesi: yürüyüş 12 sa 15 dk / 61.3 km, araç 57 dk / 66.2 km | İbn Haldun Üniversitesi: yürüyüş 6 sa 19 dk / 31.6 km, araç 45 dk / 34.1 km | İhsan Doğramacı Bilkent Üniversitesi: yürüyüş 84 sa 43 dk / 423.6 km, araç 6 sa 32 dk / 457.5 km | İstanbul Aydın Üniversitesi: yürüyüş 4 sa 54 dk / 24.5 km, araç 35 dk / 26.4 km | İstanbul Beykent Üniversitesi: yürüyüş 3 sa 21 dk / 16.7 km, araç 36 dk / 18.1 km | İstanbul Gelişim Üniversitesi: yürüyüş 6 sa 32 dk / 32.7 km, araç 47 dk / 35.3 km | İstanbul Medeniyet Üniversitesi: yürüyüş 3 sa 44 dk / 18.7 km, araç 27 dk / 20.2 km | İstanbul Medipol Üniversitesi: yürüyüş 3 sa 5 dk / 15.4 km, araç 33 dk / 16.7 km | İstanbul Nişantaşı Üniversitesi: yürüyüş 3 sa 34 dk / 17.8 km, araç 39 dk / 19.3 km | İstanbul Sabahattin Zaim Üniversitesi: yürüyüş 5 sa 15 dk / 26.3 km, araç 38 dk / 28.4 km | İstanbul Sağlık ve Teknoloji Üniversitesi: yürüyüş 2 sa 26 dk / 12.2 km, araç 26 dk / 13.2 km | İstanbul Üniversitesi-Cerrahpaşa: yürüyüş 5 sa 12 dk / 26.0 km, araç 37 dk / 28.1 km | İstanbul Yeni Yüzyıl Üniversitesi: yürüyüş 2 sa 40 dk / 13.3 km, araç 29 dk / 14.4 km | İstinye Üniversitesi: yürüyüş 2 sa 41 dk / 13.4 km, araç 29 dk / 14.5 km | Kadir Has Üniversitesi: yürüyüş 13 sa 43 dk / 68.6 km, araç 1 sa 3 dk / 74.0 km | Lokman Hekim Üniversitesi: yürüyüş 84 sa 58 dk / 424.9 km, araç 6 sa 33 dk / 458.9 km | Maltepe Üniversitesi: yürüyüş 3 sa 25 dk / 17.1 km, araç 37 dk / 18.4 km | MEF Üniversitesi: yürüyüş 3 sa 17 dk / 16.4 km, araç 35 dk / 17.7 km | Mimar Sinan Güzel Sanatlar Üniversitesi: yürüyüş 1 sa 22 dk / 6.9 km, araç 15 dk / 7.4 km | OSTİM Teknik Üniversitesi: yürüyüş 83 sa 18 dk / 416.5 km, araç 6 sa 26 dk / 449.8 km | Piri Reis Üniversitesi: yürüyüş 7 sa 22 dk / 36.8 km, araç 53 dk / 39.7 km | Sağlık Bilimleri Üniversitesi: yürüyüş 24 dk / 2.0 km, araç 7 dk / 2.2 km | TED Üniversitesi: yürüyüş 86 sa 18 dk / 431.5 km, araç 6 sa 39 dk / 466.0 km | Türk Hava Kurumu Üniversitesi: yürüyüş 82 sa 41 dk / 413.4 km, araç 6 sa 23 dk / 446.5 km | Türk-Alman Üniversitesi: yürüyüş 4 sa 30 dk / 22.5 km, araç 32 dk / 24.3 km | Ufuk Üniversitesi: yürüyüş 84 sa 45 dk / 423.8 km, araç 6 sa 32 dk / 457.7 km | Üsküdar Üniversitesi: yürüyüş 53 dk / 4.4 km, araç 14 dk / 4.8 km | Yeditepe Üniversitesi: yürüyüş 2 sa 36 dk / 13.0 km, araç 28 dk / 14.1 km | Yüksek İhtisas Üniversitesi: yürüyüş 85 sa 27 dk / 427.3 km, araç 6 sa 36 dk / 461.5 km | İstanbul Beykent Üniversitesi (Ayazağa - Maslak) Yerleşkesi: yürüyüş 3 sa 21 dk / 16.7 km, araç 36 dk / 18.1 km | İstanbul Beykent Üniversitesi (Beylikdüzü): yürüyüş 8 sa 17 dk / 41.4 km, araç 1 sa 0 dk / 44.7 km | İstanbul Beykent Üniversitesi (Hadımköy) Yerleşkesi: yürüyüş 9 sa 48 dk / 49.0 km, araç 45 dk / 52.9 km | İstanbul Beykent Üniversitesi (Taksim) Yerleşkesi: yürüyüş 1 sa 36 dk / 8.0 km, araç 17 dk / 8.6 km | İstanbul Teknik Üniversitesi (Ayazağa) Yerleşkesi: yürüyüş 3 sa 11 dk / 15.9 km, araç 34 dk / 17.2 km | İstanbul Teknik Üniversitesi (Maçka) Yerleşkesi: yürüyüş 1 sa 45 dk / 8.7 km, araç 19 dk / 9.4 km | İstanbul Teknik Üniversitesi (Gümüşsuyu) Yerleşkesi: yürüyüş 1 sa 32 dk / 7.7 km, araç 17 dk / 8.3 km | İstanbul Teknik Üniversitesi (Taşkışla) Yerleşkesi: yürüyüş 1 sa 37 dk / 8.1 km, araç 18 dk / 8.8 km | İstanbul Teknik Üniversitesi (Tuzla) Yerleşkesi: yürüyüş 7 sa 29 dk / 37.4 km, araç 54 dk / 40.4 km | Marmara Üniversitesi (Göztepe Kampüsü): yürüyüş 32 dk / 2.6 km, araç 9 dk / 2.9 km | Marmara Üniversitesi (Recep Tayyip Erdoğan Kampüsü): yürüyüş 3 sa 24 dk / 17.0 km, araç 37 dk / 18.3 km | Marmara Üniversitesi (Başıbüyük Kampüsü): yürüyüş 2 sa 44 dk / 13.7 km, araç 29 dk / 14.7 km | Yıldız Teknik Üniversitesi (Davutpaşa Kampüsü): yürüyüş 3 sa 3 dk / 15.3 km, araç 33 dk / 16.5 km | Yıldız Teknik Üniversitesi (Beşiktaş - Yıldız Kampüsü): yürüyüş 1 sa 41 dk / 8.4 km, araç 18 dk / 9.1 km | Boğaziçi Üniversitesi (Güney Kampüsü): yürüyüş 2 sa 36 dk / 13.0 km, araç 28 dk / 14.0 km | Boğaziçi Üniversitesi (Kuzey Kampüsü): yürüyüş 2 sa 42 dk / 13.5 km, araç 29 dk / 14.6 km | Boğaziçi Üniversitesi (Kandilli Kampüsü): yürüyüş 2 sa 4 dk / 10.4 km, araç 22 dk / 11.2 km | Boğaziçi Üniversitesi (Kilyos - Sarıtepe Kampüsü): yürüyüş 7 sa 6 dk / 35.5 km, araç 51 dk / 38.3 km | Orta Doğu Teknik Üniversitesi (Üniversiteler Mah.): yürüyüş 85 sa 7 dk / 425.6 km, araç 6 sa 34 dk / 459.6 km | Hacettepe Üniversitesi (Beytepe Kampüsü): yürüyüş 84 sa 24 dk / 422.0 km, araç 6 sa 31 dk / 455.7 km | Hacettepe Üniversitesi (Sıhhiye Kampüsü): yürüyüş 86 sa 10 dk / 430.8 km, araç 6 sa 39 dk / 465.3 km | Ankara Üniversitesi (Tandoğan Kampüsü): yürüyüş 85 sa 41 dk / 428.4 km, araç 6 sa 37 dk / 462.7 km | Ankara Üniversitesi (Cebeci Kampüsü): yürüyüş 86 sa 30 dk / 432.5 km, araç 6 sa 40 dk / 467.1 km | Ankara Üniversitesi (Gölbaşı Kampüsü): yürüyüş 86 sa 43 dk / 433.6 km, araç 6 sa 41 dk / 468.3 km | İstanbul Medipol Üniversitesi (Kavacık Kampüsü): yürüyüş 3 sa 5 dk / 15.4 km, araç 33 dk / 16.7 km | İstanbul Medipol Üniversitesi (Haliç Kampüsü): yürüyüş 1 sa 49 dk / 9.1 km, araç 20 dk / 9.8 km | Marmara Üniversitesi (Maltepe Kampüsü): yürüyüş 3 sa 24 dk / 17.0 km, araç 37 dk / 18.3 km | Marmara Üniversitesi (Acıbadem Kampüsü): yürüyüş 26 dk / 2.2 km, araç 7 dk / 2.4 km | Marmara Üniversitesi (Bağlarbaşı Kampüsü): yürüyüş 51 dk / 4.2 km, araç 14 dk / 4.6 km | İstanbul Medipol Üniversitesi (Bağcılar Kampüsü): yürüyüş 4 sa 9 dk / 20.7 km, araç 30 dk / 22.4 km | İstanbul Bilgi Üniversitesi (Santralİstanbul Kampüsü): yürüyüş 2 sa 43 dk / 13.6 km, araç 29 dk / 14.7 km | İstanbul Bilgi Üniversitesi (Kuştepe Kampüsü): yürüyüş 2 sa 17 dk / 11.4 km, araç 25 dk / 12.3 km | İstanbul Bilgi Üniversitesi (Dolapdere Kampüsü): yürüyüş 1 sa 47 dk / 8.9 km, araç 19 dk / 9.6 km | Bahçeşehir Üniversitesi (Beşiktaş Kampüsü): yürüyüş 1 sa 28 dk / 7.4 km, araç 16 dk / 8.0 km | Bahçeşehir Üniversitesi (Göztepe Kampüsü): yürüyüş 39 dk / 3.2 km, araç 10 dk / 3.5 km | Bahçeşehir Üniversitesi (Galata Kampüsü): yürüyüş 1 sa 30 dk / 7.5 km, araç 16 dk / 8.1 km | İstanbul Aydın Üniversitesi (Florya Halit Aydın Kampüsü): yürüyüş 4 sa 54 dk / 24.5 km, araç 35 dk / 26.4 km | İstanbul Gelişim Üniversitesi (Avcılar Yerleşkesi): yürüyüş 6 sa 32 dk / 32.7 km, araç 47 dk / 35.3 km | Ankara Üniversitesi (Beşevler Yerleşkesi): yürüyüş 85 sa 41 dk / 428.4 km, araç 6 sa 37 dk / 462.7 km | Ankara Üniversitesi (Cebeci Yerleşkesi): yürüyüş 86 sa 30 dk / 432.5 km, araç 6 sa 40 dk / 467.1 km | Ankara Üniversitesi (Dışkapı Yerleşkesi): yürüyüş 85 sa 59 dk / 429.9 km, araç 6 sa 38 dk / 464.3 km | Ankara Üniversitesi (Gölbaşı Yerleşkesi): yürüyüş 86 sa 43 dk / 433.6 km, araç 6 sa 41 dk / 468.3 km | Gazi Üniversitesi (Merkez Yerleşkesi): yürüyüş 85 sa 23 dk / 426.9 km, araç 6 sa 35 dk / 461.1 km | Gazi Üniversitesi (Gölbaşı Yerleşkesi): yürüyüş 86 sa 46 dk / 433.8 km, araç 6 sa 42 dk / 468.5 km | Gazi Üniversitesi (Merkez Yerleşkesi): yürüyüş 85 sa 23 dk / 426.9 km, araç 6 sa 35 dk / 461.1 km | Gazi Üniversitesi (Gölbaşı Kampüsü): yürüyüş 86 sa 46 dk / 433.8 km, araç 6 sa 42 dk / 468.5 km | Orta Doğu Teknik Üniversitesi (Çankaya Yerleşkesi): yürüyüş 85 sa 7 dk / 425.6 km, araç 6 sa 34 dk / 459.6 km | Bilkent Üniversitesi (Merkez Kampüsü): yürüyüş 84 sa 45 dk / 423.7 km, araç 6 sa 32 dk / 457.6 km",
    "detail_path": "/istanbul/kadikoy-akademi-ozel-erkek-ogrenci-yurdu/372",
    "indexed_at": "2026-05-09T15:09:40.589Z"
  }
]
```

---

## Tablo: `ai_dorm_university_flat`

- **Toplam Kayıt:** 16215

### Sütun Yapısı
| Sütun Adı | Veri Tipi | Null | Anahtar (Key) | Varsayılan | Ekstra |
|---|---|---|---|---|---|
| `dorm_id` | bigint(20) unsigned | NO | PRI | NULL |  |
| `university_id` | int(10) unsigned | NO | PRI | NULL |  |
| `university_name` | varchar(512) | NO |  | NULL |  |
| `walking_minutes` | int(11) | YES |  | NULL |  |
| `walking_distance_km` | decimal(10,3) | YES |  | NULL |  |
| `driving_minutes` | int(11) | YES |  | NULL |  |
| `driving_distance_km` | decimal(10,3) | YES |  | NULL |  |
| `within_20km` | tinyint(1) | NO |  | 0 |  |

### İndeksler
- **PRIMARY**: (dorm_id, university_id)
- **idx_uni_city_lookup**: (university_id)
- **idx_dorm_walk**: (dorm_id, walking_minutes)
- **idx_within20**: (dorm_id, within_20km)

### Örnek Kayıtlar
```json
[
  {
    "dorm_id": 369,
    "university_id": 1,
    "university_name": "Marmara Üniversitesi",
    "walking_minutes": 226,
    "walking_distance_km": "16.910",
    "driving_minutes": 20,
    "driving_distance_km": "17.730",
    "within_20km": 1
  },
  {
    "dorm_id": 369,
    "university_id": 2,
    "university_name": "Boğaziçi Üniversitesi",
    "walking_minutes": 224,
    "walking_distance_km": "16.730",
    "driving_minutes": 23,
    "driving_distance_km": "19.920",
    "within_20km": 1
  }
]
```

---

## Tablo: `dorm`

- **Toplam Kayıt:** 1444

### Sütun Yapısı
| Sütun Adı | Veri Tipi | Null | Anahtar (Key) | Varsayılan | Ekstra |
|---|---|---|---|---|---|
| `id` | varchar(255) | NO | PRI | NULL |  |
| `name` | varchar(255) | NO |  | NULL |  |
| `slug_tr` | varchar(255) | YES |  | NULL |  |
| `name_en` | varchar(255) | YES |  | NULL |  |
| `name_ar` | varchar(255) | YES |  | NULL |  |
| `slug_en` | varchar(255) | YES |  | NULL |  |
| `slug_ar` | varchar(255) | YES |  | NULL |  |
| `description` | text | YES |  | NULL |  |
| `description_en` | text | YES |  | NULL |  |
| `description_ar` | text | YES |  | NULL |  |
| `status` | varchar(50) | YES |  | NULL |  |
| `cityId` | int(11) | NO | MUL | NULL |  |
| `districtId` | int(11) | NO | MUL | NULL |  |
| `address` | text | YES |  | NULL |  |
| `email` | varchar(255) | YES |  | NULL |  |
| `website` | varchar(255) | YES |  | NULL |  |
| `whatsapp` | varchar(50) | YES |  | NULL |  |
| `dormFeatures` | text | YES |  | NULL |  |
| `roomFeatures` | text | YES |  | NULL |  |
| `featuredImage` | varchar(255) | YES |  | NULL |  |
| `galleryImages` | text | YES |  | NULL |  |
| `gender` | varchar(50) | YES |  | NULL |  |
| `dormType` | varchar(255) | YES |  | NULL |  |
| `cityRank` | int(11) | YES |  | NULL |  |
| `districtRank` | int(11) | YES |  | NULL |  |
| `createdAt` | datetime | YES |  | NULL |  |
| `updatedAt` | datetime | YES |  | NULL |  |
| `phones2` | varchar(50) | YES |  | NULL |  |
| `phones3` | varchar(50) | YES |  | NULL |  |
| `phones` | varchar(50) | YES |  | NULL |  |
| `showhome` | tinyint(1) | YES |  | 0 |  |
| `is_sponsored` | tinyint(1) | YES |  | 0 |  |
| `is_featured` | tinyint(1) | YES |  | 0 |  |
| `sms_gitsin` | tinyint(1) | NO |  | 0 |  |
| `sube` | varchar(255) | YES | MUL | NULL |  |
| `lat` | decimal(10,8) | YES |  | NULL |  |
| `lng` | decimal(11,8) | YES |  | NULL |  |
| `google_cid` | varchar(255) | YES |  | NULL |  |
| `google_rating` | decimal(3,1) | YES |  | NULL |  |
| `google_review_count` | int(11) | YES |  | NULL |  |

### İndeksler
- **PRIMARY**: (id)
- **idx_dorm_city_type_rank**: (cityId, dormType, cityRank, id)
- **idx_dorm_district_type_rank**: (districtId, dormType, districtRank, id)
- **idx_dorm_city_district**: (cityId, districtId)
- **idx_dorm_sube_type**: (sube, dormType)
- **idx_dorm_sube_status**: (sube, status)

### Örnek Kayıtlar
```json
[
  {
    "id": "1015",
    "name": "Palmira Kız Öğrenci Rezidansı",
    "slug_tr": "palmira-kiz-ogrenci-rezidansi",
    "name_en": "Palmira Women's Dormitory",
    "name_ar": "سكن الطالبات بالميرا",
    "slug_en": "palmira-womens-dormitory",
    "slug_ar": "palmira-womens-dormitory",
    "description": "<h2>Öğrenci Yurdu Hakkında</h2>  \n<p>Palmira Kız Öğrenci Rezidansı, İzmir'in Buca ilçesinde yer alan bir kız apartıdır. Öğrencilere geniş kapsamlı olanaklar sunarak, konforlu bir yaşam alanı sağlamayı hedeflemektedir. Yurt, 24 saat güvenlik hizmeti ve yönetici desteği ile güvenli bir ortam sunmaktadır.</p>  \n<br>  \n<h2>Yurt Özellikleri</h2>  \n<p>Yurtta sunulan olanaklar arasında sabah kahvaltısı ve akşam yemeği gibi yemek hizmetleri bulunmaktadır. Ayrıca, konforlu odalarda balkon, klima ve sıcak su gibi temel ihtiyaçlar düşünülmüştür. Öğrencilerin ders çalışabilmesi için etüt odaları ve kişiye özel çalışma masaları da mevcuttur. Temizlik hizmetleriyle birlikte, çamaşır ve ütü odası da günlük yaşam konforunu artırır.</p>  \n<br>  \n<p>Yurt sakinleri için dinlencenin yanı sıra sosyal aktiviteler de düşünülmüştür. Bahçe, oyun konsolları ve fitness salonu gibi imkânlar, öğrencilerin sosyalleşmesine yardımcı olur. Ayrıca, ücretsiz Wi-Fi hizmeti ile öğrenciler derslerini ve araştırmalarını kolayca gerçekleştirebilirler.</p>  \n<br>  \n<h2>Yakın Öğretim Kurumları</h2>  \n<p>Palmira Kız Öğrenci Rezidansı, İzmir Yüksek Teknoloji Enstitüsü, Dokuz Eylül Üniversitesi ve diğer birçok üniversiteye yakın olmaktadır. Bu konum, eğitim hayatını sürdüren öğrenciler için büyük bir avantaj sağlarken, okul servisi gibi ek imkânlarla ulaşım kolaylığı sağlamaktadır.</p>  \n<br>  \n<p>Yurt, genel olarak öğrenci ihtiyaçlarını karşılamak için kapsamlı bir yapı sunarak, konforlu ve güvenli bir yaşam deneyimi arayan kız öğrenciler için ideal bir seçenektir.</p>  \n<br>  ",
    "description_en": "<h2>About the Dormitory</h2> <p>Palmira Women's Dormitory is a girls' apartment located in the Buca district of Izmir. It aims to provide a comfortable living space by offering a wide range of facilities to students. The dormitory provides a secure environment with 24-hour security services and management support.</p> <br> <h2>Dormitory Features</h2> <p>The facilities offered in the dormitory include meal services such as breakfast and dinner. Additionally, basic needs such as balconies, air conditioning, and hot water are considered in the comfortable rooms. Study rooms and personalized study desks are also available for students to study. Along with cleaning services, the laundry and ironing room enhances daily living comfort.</p> <br> <p>In addition to relaxation for dorm residents, social activities have also been considered. Facilities such as a garden, gaming consoles, and a fitness center help students socialize. Moreover, with free Wi-Fi service, students can easily conduct their lessons and research.</p> <br> <h2>Nearby Educational Institutions</h2> <p>Palmira Women's Dormitory is close to Izmir Institute of Technology, Dokuz Eylül University, and many other universities. This location provides a significant advantage for students continuing their education, while additional facilities like school transportation ensure ease of access.</p> <br> <p>Overall, the dormitory offers a comprehensive structure to meet student needs, making it an ideal choice for female students seeking a comfortable and secure living experience.</p> <br>",
    "description_ar": "html حول سكن الطالبات يعد سكن الطالبات بالميرا شقة مخصصة للفتيات تقع في منطقة بوقا بإزمير. يهدف إلى توفير بيئة مريحة للعيش من خلال تقديم مجموعة واسعة من المرافق للطلاب. يوفر السكن بيئة آمنة مع خدمات الأمن على مدار 24 ساعة ودعم إداري. ميزات السكن تشمل المرافق المتاحة في السكن خدمات الطعام مثل الإفطار والعشاء. بالإضافة إلى ذلك، تم التفكير في الاحتياجات الأساسية مثل الشرفات، وتكييف الهواء، والمياه الساخنة في الغرف المريحة. كما تتوفر غرف دراسة ومكاتب عمل خاصة للطلاب لمساعدتهم في الدراسة. مع خدمات التنظيف، تزيد غرفة الغسيل والكي من راحة الحياة اليومية. بالإضافة إلى الاسترخاء، تم التفكير في الأنشطة الاجتماعية لسكان السكن. تساعد المرافق مثل الحديقة، وأجهزة الألعاب، وصالة الألعاب الرياضية الطلاب على التواصل الاجتماعي. كما يمكن للطلاب إجراء دراستهم وبحوثهم بسهولة بفضل خدمة الواي فاي المجانية. المؤسسات التعليمية القريبة يقع سكن الطالبات بالميرا بالقرب من معهد إزمير للتكنولوجيا، وجامعة دوكوز إيلول، والعديد من الجامعات الأخرى. توفر هذه الموقع ميزة كبيرة للطلاب الذين يواصلون حياتهم التعليمية، مما يسهل الوصول من خلال خدمات النقل المدرسية وغيرها من المرافق الإضافية. بشكل عام، يقدم السكن هيكلًا شاملًا لتلبية احتياجات الطلاب، مما يجعله خيارًا مثاليًا للطالبات اللواتي يبحثن عن تجربة حياة مريحة وآمنة.",
    "status": "1",
    "cityId": 35,
    "districtId": 468,
    "address": "No:, Yıldız, 199/6. Sk. No:10, 35390 Buca/İzmir, Türkiye",
    "email": "info@palmirarezidans.com",
    "website": "www.palmirarezidans.com",
    "whatsapp": "05076519955",
    "dormFeatures": "[171,172,173,174,176,177,178,180,181,182,183,184,185,186,187,188,189,190,192,196,198,200]",
    "roomFeatures": "[204,208,213,214,216,217,218,219,220,221,222]",
    "featuredImage": "f13ff1a7-f6c2-4c81-958d-1f069031f98d.webp",
    "galleryImages": "[\"f13ff1a7-f6c2-4c81-958d-1f069031f98d.webp\",\"b2f77843-e215-483b-be29-61506af55119.webp\",\"3baf5379-adca-46b5-9b83-9ca003f851c9.webp\",\"d6f29899-c5f6-4899-b01a-17f4094067b3.webp\",\"9a7616e9-b0fb-4fc7-a27b-6d2feb0fed74.webp\",\"7b340b3f-5a13-4d87-b915-5223bee3a2ea.webp\",\"b45c2fec-1faa-4be8-b51b-3075bbf8c8ea.webp\",\"6bc4f867-faa1-4f73-af91-6ecbfb02c749.webp\",\"0822ab40-4e67-4461-a0d6-f37599e71c2b.webp\",\"ab51752e-3b33-4e9e-b487-bf0a7ed9d22a.webp\",\"7b5df955-ecfc-45dc-a47b-3cd97c788048.webp\",\"920009f4-a4e1-4b99-90ec-227c47b8e8a3.webp\",\"c4819035-448d-4dc8-a4c8-0cad5b2a65a0.webp\",\"4c3ac9f7-47ad-47be-b74f-445f479e3a3e.webp\",\"e1d6cb20-5668-482d-b9f5-4c557b2f3717.webp\",\"8cf5e5ae-583e-4beb-8027-eb025dac9628.webp\",\"8e15c287-7720-449c-b905-64abd8182884.webp\",\"82b470d7-0aef-497c-827c-51837e96f84f.webp\",\"20d13d0e-aa4e-47ca-88ac-7408933e6d83.webp\",\"07ec01c2-17ab-40ed-8611-32d947c97129.webp\",\"4c9ed90a-b60b-4115-9970-ffb2880f49b7.webp\",\"a6fdce76-a823-4722-99cc-bfd059931abf.webp\",\"ebcd69dc-f033-4f7f-b846-ec7993599945.webp\",\"8a360905-f745-4a5f-8413-e5d7570fda47.webp\",\"efaf86a8-438d-4397-8f06-28c9e76944d1.webp\",\"640a2982-422f-4345-bc39-40a025c7b2c8.webp\",\"9c865b29-0d2c-4062-8345-86c6744a9cc3.webp\",\"d0feb27f-364b-4d01-8afe-843252888678.webp\",\"132d6d83-5b84-4916-9a9f-2caa163f0642.webp\",\"141169e2-06a0-495f-918d-495548b3019c.webp\",\"c2913f0d-626e-4d82-a179-52c00f825161.webp\",\"e76f15d1-a07c-4df7-ba61-adde43294fe0.webp\",\"405b88b7-d0f0-4998-b208-d4019c72bd62.webp\",\"c086688a-a4db-4fd8-9bc3-bdfb35719290.webp\",\"c2edf581-bed3-4bcc-8df0-fbcdead03206.webp\",\"7a6d2a58-76b8-434a-bd1d-8359f575aa93.webp\",\"912ed74e-ab85-4475-835d-90c8bfc37e37.webp\",\"5b9397ec-8c00-45cf-a83c-e756834c98ab.webp\"]",
    "gender": "Kız",
    "dormType": "[\"Kız apartı, Kız Yurdu\"]",
    "cityRank": 4,
    "districtRank": 4,
    "createdAt": "2025-01-24T10:14:41.000Z",
    "updatedAt": "2025-01-24T10:14:41.000Z",
    "phones2": "0538 700 23 38",
    "phones3": null,
    "phones": "0507 651 99 55",
    "showhome": 0,
    "is_sponsored": 0,
    "is_featured": 0,
    "sms_gitsin": 1,
    "sube": null,
    "lat": "38.37480800",
    "lng": "27.18041950",
    "google_cid": "6132311798596861471",
    "google_rating": "8.6",
    "google_review_count": 185
  },
  {
    "id": "1016",
    "name": "Egeyurt Özel Öğrenci Yurtları",
    "slug_tr": "egeyurt-ozel-ogrenci-yurtlari",
    "name_en": "Egeyurt Private Dormitories",
    "name_ar": "سكن الطلاب الخاص إيجي يورت",
    "slug_en": "egeyurt-private-dormitories",
    "slug_ar": "egeyurt-private-dormitories",
    "description": "<h2>Öğrenci Yurdunun Genel Özellikleri</h2><br>\n<p>Egeyurt Özel Öğrenci Yurtları, İzmir'in Bornova ilçesinde yer alan modern bir konaklama seçeneğidir. Kız yurtları, erkek yurtları, kız apartları ve erkek apartları gibi çeşitli seçenekler sunarak öğrencilere esneklik sağlar. Yurt, öğrenci yaşamını kolaylaştıran birçok hizmet ve olanak ile donatılmıştır.</p><br>\n\n<h3>Konforlu ve Güvenli Ortam</h3><br>\n<p>Öğrencilerin konforunu önemseyen Egeyurt, her odada klima, televizyon, mini buzdolabı ve kişiye özel çalışma masası gibi özellikler sunmaktadır. 24 saat sıcak su, temizlik hizmetleri ve odalarda balkon bulunması, öğrencilere yaşam kalitesini artıran detaylardır. Yurt ayrıca 24 saat güvenlik ve yangın alarmı sistemleri ile güvenli bir ortam sağlamaktadır.</p><br>\n\n<h3>Beslenme ve Sosyal Olanaklar</h3><br>\n<p>Yurtta sabah kahvaltısı ve akşam yemeği hizmeti verilmektedir. Restoran ve yemekhane, öğrencilerin sağlıklı beslenmesine katkı sağlamaktadır. Ayrıca fitness salonu, bahçe ve teras gibi sosyal alanlar, dinlenme ve sosyalleşme imkanı sunar. Kütüphane, etüt odaları ve ücretsiz Wi-Fi gibi akademik destekleyici olanaklar, öğrencilerin ders çalışma süreçlerini kolaylaştırır.</p><br>\n\n<h3>Yakınındaki Üniversiteler</h3><br>\n<p>Egeyurt, Dokuz Eylül Üniversitesi, Ege Üniversitesi, İzmir Yüksek Teknoloji Enstitüsü gibi önemli eğitim kurumlarına yakın konumda bulunmasıyla dikkat çekmektedir. Bu, öğrencilerin okula ulaşımını kolaylaştırarak, vakit ve enerji tasarrufu sağlar.</p><br>\n\n<p>Yurt, öğrencilerin hem sosyal hem de akademik ihtiyaçlarına yönelik kapsamlı hizmetler sunarak, konaklama konusunda ideal bir seçenek oluşturur. Kazımdirik, Bornova/İzmir adresinde yer alan Egeyurt, hem güvenli hem de konforlu bir yaşam alanı arayan öğrenciler için tercih edilebilir bir yerdir.</p><br>",
    "description_en": "<h2>General Features of the Dormitory</h2><br>\n<p>Egeyurt Private Student Dormitories is a modern accommodation option located in the Bornova district of Izmir. It offers various options such as Women's Dormitories, Men's Dormitories, Women's Apartments, and Men's Apartments, providing flexibility for students. The dormitory is equipped with many services and amenities that facilitate student life.</p><br> <h3>Comfortable and Safe Environment</h3><br>\n<p>Egeyurt prioritizes students' comfort, offering features such as air conditioning, television, mini fridge, and personal study desk in every room. 24-hour hot water, cleaning services, and balconies in the rooms are details that enhance the quality of life for students. The dormitory also provides a safe environment with 24-hour security and fire alarm systems.</p><br> <h3>Nutrition and Social Facilities</h3><br>\n<p>The dormitory offers breakfast and dinner services. The restaurant and dining hall contribute to students' healthy eating. Additionally, social areas such as a gym, garden, and terrace provide opportunities for relaxation and socializing. Academic support facilities like a library, study rooms, and free Wi-Fi facilitate students' study processes.</p><br> <h3>Nearby Universities</h3><br>\n<p>Egeyurt is notable for its proximity to important educational institutions such as Dokuz Eylul University, Ege University, and Izmir Institute of Technology. This makes it easier for students to reach their schools, saving time and energy.</p><br> <p>The dormitory offers comprehensive services to meet both social and academic needs, making it an ideal accommodation option. Located at Kazımdirik, Bornova/Izmir, Egeyurt is a preferred place for students seeking a safe and comfortable living space.</p><br>",
    "description_ar": "html الخصائص العامة لسكن الطلاب تعتبر Egeyurt دور سكن الطلاب الخاصة خيارًا حديثًا للإقامة يقع في منطقة بورنوفا في إزمير. يوفر خيارات متنوعة مثل سكن الطالبات وسكن الطلاب وسكن الطالبات والشقق الطلابية، مما يمنح الطلاب مرونة. تم تجهيز السكن بالعديد من الخدمات والمرافق التي تسهل حياة الطلاب. بيئة مريحة وآمنة تولي Egeyurt أهمية لراحة الطلاب، حيث تقدم ميزات مثل تكييف الهواء، التلفاز، الثلاجة الصغيرة، ومكتب دراسة خاص في كل غرفة. توفر المياه الساخنة على مدار 24 ساعة، وخدمات التنظيف، والشرفات في الغرف، تفاصيل تعزز جودة حياة الطلاب. كما يوفر السكن بيئة آمنة مع نظام أمان على مدار 24 ساعة وأنظمة إنذار الحريق. التغذية والمرافق الاجتماعية يقدم السكن خدمات الإفطار والعشاء. تساهم المطاعم وقاعات الطعام في تغذية الطلاب بشكل صحي. بالإضافة إلى ذلك، توفر المناطق الاجتماعية مثل صالة الألعاب الرياضية، والحديقة، والتراس، فرصًا للاسترخاء والتواصل الاجتماعي. تسهل المكتبة، وغرف الدراسة، وخدمة الواي فاي المجانية، دعمًا أكاديميًا يساعد الطلاب في عملية الدراسة. الجامعات القريبة تتميز Egeyurt بموقعها القريب من مؤسسات التعليم المهمة مثل جامعة دوكوز إيلول، وجامعة إيجه، ومعهد إزمير للتكنولوجيا العالية. يسهل ذلك على الطلاب الوصول إلى المدرسة، مما يوفر الوقت والطاقة. يوفر السكن خدمات شاملة تلبي احتياجات الطلاب الاجتماعية والأكاديمية، مما يجعله خيارًا مثاليًا للإقامة. يقع Egeyurt في عنوان Kazımdirik، بورنوفا/إزمير، وهو مكان مفضل للطلاب الذين يبحثون عن بيئة آمنة ومريحة للعيش.",
    "status": "1",
    "cityId": 35,
    "districtId": 467,
    "address": "Kazımdirik, 372. Sk. No:12/2, 35100 Bornova/İzmir, Türkiye",
    "email": "info@egeyurt.com.tr",
    "website": "www.egeyurt.com.tr",
    "whatsapp": "0232 342 44 00",
    "dormFeatures": "[168,169,171,172,173,174,176,177,178,180,182,183,184,185,186,187,188,189,190,192,196,198,200]",
    "roomFeatures": "[204,208,213,214,216,217,218,219,220,221,222]",
    "featuredImage": "1742769789004-dorm-1016.webp",
    "galleryImages": "[]",
    "gender": "Kız",
    "dormType": "[\"Kız yurdu,Erkek yurdu,Kız apartı, Erkek apartı\"]",
    "cityRank": 100,
    "districtRank": 100,
    "createdAt": "2025-01-24T10:14:41.000Z",
    "updatedAt": "2025-01-24T10:14:41.000Z",
    "phones2": null,
    "phones3": null,
    "phones": "0232 342 44 00",
    "showhome": 0,
    "is_sponsored": 0,
    "is_featured": 0,
    "sms_gitsin": 0,
    "sube": null,
    "lat": "38.45284040",
    "lng": "27.21486070",
    "google_cid": "4919061061994709778",
    "google_rating": "6.6",
    "google_review_count": 731
  }
]
```

---

## Tablo: `cities`

- **Toplam Kayıt:** 81

### Sütun Yapısı
| Sütun Adı | Veri Tipi | Null | Anahtar (Key) | Varsayılan | Ekstra |
|---|---|---|---|---|---|
| `id` | int(11) | NO | PRI | NULL | auto_increment |
| `name` | varchar(191) | NO | MUL | NULL |  |
| `name_en` | varchar(100) | YES | MUL | NULL |  |
| `name_ar` | varchar(100) | YES | MUL | NULL |  |
| `slug_en` | varchar(255) | YES | MUL | NULL |  |
| `slug_ar` | varchar(255) | YES | MUL | NULL |  |
| `slug` | varchar(255) | YES | UNI | NULL |  |
| `slug_yurtlari_tr` | varchar(255) | YES | MUL | NULL |  |
| `slug_yurtlari_en` | varchar(255) | YES | MUL | NULL |  |
| `slug_yurtlari_ar` | varchar(255) | YES | MUL | NULL |  |
| `slug_erkek_tr` | varchar(255) | YES | MUL | NULL |  |
| `slug_erkek_en` | varchar(255) | YES | MUL | NULL |  |
| `slug_erkek_ar` | varchar(255) | YES | MUL | NULL |  |
| `slug_kiz_tr` | varchar(255) | YES | MUL | NULL |  |
| `slug_kiz_en` | varchar(255) | YES | MUL | NULL |  |
| `slug_kiz_ar` | varchar(255) | YES | MUL | NULL |  |
| `slug_erkek_apart_tr` | varchar(100) | YES |  | NULL |  |
| `slug_erkek_apart_en` | varchar(100) | YES |  | NULL |  |
| `slug_erkek_apart_ar` | varchar(100) | YES |  | NULL |  |
| `slug_kiz_apart_tr` | varchar(100) | YES |  | NULL |  |
| `slug_kiz_apart_en` | varchar(100) | YES |  | NULL |  |
| `slug_kiz_apart_ar` | varchar(100) | YES |  | NULL |  |

### İndeksler
- **PRIMARY**: (id)
- **cities_slug_key**: (slug)
- **idx_cities_name_ar**: (name_ar)
- **idx_cities_slug_ar**: (slug_ar)
- **idx_cities_slug_yurtlari_ar**: (slug_yurtlari_ar)
- **idx_cities_slug_erkek_ar**: (slug_erkek_ar)
- **idx_cities_slug_kiz_ar**: (slug_kiz_ar)
- **idx_cities_slug_yurtlari_tr**: (slug_yurtlari_tr)
- **idx_cities_slug_yurtlari_en**: (slug_yurtlari_en)
- **idx_cities_slug_erkek_tr**: (slug_erkek_tr)
- **idx_cities_slug_erkek_en**: (slug_erkek_en)
- **idx_cities_slug_kiz_tr**: (slug_kiz_tr)
- **idx_cities_slug_kiz_en**: (slug_kiz_en)
- **idx_cities_display_name**: (name)
- **idx_cities_name_en**: (name_en)
- **idx_cities_slug_en**: (slug_en)
- **idx_cities_slug_composite**: (slug, slug_en, slug_ar)

### Örnek Kayıtlar
```json
[
  {
    "id": 1,
    "name": "Adana",
    "name_en": "Adana",
    "name_ar": "أضنة",
    "slug_en": "adana",
    "slug_ar": "adana",
    "slug": "adana",
    "slug_yurtlari_tr": "adana",
    "slug_yurtlari_en": "adana",
    "slug_yurtlari_ar": "adana",
    "slug_erkek_tr": "erkek-yurtlari",
    "slug_erkek_en": "male-dormitories",
    "slug_erkek_ar": "male-dormitories",
    "slug_kiz_tr": "kiz-yurtlari",
    "slug_kiz_en": "female-dormitories",
    "slug_kiz_ar": "female-dormitories",
    "slug_erkek_apart_tr": "erkek-apartlari",
    "slug_erkek_apart_en": "male-apartments",
    "slug_erkek_apart_ar": "male-apartments",
    "slug_kiz_apart_tr": "kiz-apartlari",
    "slug_kiz_apart_en": "female-apartments",
    "slug_kiz_apart_ar": "female-apartments"
  },
  {
    "id": 2,
    "name": "Adıyaman",
    "name_en": "Adiyaman",
    "name_ar": "أديامان",
    "slug_en": "adiyaman",
    "slug_ar": "adiyaman",
    "slug": "adiyaman",
    "slug_yurtlari_tr": "adiyaman",
    "slug_yurtlari_en": "adiyaman",
    "slug_yurtlari_ar": "adiyaman",
    "slug_erkek_tr": "erkek-yurtlari",
    "slug_erkek_en": "male-dormitories",
    "slug_erkek_ar": "male-dormitories",
    "slug_kiz_tr": "kiz-yurtlari",
    "slug_kiz_en": "female-dormitories",
    "slug_kiz_ar": "female-dormitories",
    "slug_erkek_apart_tr": "erkek-apartlari",
    "slug_erkek_apart_en": "male-apartments",
    "slug_erkek_apart_ar": "male-apartments",
    "slug_kiz_apart_tr": "kiz-apartlari",
    "slug_kiz_apart_en": "female-apartments",
    "slug_kiz_apart_ar": "female-apartments"
  }
]
```

---

## Tablo: `districts`

- **Toplam Kayıt:** 973

### Sütun Yapısı
| Sütun Adı | Veri Tipi | Null | Anahtar (Key) | Varsayılan | Ekstra |
|---|---|---|---|---|---|
| `id` | int(11) | NO | PRI | NULL | auto_increment |
| `cityId` | int(11) | NO | MUL | NULL |  |
| `name` | varchar(191) | NO |  | NULL |  |
| `name_en` | varchar(100) | YES |  | NULL |  |
| `name_ar` | varchar(100) | YES | MUL | NULL |  |
| `slug_en` | varchar(255) | YES | MUL | NULL |  |
| `slug_ar` | varchar(255) | YES | MUL | NULL |  |
| `slug` | varchar(255) | YES |  | NULL |  |
| `slug_yurtlari_tr` | varchar(100) | YES | MUL | NULL |  |
| `slug_yurtlari_en` | varchar(100) | YES | MUL | NULL |  |
| `slug_yurtlari_ar` | varchar(100) | YES | MUL | NULL |  |
| `slug_erkek_tr` | varchar(100) | YES | MUL | NULL |  |
| `slug_erkek_en` | varchar(100) | YES | MUL | NULL |  |
| `slug_erkek_ar` | varchar(100) | YES | MUL | NULL |  |
| `slug_kiz_tr` | varchar(100) | YES | MUL | NULL |  |
| `slug_kiz_en` | varchar(100) | YES | MUL | NULL |  |
| `slug_kiz_ar` | varchar(100) | YES | MUL | NULL |  |

### İndeksler
- **PRIMARY**: (id)
- **districts_cityId_slug_key**: (cityId, slug)
- **idx_slug_yurtlari_tr**: (slug_yurtlari_tr)
- **idx_slug_yurtlari_en**: (slug_yurtlari_en)
- **idx_slug_erkek_tr**: (slug_erkek_tr)
- **idx_slug_erkek_en**: (slug_erkek_en)
- **idx_slug_kiz_tr**: (slug_kiz_tr)
- **idx_slug_kiz_en**: (slug_kiz_en)
- **idx_districts_name_ar**: (name_ar)
- **idx_districts_slug_ar**: (slug_ar)
- **idx_districts_slug_yurtlari_ar**: (slug_yurtlari_ar)
- **idx_districts_slug_erkek_ar**: (slug_erkek_ar)
- **idx_districts_slug_kiz_ar**: (slug_kiz_ar)
- **idx_districts_slug_en**: (slug_en)
- **idx_districts_cityid_name**: (cityId, name)
- **idx_districts_cityid_name_en**: (cityId, name_en)
- **idx_districts_cityid_name_ar**: (cityId, name_ar)

### Örnek Kayıtlar
```json
[
  {
    "id": 1,
    "cityId": 1,
    "name": "Aladağ",
    "name_en": "Aladag",
    "name_ar": "ألا داغ",
    "slug_en": "aladag",
    "slug_ar": "aladag",
    "slug": "aladag",
    "slug_yurtlari_tr": "aladag-yurtlari",
    "slug_yurtlari_en": "dormitories-in-aladag",
    "slug_yurtlari_ar": "dormitories-in-aladag",
    "slug_erkek_tr": "aladag-erkek-yurtlari",
    "slug_erkek_en": "male-dormitories-in-aladag",
    "slug_erkek_ar": "male-dormitories-in-aladag",
    "slug_kiz_tr": "aladag-kiz-yurtlari",
    "slug_kiz_en": "female-dormitories-in-aladag",
    "slug_kiz_ar": "female-dormitories-in-aladag"
  },
  {
    "id": 2,
    "cityId": 1,
    "name": "Ceyhan",
    "name_en": "Ceyhan",
    "name_ar": "جيهان",
    "slug_en": "ceyhan",
    "slug_ar": "ceyhan",
    "slug": "ceyhan",
    "slug_yurtlari_tr": "ceyhan-yurtlari",
    "slug_yurtlari_en": "dormitories-in-ceyhan",
    "slug_yurtlari_ar": "dormitories-in-ceyhan",
    "slug_erkek_tr": "ceyhan-erkek-yurtlari",
    "slug_erkek_en": "male-dormitories-in-ceyhan",
    "slug_erkek_ar": "male-dormitories-in-ceyhan",
    "slug_kiz_tr": "ceyhan-kiz-yurtlari",
    "slug_kiz_en": "female-dormitories-in-ceyhan",
    "slug_kiz_ar": "female-dormitories-in-ceyhan"
  }
]
```

---

## Tablo: `dorm_price_predictions`

- **Toplam Kayıt:** 1471

### Sütun Yapısı
| Sütun Adı | Veri Tipi | Null | Anahtar (Key) | Varsayılan | Ekstra |
|---|---|---|---|---|---|
| `dorm_id` | bigint(20) unsigned | NO | PRI | NULL |  |
| `city_name` | varchar(255) | YES |  | NULL |  |
| `district_name` | varchar(255) | YES |  | NULL |  |
| `predicted_min_price` | int(10) unsigned | YES |  | NULL |  |
| `predicted_max_price` | int(10) unsigned | YES |  | NULL |  |
| `confidence_score` | int(10) unsigned | YES |  | NULL |  |
| `confidence_level` | varchar(20) | YES |  | NULL |  |
| `calculation_step` | varchar(255) | YES |  | NULL |  |
| `sample_size` | int(10) unsigned | YES |  | NULL |  |
| `prediction_error_rate` | decimal(5,2) | YES |  | NULL |  |
| `calculated_at` | timestamp | NO |  | current_timestamp() | on update current_timestamp() |

### İndeksler
- **PRIMARY**: (dorm_id)

### Örnek Kayıtlar
```json
[
  {
    "dorm_id": 369,
    "city_name": "İstanbul",
    "district_name": "Eyüpsultan",
    "predicted_min_price": 19400,
    "predicted_max_price": 38800,
    "confidence_score": 60,
    "confidence_level": "MEDIUM",
    "calculation_step": "ADIM 3: Şehir Genel",
    "sample_size": 4,
    "prediction_error_rate": null,
    "calculated_at": "2026-07-19T21:19:03.000Z"
  },
  {
    "dorm_id": 372,
    "city_name": "İstanbul",
    "district_name": "Kadıköy",
    "predicted_min_price": 15300,
    "predicted_max_price": null,
    "confidence_score": 60,
    "confidence_level": "MEDIUM",
    "calculation_step": "ADIM 3: Şehir Genel",
    "sample_size": 2,
    "prediction_error_rate": null,
    "calculated_at": "2026-07-19T21:19:03.000Z"
  }
]
```

---

## Tablo: `dorm_reviews`

- **Toplam Kayıt:** 44252

### Sütun Yapısı
| Sütun Adı | Veri Tipi | Null | Anahtar (Key) | Varsayılan | Ekstra |
|---|---|---|---|---|---|
| `id` | int(11) | NO | PRI | NULL | auto_increment |
| `dorm_id` | int(11) | NO | MUL | NULL |  |
| `google_review_id` | varchar(255) | NO | UNI | NULL |  |
| `reviewer_name` | varchar(255) | YES |  | NULL |  |
| `reviewer_photo` | text | YES |  | NULL |  |
| `reviewer_id` | varchar(255) | YES |  | NULL |  |
| `rating` | tinyint(4) | YES |  | NULL |  |
| `review_text` | text | YES | MUL | NULL |  |
| `published_at` | datetime | YES |  | NULL |  |
| `published_at_raw` | varchar(100) | YES |  | NULL |  |
| `owner_response_text` | text | YES |  | NULL |  |
| `owner_response_at` | datetime | YES |  | NULL |  |
| `is_local_guide` | tinyint(1) | YES |  | 0 |  |
| `likes_count` | int(11) | YES |  | 0 |  |
| `created_at` | timestamp | YES |  | current_timestamp() |  |
| `updated_at` | timestamp | YES |  | current_timestamp() | on update current_timestamp() |

### İndeksler
- **PRIMARY**: (id)
- **idx_google_review_id**: (google_review_id)
- **idx_dorm_id**: (dorm_id)
- **idx_review_text**: (review_text)

### Örnek Kayıtlar
```json
[
  {
    "id": 1,
    "dorm_id": 2067,
    "google_review_id": "Ci9DQUlRQUNvZENodHljRjlvT2xwV2RUZElkMnhSUlZkcE1VbHRVbDlPUlV4eWRFRRAB",
    "reviewer_name": "Levent İnam",
    "reviewer_photo": "https://lh3.googleusercontent.com/a-/ALV-UjVvpwxszmbGzEE_IyiHbUY5eYugppLh_QrKnglrMeriqKgmJf9k=s1920-c-rp-mo-ba4-br100",
    "reviewer_id": "103463280522097324299",
    "rating": 4,
    "review_text": null,
    "published_at": "2025-06-23T19:47:15.000Z",
    "published_at_raw": "10 ay önce",
    "owner_response_text": null,
    "owner_response_at": null,
    "is_local_guide": 1,
    "likes_count": 0,
    "created_at": "2026-05-05T19:22:57.000Z",
    "updated_at": "2026-05-05T19:22:57.000Z"
  },
  {
    "id": 2,
    "dorm_id": 2067,
    "google_review_id": "ChdDSUhNMG9nS0VJQ0FnSURub3JyNy13RRAB",
    "reviewer_name": "Serra",
    "reviewer_photo": "https://lh3.googleusercontent.com/a/ACg8ocJbuT64zOt1b9Qy1j14Mf_ETt08xcYV4_zmU0R4gnj0V5AeQw=s1920-c-rp-mo-br100",
    "reviewer_id": "104492826307396145653",
    "rating": 1,
    "review_text": "hiçkimseye tavsiye etmiyorum girerken konuşulduğunda çıktığınız zaman depozito verilicek deniyor ama vermiyor 3gün kaldım çıkmak istedim ve kontrat imzalanmamıştı ona rağmen hem depozitoyu hemde ilk ayı aldı depozitoyu geri istediğimizde de sinirli bir şekilde evden çıkın anahtarı bırakın dedi yüz yüze görüşmeye gelmedi bile sadece mutfağınız var ve odanız o kadar diğer yerler anlatıldığı gibi değil asla apartta göremezsiniz kendisini diğer yorumlarda da olduğu gibi gerçektende ona itaat etmenizi bekliyor depozito paramı vermedi bu yaptığı sadece dolandırıcılık telefonları açmıyor..\nkesinlikle tavsiye etmiyorum",
    "published_at": "2024-10-04T16:36:28.000Z",
    "published_at_raw": "bir yıl önce",
    "owner_response_text": "öğrenciler için : aparta girişte, ‘’asgari altı ay kalmak şartı ile konaklayacağınızı ve mücbir sebep olamadan çıkış yapamayacağınızı’’ size bildirmiştik, sözleşme imzalamadan 3 gün kalmanız bu şartları değiştirmez, biz odayı size bir ay önce rezerve ettik, ve siz keyfiyetten çıkış yaptınız, maden çıkacaktınız neden bir ay önceden rezerve yaptırdınız , bir ticarethane olduğumuz için bizimde cezai şartlarımız bulunmaktadır; size rezervasyondan sonra arayan kişilere,’’ yer yok’’ demek durumunda kaldık, sizin yüzünüzden mağdur olan biz olduk…..",
    "owner_response_at": "2024-10-05T14:08:29.000Z",
    "is_local_guide": 0,
    "likes_count": 0,
    "created_at": "2026-05-05T19:22:57.000Z",
    "updated_at": "2026-05-05T19:22:57.000Z"
  }
]
```

---

## Tablo: `dorm_reviews_summary`

- **Toplam Kayıt:** 1371

### Sütun Yapısı
| Sütun Adı | Veri Tipi | Null | Anahtar (Key) | Varsayılan | Ekstra |
|---|---|---|---|---|---|
| `dorm_id` | varchar(255) | NO | PRI | NULL |  |
| `pros` | longtext | NO |  | NULL |  |
| `cons` | longtext | NO |  | NULL |  |
| `highlight` | mediumtext | NO |  | NULL |  |
| `review_count_at_summary` | int(11) | YES |  | 0 |  |
| `updated_at` | timestamp | YES |  | current_timestamp() | on update current_timestamp() |
| `confidence_score` | float | YES |  | 0 |  |
| `review_count` | int(11) | YES |  | 0 |  |

### İndeksler
- **PRIMARY**: (dorm_id)

### Örnek Kayıtlar
```json
[
  {
    "dorm_id": "1015",
    "pros": [
      "Aile ortamı ve sıcak personel",
      "Temizlik ve hijyen sıklıkla övülüyor",
      "Yemekler lezzetli, anne eli tadı"
    ],
    "cons": [
      "Çamaşırhane ve bazı temizlik şikâyetleri",
      "Ara sıra doğalgaz/sıcak su/ısıtma problemleri"
    ],
    "highlight": "Yorumların çoğu yurdu aile sıcaklığında, ilgili personeli, iyi yemekleri, temizlik ve güvenliği öne çıkararak olumlu değerlendiriyor. 2024–2026 tarihli ve ayrıntılı yorumlar özellikle yönetim/personel ilgisini, servis imkanını ve odaların ferahlığını vurguluyor; son dönemdeki değerlendirmeler ağırlıklı olarak pozitif. Bununla birlikte geçmiş yıllarda ve bazı daha yeni paylaşımlarda çamaşırhane hijyeni, genel temizlik uygulamaları ve zaman zaman yemek kalitesi hakkında olumsuz geri bildirimler görülüyor. Kritik olarak, ısıtma/sıcak su ve doğalgazla ilgili kesinti veya oda bazlı ısıtma sorunları birkaç bağımsız yorumda tekrarlandığı için dikkat çeken bir risk olarak gözlemleniyor. Genel görünüm yüksek puanlara ve olumlu algıya işaret etse de temizlik/çamaşırhane ve ısınma/sıcak su konularında karışık görüşler mevcut.",
    "review_count_at_summary": 0,
    "updated_at": "2026-05-06T09:09:38.000Z",
    "confidence_score": 1,
    "review_count": 57
  },
  {
    "dorm_id": "1016",
    "pros": [
      "Kampüse yakın, avantajlı konum",
      "Bazı çalışanlar güler yüzlü, yardımsever",
      "Bazı odalar temiz ve düzenli"
    ],
    "cons": [
      "Fiyatlar yüksek, ücret-kalite uyuşmuyor",
      "Depozito iadelerinde gecikme ve kesinti"
    ],
    "highlight": "Yorumlar belirgin şekilde kutuplaşmış; özellikle 2024 sonu ile 2026 arasındaki ayrıntılı ve güncel değerlendirmelerde olumsuz geri bildirimler öne çıkıyor. Tekrarlayan kritik riskler arasında depozito iadeleriyle ilgili gecikme/kesinti iddiaları, asansör/klima/sıcak su arızaları ve hijyen‑ile ilgili şikayetler (böcek, temizlik yetersizliği) bulunuyor. Diğer sık rastlanan temalar; yüksek ücret talebi karşısında sunulan servis ve kahvaltı kalitesinin düşük olması, zayıf internet bağlantısı ve yetersiz ses izolasyonu. Buna karşın konum, bazı çalışanların tutumu ve belli dönemlerde raporlanan temiz, düzenli odalar ile spor/konaklama imkanları hakkında olumlu değerlendirmeler de mevcut; ancak son dönem detaylı şikayetlerin sayısı daha fazla.",
    "review_count_at_summary": 0,
    "updated_at": "2026-05-06T09:10:10.000Z",
    "confidence_score": 1,
    "review_count": 66
  }
]
```

---

## Tablo: `dorm_university_distances`

- **Toplam Kayıt:** 18052

### Sütun Yapısı
| Sütun Adı | Veri Tipi | Null | Anahtar (Key) | Varsayılan | Ekstra |
|---|---|---|---|---|---|
| `id` | int(11) | NO | PRI | NULL | auto_increment |
| `dorm_id` | int(11) | NO | MUL | NULL |  |
| `university_id` | int(11) | NO |  | NULL |  |
| `walking_duration` | int(11) | YES |  | NULL |  |
| `walking_distance` | decimal(10,2) | YES |  | NULL |  |
| `driving_duration` | int(11) | YES |  | NULL |  |
| `driving_distance` | decimal(10,2) | YES |  | NULL |  |
| `public_transport_duration` | int(11) | YES |  | NULL |  |
| `last_updated` | timestamp | YES |  | current_timestamp() | on update current_timestamp() |

### İndeksler
- **PRIMARY**: (id)
- **unique_dorm_uni**: (dorm_id, university_id)
- **idx_dud_dorm_walking**: (dorm_id, walking_duration)

### Örnek Kayıtlar
```json
[
  {
    "id": 1,
    "dorm_id": 1085,
    "university_id": 14,
    "walking_duration": 146,
    "walking_distance": "12.17",
    "driving_duration": 26,
    "driving_distance": "13.15",
    "public_transport_duration": null,
    "last_updated": "2026-05-12T22:34:55.000Z"
  },
  {
    "id": 2,
    "dorm_id": 1192,
    "university_id": 14,
    "walking_duration": 144,
    "walking_distance": "12.01",
    "driving_duration": 26,
    "driving_distance": "12.97",
    "public_transport_duration": null,
    "last_updated": "2026-05-12T22:35:00.000Z"
  }
]
```

---

## Tablo: `transit_stations`

- **Toplam Kayıt:** 848

### Sütun Yapısı
| Sütun Adı | Veri Tipi | Null | Anahtar (Key) | Varsayılan | Ekstra |
|---|---|---|---|---|---|
| `id` | varchar(100) | NO | PRI | NULL |  |
| `name` | varchar(255) | NO |  | NULL |  |
| `type` | enum('metro','metrobus','tramvay','banliyo','funikuler') | NO | MUL | NULL |  |
| `line_code` | varchar(50) | NO | MUL | NULL |  |
| `line_name` | varchar(255) | NO |  | NULL |  |
| `lat` | decimal(10,7) | NO | MUL | NULL |  |
| `lng` | decimal(10,7) | NO |  | NULL |  |
| `city` | varchar(100) | NO | MUL | NULL |  |
| `source` | varchar(150) | YES |  | NULL |  |
| `is_active` | tinyint(1) | NO |  | 1 |  |
| `created_at` | datetime | NO |  | current_timestamp() |  |
| `updated_at` | datetime | NO |  | current_timestamp() | on update current_timestamp() |

### İndeksler
- **PRIMARY**: (id)
- **idx_transit_city**: (city)
- **idx_transit_type**: (type)
- **idx_transit_line_code**: (line_code)
- **idx_transit_coords**: (lat, lng)

### Örnek Kayıtlar
```json
[
  {
    "id": "ada-m1-akincilar",
    "name": "Akıncılar",
    "type": "metro",
    "line_code": "M1",
    "line_name": "Hastane - Akıncılar (Adana Metrosu)",
    "lat": "36.9789000",
    "lng": "35.3514000",
    "city": "Adana",
    "source": "adana.bel.tr",
    "is_active": 1,
    "created_at": "2026-08-16T08:04:10.000Z",
    "updated_at": "2026-08-16T08:04:10.000Z"
  },
  {
    "id": "ada-m1-anadolu-lisesi",
    "name": "Anadolu Lisesi",
    "type": "metro",
    "line_code": "M1",
    "line_name": "Hastane - Akıncılar (Adana Metrosu)",
    "lat": "37.0378000",
    "lng": "35.2672000",
    "city": "Adana",
    "source": "adana.bel.tr",
    "is_active": 1,
    "created_at": "2026-08-16T08:04:10.000Z",
    "updated_at": "2026-08-16T08:04:10.000Z"
  }
]
```

---

## Tablo: `universities`

- **Toplam Kayıt:** 249

### Sütun Yapısı
| Sütun Adı | Veri Tipi | Null | Anahtar (Key) | Varsayılan | Ekstra |
|---|---|---|---|---|---|
| `id` | int(11) | NO | PRI | NULL | auto_increment |
| `name` | varchar(191) | NO |  | NULL |  |
| `name_en` | varchar(255) | YES |  | NULL |  |
| `name_ar` | varchar(255) | YES | MUL | NULL |  |
| `slug` | varchar(255) | YES | UNI | NULL |  |
| `slug_yurtlari_tr` | varchar(191) | YES | MUL | NULL |  |
| `slug_yurtlari_en` | varchar(191) | YES | MUL | NULL |  |
| `slug_yurtlari_ar` | varchar(191) | YES | MUL | NULL |  |
| `slug_erkek_tr` | varchar(191) | YES | MUL | NULL |  |
| `slug_erkek_en` | varchar(191) | YES | MUL | NULL |  |
| `slug_erkek_ar` | varchar(191) | YES | MUL | NULL |  |
| `slug_kiz_tr` | varchar(191) | YES | MUL | NULL |  |
| `slug_kiz_en` | varchar(191) | YES | MUL | NULL |  |
| `slug_kiz_ar` | varchar(191) | YES | MUL | NULL |  |
| `slug_en` | varchar(255) | YES |  | NULL |  |
| `slug_ar` | varchar(255) | YES | MUL | NULL |  |
| `cityId` | int(11) | NO | MUL | NULL |  |
| `lat` | decimal(10,8) | YES |  | NULL |  |
| `lng` | decimal(11,8) | YES |  | NULL |  |

### İndeksler
- **PRIMARY**: (id)
- **universities_slug_key**: (slug)
- **idx_slug_yurtlari_tr**: (slug_yurtlari_tr)
- **idx_slug_yurtlari_en**: (slug_yurtlari_en)
- **idx_slug_erkek_tr**: (slug_erkek_tr)
- **idx_slug_erkek_en**: (slug_erkek_en)
- **idx_slug_kiz_tr**: (slug_kiz_tr)
- **idx_slug_kiz_en**: (slug_kiz_en)
- **idx_universities_name_ar**: (name_ar)
- **idx_universities_slug_ar**: (slug_ar)
- **idx_universities_slug_yurtlari_ar**: (slug_yurtlari_ar)
- **idx_universities_slug_erkek_ar**: (slug_erkek_ar)
- **idx_universities_slug_kiz_ar**: (slug_kiz_ar)
- **idx_universities_cityid**: (cityId)

### Örnek Kayıtlar
```json
[
  {
    "id": 1,
    "name": "Marmara Üniversitesi",
    "name_en": "Marmara University",
    "name_ar": "جامعة مرمرة",
    "slug": "marmara-universitesi",
    "slug_yurtlari_tr": "marmara-universitesi-yurtlari",
    "slug_yurtlari_en": "marmara-uni-dormitories",
    "slug_yurtlari_ar": "marmara-uni-dormitories",
    "slug_erkek_tr": "marmara-universitesi-erkek-yurtlari",
    "slug_erkek_en": "marmara-uni-male-dormitories",
    "slug_erkek_ar": "marmara-uni-male-dormitories",
    "slug_kiz_tr": "marmara-universitesi-kiz-yurtlari",
    "slug_kiz_en": "marmara-uni-female-dormitories",
    "slug_kiz_ar": "marmara-uni-female-dormitories",
    "slug_en": "marmara-uni",
    "slug_ar": "marmara-uni",
    "cityId": 34,
    "lat": "41.01324240",
    "lng": "28.96376090"
  },
  {
    "id": 2,
    "name": "Boğaziçi Üniversitesi",
    "name_en": "Boğaziçi University",
    "name_ar": "جامعة بوغازيتشي",
    "slug": "bogazici-universitesi",
    "slug_yurtlari_tr": "bogazici-universitesi-yurtlari",
    "slug_yurtlari_en": "bogazici-uni-dormitories",
    "slug_yurtlari_ar": "bogazici-uni-dormitories",
    "slug_erkek_tr": "bogazici-universitesi-erkek-yurtlari",
    "slug_erkek_en": "bogazici-uni-male-dormitories",
    "slug_erkek_ar": "bogazici-uni-male-dormitories",
    "slug_kiz_tr": "bogazici-universitesi-kiz-yurtlari",
    "slug_kiz_en": "bogazici-uni-female-dormitories",
    "slug_kiz_ar": "bogazici-uni-female-dormitories",
    "slug_en": "bogazici-uni",
    "slug_ar": "bogazici-uni",
    "cityId": 34,
    "lat": "41.08327340",
    "lng": "29.05050090"
  }
]
```

---

## Tablo: `dormfeature`

- **Toplam Kayıt:** 87

### Sütun Yapısı
| Sütun Adı | Veri Tipi | Null | Anahtar (Key) | Varsayılan | Ekstra |
|---|---|---|---|---|---|
| `id` | int(11) | NO | PRI | NULL | auto_increment |
| `name` | varchar(255) | NO |  | NULL |  |
| `type` | varchar(20) | NO | MUL | NULL |  |

### İndeksler
- **PRIMARY**: (id)
- **DormFeature_type_idx**: (type)

### Örnek Kayıtlar
```json
[
  {
    "id": 161,
    "name": "Parmak Okuyucu Giriş Sistemi",
    "type": "DORM"
  },
  {
    "id": 162,
    "name": "Hamam",
    "type": "DORM"
  }
]
```

---

## Tablolar Arası İlişki ve JOIN Haritası (Entity Relationship)

1. **Yurt Arama ve Üniversite Mesafeleri:**
   - `ai_dorm_search_index.dorm_id` <==> `ai_dorm_university_flat.dorm_id` <==> `universities.id`
   - *Avantaj:* `ai_dorm_university_flat` tablosunda 16.215 satır hazır hesaplanmış yürüme ve araç süreleri (`walking_minutes`, `driving_minutes`, `within_20km`) var.

2. **Yurt Fiyat Tahminleri:**
   - `ai_dorm_search_index.dorm_id` <==> `dorm_price_predictions.dorm_id`
   - Fiyat aralığı: `predicted_min_price` - `predicted_max_price`, güven skoru: `confidence_score`.

3. **Yorumlar ve Kullanıcı Deneyimi:**
   - `ai_dorm_search_index.dorm_id` <==> `dorm_reviews.dorm_id` (Google yorumları, puanlar, artı/eksi analizler)
   - `ai_dorm_search_index.dorm_id` <==> `dorm_reviews_summary.dorm_id`

4. **Toplu Taşıma ve Lokasyon:**
   - `transit_stations` tablosunda metro, metrobüs, tramvay, marmaray hatları koordinatlarıyla (`lat`, `lng`, `line_code`, `line_name`) mevcut.
