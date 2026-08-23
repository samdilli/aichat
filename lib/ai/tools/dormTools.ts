import { FunctionDeclaration, Type } from '@google/genai';
import { searchDorms, getDormByIdOrName, getDormTransportation } from '@/lib/db/services/dormService';
import { searchUniversities } from '@/lib/db/services/universityService';
import { searchTransitStations } from '@/lib/db/services/transitService';
import { queryLogStorage } from '@/lib/db/mysql';

export const dormFunctionDeclarations: FunctionDeclaration[] = [
  {
    name: 'searchDorms',
    description:
      'Türkiye genelindeki öğrenci yurtlarını veritabanından kesin olarak filtreler ve listeler. Şehir, ilçe, cinsiyet (kız/erkek), üniversite yakınlığı, fiyat aralığı ve OLANAKLAR/ÖZELLİKLER (örn: Banyo, Wc-Banyo, Otopark, Yüzme havuzu, Spor Salonu, Yemek, Okul Servisi, Klima, Çalışma Masası vb.) kriterlerine göre SQL sorgusu yapar.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        city: {
          type: Type.STRING,
          description: 'Arama yapılacak şehir adı (Örn: Manisa, İstanbul, Ankara, İzmir, Eskişehir, Bursa vb.)',
        },
        district: {
          type: Type.STRING,
          description: 'Arama yapılacak ilçe adı (Örn: Yunusemre, Şehzadeler, Kadıköy, Beşiktaş, Çankaya, Bornova vb.)',
        },
        gender: {
          type: Type.STRING,
          description: "Yurt cinsiyet tipi: 'Kız' veya 'Erkek'",
        },
        university: {
          type: Type.STRING,
          description:
            'Yakınında yurt aranan üniversite veya kampüs adı (Örn: "Manisa Celal Bayar Üniversitesi", "Nişantaşı Üniversitesi", "Işık Üniversitesi", "Marmara Üniversitesi", "İTÜ", "Boğaziçi", "ODTÜ", "Ege Üniversitesi"). Üniversiteye yakın yurt arandığında üniversite ismi MUTLAKA buraya yazılmalıdır.',
        },
        features: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            'Yurtta kesinlikle bulunması istenen olanaklar listesi. Örnekler: ["Banyo"], ["Wc-Banyo"], ["Otopark"], ["Yüzme havuzu"], ["Spor Salonu"], ["Okul Servisi"], ["Restoran - Yemekhane"], ["Klima"], ["Balkon"], ["Kütüphane"], ["24 Saat Güvenlik"]. Kullanıcı oda içinde banyo/tuvalet, otopark, yemek gibi herhangi bir olanak istediğinde MUTLAKA bu parametreyi kullanın.',
        },
        feature: {
          type: Type.STRING,
          description:
            'Tek bir olanak/özellik aramak için kısayol (Örn: "Banyo", "Wc-Banyo", "Otopark", "Havuz", "Spor Salonu", "Servis", "Yemek", "Klima", "Balkon").',
        },
        query: {
          type: Type.STRING,
          description:
            'Spesifik yurt ismi araması için serbest metin. Olanaklar için features veya feature parametresini kullanın.',
        },
        minPrice: {
          type: Type.NUMBER,
          description: 'Minimum aylık tahmin edilen yurt fiyatı (TL)',
        },
        maxPrice: {
          type: Type.NUMBER,
          description: 'Maksimum aylık tahmin edilen yurt fiyatı (TL)',
        },
        minRating: {
          type: Type.NUMBER,
          description: 'Minimum Google puanı (örn: 4.0)',
        },
        excludeDormIds: {
          type: Type.ARRAY,
          items: { type: Type.INTEGER },
          description:
            'Daha önce kullanıcıya gösterilmiş yurtların ID numaraları listesi. Kullanıcı "başka yok mu?", "daha fazla göster", "diğer seçenekler", "başka yurtlar" dediğinde aynı yurtları tekrar göstermemek için önceki mesajlarda listelenen yurtların ID\'lerini buraya verin.',
        },
        limit: {
          type: Type.INTEGER,
          description: 'Getirilecek maksimum yurt sayısı (varsayılan 3, max 10)',
        },
      },
    },
  },
  {
    name: 'getDormDetails',
    description:
      'Belirli bir yurdun detaylı bilgilerini, telefon/whatsapp iletişimini, açık adresini, Google kullanıcı yorum analizini (artı/eksi yönleri), olanaklarını, fiyat aralığını, yakındaki toplu taşıma duraklarını ve BELİRLİ BİR ÜNİVERSİTEYE OLAN MESAFESİNİ (nearUniversities) getirir. Kullanıcı listedeki veya adı geçen bir yurdun bir üniversiteye mesafesini, konumunu, olanaklarını veya iletişimini sorduğunda MUTLAKA bu aracı (dormNameOrId ve university parametreleriyle) kullanın.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        dormNameOrId: {
          type: Type.STRING,
          description: 'Yurdun adı veya veritabanındaki ID numarası (Örn: "Academia Maslak Erkek Öğrenci Yurdu" veya 2494)',
        },
        university: {
          type: Type.STRING,
          description:
            'Kullanıcının mesafesini öğrenmek istediği üniversite adı veya kısaltması (Örn: "Bahçeşehir Üniversitesi", "Nişantaşı Üniversitesi", "İTÜ Ayazağa", "YTÜ Davutpaşa"). Belirtilirse yakınlık bilgisi yalnızca bu üniversiteye göre filtrelenir; veritabanında bu üniversiteye rota/mesafe kaydı yoksa null döner.',
        },
      },
      required: ['dormNameOrId'],
    },
  },
  {
    name: 'getDormTransportation',
    description:
      'Belirli bir yurdun toplu taşıma olanaklarını, yakındaki metro/metrobüs/tramvay/banliyö duraklarını, okul servisi durumunu ve hedef üniversite/kampüse (örn: "İTÜ Ayazağa", "Nişantaşı Üniversitesi", vb.) olan gerçek yürüme ve araç rotasını/mesafesini getirir. Kullanıcı bir yurttan bir üniversiteye veya kampüse "nasıl gidilir?", "ulaşım nasıl?", "metro var mı?", "servis var mı?" diye sorduğunda MUTLAKA bu aracı kullanın.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        dormNameOrId: {
          type: Type.STRING,
          description: 'Yurdun adı veya ID numarası (Örn: "Academia Maslak Erkek Öğrenci Yurdu" veya 2494)',
        },
        university: {
          type: Type.STRING,
          description:
            'Gidilmek istenen üniversite, kampüs veya kısaltması (Örn: "İTÜ Ayazağa", "İstanbul Teknik Üniversitesi", "YTÜ Davutpaşa", "Nişantaşı Üniversitesi")',
        },
      },
      required: ['dormNameOrId'],
    },
  },
  {
    name: 'searchUniversities',
    description:
      'Yalnızca genel üniversite/kampüs araması yapar (üniversitenin hangi şehirde veya koordinatta olduğunu bulmak için). DİKKAT: Belirli bir yurdun bir üniversiteye olan mesafesini/yakınlığını öğrenmek için BU ARACI DEĞİL, getDormDetails veya getDormTransportation aracını kullanın.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: {
          type: Type.STRING,
          description: 'Üniversite adı veya kısaltması (Örn: "İTÜ", "ODTÜ", "Boğaziçi", "Bahçeşehir Üniversitesi")',
        },
        city: {
          type: Type.STRING,
          description: 'Şehir adı',
        },
      },
    },
  },
  {
    name: 'searchTransitStations',
    description: 'Şehirdeki metro, metrobüs, tramvay veya banliyö hat ve istasyonlarını arar.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        city: {
          type: Type.STRING,
          description: 'Şehir adı (Örn: İstanbul, Ankara, İzmir vb.)',
        },
        query: {
          type: Type.STRING,
          description: 'Durak adı veya hat kodu (Örn: "M2", "Metrobüs", "Marmaray", "Kadıköy")',
        },
        type: {
          type: Type.STRING,
          description: 'Ulaşım türü: "metro", "metrobus", "tramvay", "banliyo", "funikuler"',
        },
      },
    },
  },
];

export async function executeDormTool(name: string, args: Record<string, any>): Promise<any> {
  const storeBefore = queryLogStorage.getStore();
  const initialLogCount = storeBefore ? storeBefore.length : 0;

  try {
    let output: any;
    switch (name) {
      case 'searchDorms': {
        const results = await searchDorms({
          city: args.city,
          district: args.district,
          gender: args.gender,
          university: args.university,
          query: args.query,
          features: args.features,
          feature: args.feature,
          minPrice: args.minPrice,
          maxPrice: args.maxPrice,
          minRating: args.minRating,
          excludeDormIds: Array.isArray(args.excludeDormIds) ? args.excludeDormIds : undefined,
          limit: args.limit || 3,
        });

        const requestedFeatureList = [
          ...(Array.isArray(args.features) ? args.features : []),
          ...(args.feature ? [args.feature] : []),
        ].filter(Boolean);

        if (results.length === 0) {
          let guidanceMessage = 'Belirtilen filtreleme kriterlerine uygun yurt bulunamadı.';
          if (requestedFeatureList.length > 0) {
            guidanceMessage = `DİKKAT: ${args.district || args.city || 'Belirtilen'} bölgesinde "${requestedFeatureList.join(', ')}" olanağına sahip ${args.gender || ''} yurdu veritabanında BULUNAMADI (0 sonuç). ASLA kriterleri esnetip bu özelliği olmayan yurtları varmış gibi sunmayın veya uydurmayın! Kullanıcıya bu kriterlere (${requestedFeatureList.join(', ')}) sahip yurt bulunamadığını net ve dürüstçe söyleyin.`;
          }

          output = {
            success: true,
            count: 0,
            dorms: [],
            appliedFilters: args,
            systemGuidance: guidanceMessage,
          };
        } else {
          output = {
            success: true,
            count: results.length,
            appliedFilters: args,
            dorms: results,
          };
        }
        break;
      }
      case 'getDormDetails': {
        const result = await getDormByIdOrName(args.dormNameOrId, args.university);
        if (!result) {
          output = { success: false, message: 'Yurt bulunamadı.' };
        } else {
          output = {
            success: true,
            dorm: result,
          };
        }
        break;
      }
      case 'getDormTransportation': {
        const result = await getDormTransportation(args.dormNameOrId, args.university);
        if (!result) {
          output = { success: false, message: 'Yurt bulunamadı.' };
        } else {
          output = {
            success: true,
            transportation: result,
          };
        }
        break;
      }
      case 'searchUniversities': {
        const results = await searchUniversities(args.query || '', args.city, 6);
        output = {
          success: true,
          count: results.length,
          universities: results,
        };
        break;
      }
      case 'searchTransitStations': {
        const results = await searchTransitStations(args.query, args.city, args.type, 8);
        output = {
          success: true,
          count: results.length,
          stations: results,
        };
        break;
      }
      default:
        output = { error: `Bilinmeyen araç: ${name}` };
    }

    // Tag any new SQL queries generated during this tool call
    const storeAfter = queryLogStorage.getStore();
    if (storeAfter && storeAfter.length > initialLogCount) {
      for (let i = initialLogCount; i < storeAfter.length; i++) {
        storeAfter[i].toolName = name;
        storeAfter[i].toolArgs = args;
      }
    }

    return output;
  } catch (error: any) {
    console.error(`Tool execution error [${name}]:`, error);
    return {
      error: `Veritabanı sorgulanırken bir hata oluştu: ${error?.message || 'Bilinmeyen hata'}`,
    };
  }
}
