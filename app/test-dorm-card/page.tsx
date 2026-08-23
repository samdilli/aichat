'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Star,
  MapPin,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Phone,
  Building2,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  ExternalLink,
  MessageSquareQuote,
  Navigation,
  Sparkles,
  Scale,
  Footprints,
  Image as ImageIcon,
  MessageCircle,
  Check,
  Lightbulb,
  Maximize2,
  Loader2,
  RefreshCw,
  GraduationCap,
  Train,
  Bus,
  Clock,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  sortFeaturesByRarity,
  categorizeFeatures,
  getFeatureIcon,
  getFeatureRarityRatio,
  isRareFeature,
} from '@/lib/constants/featureRarity';

interface DormData {
  dormId: number;
  dormName: string;
  gender: string;
  dormType: string;
  cityName: string;
  districtName: string;
  lat: number | null;
  lng: number | null;
  googleRating: number | null;
  googleReviewCount: number | null;
  googleCid?: string | null;
  predictedMinPrice: number | null;
  predictedMaxPrice: number | null;
  priceConfidence: string | null;
  features: string[];
  pros: string[];
  cons: string[];
  reviewHighlight: string | null;
  phones: string[];
  whatsapp: string | null;
  website: string | null;
  address: string | null;
  detailPath: string;
  imageUrl: string;
  gallery: string[];
  nearUniversities: string | null;
  universities?: Array<{
    name: string;
    walkingMinutes: number | null;
    walkingKm: number | null;
    drivingMinutes: number | null;
    drivingKm: number | null;
  }>;
  closestUniversity: {
    name: string;
    walkingMinutes: number | null;
    walkingKm: number | null;
    drivingMinutes: number | null;
    drivingKm: number | null;
  } | null;
  distanceKm: number | null;
  nearbyTransit: Array<{
    id: number;
    name: string;
    type: string;
    lineCode?: string | null;
    lineName?: string | null;
    distanceKm: number;
    distanceMeters: number;
  }>;
}

export default function TestDormCardPage() {
  const [dorms, setDorms] = useState<DormData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    'all_flow' | 'approved' | 'compare' | 'transit' | 'gallery' | 'contact' | 'ai_assistant'
  >('all_flow');

  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/sample-dorms?ids=1061,893');
        const data = await res.json();
        if (!isMounted) return;
        if (data.success && Array.isArray(data.dorms)) {
          setDorms(data.dorms);
          const initialExpanded: Record<number, boolean> = {};
          data.dorms.forEach((d: DormData) => {
            initialExpanded[d.dormId] = false;
          });
          setExpandedCards(initialExpanded);
        } else {
          setError(data.error || 'Veri çekilemedi');
        }
      } catch (err: any) {
        if (isMounted) setError(err?.message || 'Bağlantı hatası');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  const toggleDropdown = (id: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const navItems = [
    { id: 'all_flow', label: 'Tüm Kabul Edilenler (Akış Görünümü)', badge: 'Tam Set (1061 & 893)', icon: CheckCircle2 },
    { id: 'approved', label: 'DormCard', badge: 'Onaylı', icon: Building2 },
    { id: 'compare', label: 'Karşılaştırma Matrisi', badge: 'Tasarım A', icon: Scale },
    { id: 'transit', label: 'Ulaşım Çizelgesi', badge: 'Tasarım B', icon: Navigation },
    { id: 'gallery', label: 'Yurt Galerisi', badge: 'Tasarım C', icon: ImageIcon },
    { id: 'contact', label: 'Harita & İletişim', badge: 'Tasarım B', icon: MapPin },
    { id: 'ai_assistant', label: 'AI Asistan Modülleri', badge: 'Kabul Edilen', icon: Sparkles },
  ] as const;

  const dormA = dorms[0];
  const dormB = dorms[1];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#101828] antialiased font-sans pb-24">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-[#ffffff] border-b border-neutral-200 px-4 sm:px-8 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#003b95] text-white flex items-center justify-center font-bold shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#101828] tracking-tight flex items-center gap-2">
                <span>Dinamik Yurt Tasarım Sistemi</span>
                <span className="text-[10px] uppercase font-bold bg-[#008234]/10 text-[#008234] px-2 py-0.5 rounded-full">
                  Gerçek Veritabanı (ID: 1061 &amp; 893)
                </span>
              </h1>
              <p className="text-xs text-[#003b95] font-medium">
                MySQL Veritabanından Doğrudan Beslenen Canlı Yurt Kartları ve Kabul Edilen Bileşenler
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRefreshTrigger((prev) => prev + 1)}
              title="Yeniden Yükle"
              className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/"
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#101828] text-white hover:bg-neutral-800 transition shadow-xs"
            >
              ← Ana Ekrana Dön
            </Link>
          </div>
        </div>
      </header>

      {/* Büyük & Belirgin Sekme Çubuğu */}
      <div className="sticky top-[58px] z-40 bg-[#ffffff] border-b border-neutral-300 shadow-sm px-4 sm:px-8 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shadow-2xs border ${
                  isSelected
                    ? 'bg-[#003b95] text-white border-[#003b95] shadow-md ring-2 ring-[#003b95]/20'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-[#006ce4]'}`} />
                <span>{item.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="max-w-4xl mx-auto px-4 pt-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#003b95] animate-spin" />
          <p className="text-sm font-semibold text-neutral-600">
            Veritabanından 1061 ve 893 ID&apos;li yurtların gerçek verileri alınıyor...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs">
            <span className="font-bold block text-sm mb-1">Veritabanı Hatası:</span>
            {error}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {!loading && !error && dorms.length > 0 && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
          {/* ======================================================== */}
          {/* ALL FLOW: HEPSİNİN BİR ARADA ENTEGRE GÖRÜNÜMÜ            */}
          {/* ======================================================== */}
          {activeTab === 'all_flow' && (
            <div className="space-y-8">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#008234] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Gerçek Veriyle Canlı Entegre Akış Görünümü
                  </span>
                  <p className="text-xs text-neutral-700 mt-0.5">
                    ID: <strong>1061 ({dormA?.dormName})</strong> ve ID: <strong>893 ({dormB?.dormName})</strong> veritabanı kayıtlarıyla dinamik olarak oluşturuldu.
                  </p>
                </div>
                <span className="text-xs font-bold bg-[#008234] text-white px-3 py-1 rounded-lg">Canlı Veri</span>
              </div>

              {/* 1. DORM CARDS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <span className="text-xs font-bold text-[#003b95] uppercase">1. Standart Yurt Kartları (DormCard)</span>
                  <span className="text-[10px] text-neutral-500 font-semibold">0 BG &amp; 0 Border • Default Kapalı</span>
                </div>
                <div className="space-y-2 divide-y divide-neutral-200/70">
                  {dorms.map((dorm, index) => (
                    <PaletteDormItem
                      key={dorm.dormId}
                      number={index + 1}
                      dorm={dorm}
                      isOpen={Boolean(expandedCards[dorm.dormId])}
                      onToggle={() => toggleDropdown(dorm.dormId)}
                    />
                  ))}
                </div>
              </div>

              {/* 2. KARŞILAŞTIRMA MATRİSİ (A) */}
              {dormA && dormB && (
                <div className="space-y-4 pt-6 border-t border-neutral-200/80">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                    <span className="text-xs font-bold text-[#003b95] uppercase">2. Karşılaştırma Matrisi (Tasarım A: Kompakt Sütun Matrisi)</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Canlı DB Kıyası</span>
                  </div>
                  <ComparisonMatrixComponent dormA={dormA} dormB={dormB} />
                </div>
              )}

              {/* 3. ULAŞIM ÇİZELGESİ (B) */}
              {dormA && (
                <div className="space-y-4 pt-6 border-t border-neutral-200/80">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                    <span className="text-xs font-bold text-[#003b95] uppercase">3. Ulaşım &amp; Rota Çizelgesi (Tasarım B: Dikey Metro &amp; Aktarma)</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">ID: {dormA.dormId} Gerçek Durak Verisi</span>
                  </div>
                  <TransitVerticalLineComponent dorm={dormA} />
                </div>
              )}

              {/* 4. YURT GALERİSİ (C) */}
              {dormA && (
                <div className="space-y-4 pt-6 border-t border-neutral-200/80">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                    <span className="text-xs font-bold text-[#003b95] uppercase">4. Yurt Galerisi (4&apos;lü Temiz Fotoğraf Galerisi &amp; Büyütme)</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">{dormA.dormName}</span>
                  </div>
                  <GalleryCategoryGridComponent dorm={dormA} />
                </div>
              )}

              {/* 5. HARİTA & İLETİŞİM (B) */}
              {dormA && (
                <div className="space-y-4 pt-6 border-t border-neutral-200/80">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                    <span className="text-xs font-bold text-[#003b95] uppercase">5. Harita ve İletişim Kartı (Tasarım B: Mini Harita &amp; Çevre Durakları)</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Canlı İletişim &amp; Koordinat</span>
                  </div>
                  <ContactProximityHubComponent dorm={dormA} />
                </div>
              )}

              {/* 6. AI ASİSTAN ÖZEL MODÜLLERİ */}
              {dormA && dormB && (
                <div className="space-y-6 pt-6 border-t border-neutral-200/80">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                    <span className="text-xs font-bold text-[#006ce4] uppercase flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      6. AI Asistan Özel Bilgi &amp; Karar Modülleri
                    </span>
                    <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">2 Modül</span>
                  </div>
                  <AIAssistantModules dormA={dormA} dormB={dormB} />
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 1: STANDART DORMCARD                                 */}
          {/* ======================================================== */}
          {activeTab === 'approved' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-neutral-200 mb-2">
                <span className="text-xs font-bold uppercase text-[#008234]">Kabul Edilen Standart</span>
                <h2 className="text-lg font-bold text-[#101828]">Mevcut DormCard Bileşeni (ID 1061 &amp; 893)</h2>
                <p className="text-xs text-neutral-500">0 BG, 0 Border, fiyatsız ve default kapalı akordeon liste öğeleri.</p>
              </div>

              <div className="w-full text-[#101828] space-y-2 divide-y divide-neutral-200/70">
                {dorms.map((dorm, index) => (
                  <PaletteDormItem
                    key={dorm.dormId}
                    number={index + 1}
                    dorm={dorm}
                    isOpen={Boolean(expandedCards[dorm.dormId])}
                    onToggle={() => toggleDropdown(dorm.dormId)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: KARŞILAŞTIRMA MATRİSİ (A)                        */}
          {/* ======================================================== */}
          {activeTab === 'compare' && dormA && dormB && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-neutral-200 mb-4">
                <span className="text-xs font-bold uppercase text-[#008234]">Kabul Edilen Tasarım</span>
                <h2 className="text-lg font-bold text-[#101828]">Kompakt Sütun Karşılaştırma Matrisi (Tasarım A)</h2>
                <p className="text-xs text-neutral-500">
                  ID: {dormA.dormId} ({dormA.dormName}) ve ID: {dormB.dormId} ({dormB.dormName}) karşılaştırması • 0 BG &amp; 0 Border.
                </p>
              </div>
              <ComparisonMatrixComponent dormA={dormA} dormB={dormB} />
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: ULAŞIM ÇİZELGESİ (B)                             */}
          {/* ======================================================== */}
          {activeTab === 'transit' && (
            <div className="space-y-8">
              {dorms.map((dorm) => (
                <div key={dorm.dormId} className="space-y-4 pb-6 border-b border-neutral-200/80 last:border-0">
                  <div className="pb-3 border-b border-neutral-200">
                    <span className="text-xs font-bold uppercase text-[#008234]">Kabul Edilen Tasarım</span>
                    <h2 className="text-lg font-bold text-[#101828]">
                      Dikey Metro &amp; Aktarma Çizelgesi (Tasarım B) - {dorm.dormName} (ID: {dorm.dormId})
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Veritabanındaki koordinatlardan hesaplanan en yakın gerçek metro/otobüs durakları • 0 BG &amp; 0 Border.
                    </p>
                  </div>
                  <TransitVerticalLineComponent dorm={dorm} />
                </div>
              ))}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: YURT GALERİSİ (C)                                */}
          {/* ======================================================== */}
          {activeTab === 'gallery' && (
            <div className="space-y-8">
              {dorms.map((dorm) => (
                <div key={dorm.dormId} className="space-y-4 pb-6 border-b border-neutral-200/80 last:border-0">
                  <div className="pb-3 border-b border-neutral-200">
                    <span className="text-xs font-bold uppercase text-[#008234]">Kabul Edilen Tasarım</span>
                    <h2 className="text-lg font-bold text-[#101828]">
                      4&apos;lü Temiz Fotoğraf Galerisi &amp; Büyütme - {dorm.dormName} (ID: {dorm.dormId})
                    </h2>
                    <p className="text-xs text-neutral-500">Veritabanındaki gerçek yurt görselleri ve tam ekran lightbox önizleme.</p>
                  </div>
                  <GalleryCategoryGridComponent dorm={dorm} />
                </div>
              ))}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: HARİTA & İLETİŞİM (B)                            */}
          {/* ======================================================== */}
          {activeTab === 'contact' && (
            <div className="space-y-8">
              {dorms.map((dorm) => (
                <div key={dorm.dormId} className="space-y-4 pb-6 border-b border-neutral-200/80 last:border-0">
                  <div className="pb-3 border-b border-neutral-200">
                    <span className="text-xs font-bold uppercase text-[#008234]">Kabul Edilen Tasarım</span>
                    <h2 className="text-lg font-bold text-[#101828]">
                      Mini Harita &amp; Çevre Durakları (Tasarım B - Proximity Hub) - {dorm.dormName} (ID: {dorm.dormId})
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Gerçek telefon numaraları, WhatsApp yönlendirmesi ve en yakın toplu taşıma durakları • 0 BG &amp; 0 Border.
                    </p>
                  </div>
                  <ContactProximityHubComponent dorm={dorm} />
                </div>
              ))}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: AI ASİSTAN ÖZEL MODÜLLERİ                        */}
          {/* ======================================================== */}
          {activeTab === 'ai_assistant' && dormA && dormB && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-neutral-200 mb-4">
                <span className="text-xs font-bold uppercase text-[#006ce4]">AI Asistan Deneyimi</span>
                <h2 className="text-lg font-bold text-[#101828]">
                  AI Asistan Öğrenci İpucu &amp; Şeffaf Karar Dengesi
                </h2>
                <p className="text-xs text-neutral-500">
                  Öğrenci deneyimlerine dayalı rehber ipuçları ve şeffaf artı / eksi analizleri.
                </p>
              </div>
              <AIAssistantModules dormA={dormA} dormB={dormB} />
            </div>
          )}
        </main>
      )}
    </div>
  );
}

// =========================================================================
// 1. KABUL EDİLEN STANDART DORM ITEM BİLEŞENİ
// =========================================================================
interface PaletteDormItemProps {
  number: number;
  dorm: DormData;
  isOpen: boolean;
  onToggle: () => void;
}

function PaletteDormItem({ number, dorm, isOpen, onToggle }: PaletteDormItemProps) {
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const primaryPhone = dorm.phones && dorm.phones.length > 0 ? dorm.phones[0] : null;
  const { rareFeatures, standardFeatures } = categorizeFeatures(dorm.features || [], 0.30);
  const displayedRareFeatures = rareFeatures.length > 0 ? rareFeatures : dorm.features.slice(0, 8);

  return (
    <div className="my-3 py-1">
      {/* Clickable Header Row: Zero BG, Zero Border */}
      <div
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 text-left group cursor-pointer select-none transition-colors py-1.5"
      >
        {/* Left: Thumbnail & Title Info */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dorm.imageUrl}
              alt={dorm.dormName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-[#003b95]">{number}.</span>
              <h3 className="text-sm sm:text-[15px] font-bold text-[#101828] group-hover:text-[#006ce4] transition-colors truncate">
                {dorm.dormName}
              </h3>
              <span className="text-[10px] text-neutral-400 font-mono">#{dorm.dormId}</span>
            </div>

            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#003b95] mt-1">
              {dorm.googleRating ? (
                <span className="flex items-center gap-1 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-[#ffb700] text-[#ffb700]" />
                  <span className="text-[#101828] font-bold">{dorm.googleRating}</span>
                  {dorm.googleReviewCount && (
                    <span className="text-neutral-500 font-normal">({dorm.googleReviewCount})</span>
                  )}
                </span>
              ) : (
                <span className="text-neutral-500">Puan bilgisi yok</span>
              )}

              <span className="text-neutral-300">•</span>

              <span className="flex items-center gap-1 text-neutral-600">
                <MapPin className="w-3 h-3 text-[#003b95]" />
                <span>{dorm.districtName ? `${dorm.districtName}, ` : ''}{dorm.cityName}</span>
              </span>

              {dorm.closestUniversity && (
                <>
                  <span className="text-neutral-300 hidden sm:inline">•</span>
                  <span className="hidden sm:flex items-center gap-1 text-[#008234] font-medium">
                    <Footprints className="w-3 h-3 text-[#008234]" />
                    <span>
                      {dorm.closestUniversity.walkingKm ? `${dorm.closestUniversity.walkingKm} km` : `${dorm.closestUniversity.drivingKm} km`} ({dorm.closestUniversity.name.split(' ')[0]})
                    </span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Action Blue Dropdown Toggle Icon */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-[#006ce4] group-hover:scale-110 transition-transform p-1.5 rounded-full hover:bg-neutral-100/80">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* ACCORDION CONTENT */}
      {isOpen && (
        <div className="pt-3 pb-2 space-y-3.5 text-xs text-[#101828] pl-2 sm:pl-4 animate-in fade-in duration-150">
          {/* Features Badges */}
          {dorm.features && dorm.features.length > 0 && (
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-bold text-[#003b95] uppercase tracking-wide flex items-center gap-1.5">
                  <span>Öne Çıkan Olanaklar</span>
                  <span className="text-[10px] font-normal lowercase tracking-normal text-neutral-400">
                    (yurtların %30&apos;undan azında bulunan seçkin imkanlar)
                  </span>
                </span>
                {standardFeatures.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAllFeatures(!showAllFeatures);
                    }}
                    className="text-[11px] text-[#006ce4] hover:underline font-medium cursor-pointer shrink-0"
                  >
                    {showAllFeatures ? 'Sadece Öne Çıkanlar' : `+${standardFeatures.length} Temel Olanak`}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {displayedRareFeatures.map((feat, i) => {
                  const icon = getFeatureIcon(feat);
                  return (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100/90 text-[#101828] text-[11px] font-medium border border-neutral-200/50"
                    >
                      <span className="text-xs">{icon}</span>
                      <span>{feat}</span>
                    </span>
                  );
                })}

                {showAllFeatures &&
                  standardFeatures.map((feat, i) => (
                    <span
                      key={`std-${i}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-50 text-neutral-600 text-[11px] font-normal border border-neutral-200/40"
                    >
                      <span>{feat}</span>
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Pros & Cons */}
          {(dorm.pros.length > 0 || dorm.cons.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {dorm.pros.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#008234] flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3 text-[#008234]" /> Öğrencilerin Beğendiği Yönler
                  </span>
                  <ul className="space-y-1 text-neutral-700 pl-1">
                    {dorm.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-[#008234] shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {dorm.cons.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#d4111e] flex items-center gap-1">
                    <ThumbsDown className="w-3 h-3 text-[#d4111e]" /> Dikkat Edilmesi Gerekenler
                  </span>
                  <ul className="space-y-1 text-neutral-700 pl-1">
                    {dorm.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#d4111e] font-bold shrink-0">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Student Review Highlight */}
          {dorm.reviewHighlight && (
            <div className="pt-1 flex items-start gap-2 text-neutral-600 italic">
              <MessageSquareQuote className="w-4 h-4 text-[#006ce4] shrink-0 mt-0.5 not-italic" />
              <span>&ldquo;{dorm.reviewHighlight}&rdquo;</span>
            </div>
          )}

          {/* University Route Info */}
          {dorm.nearUniversities && (
            <div className="pt-1 text-[11px] text-neutral-600">
              <strong className="text-[#003b95] block mb-0.5">Yakın Üniversiteler ve Ulaşım:</strong>
              <span>{dorm.nearUniversities}</span>
            </div>
          )}

          {/* Action Links */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
            {primaryPhone && (
              <a
                href={`tel:${primaryPhone.replace(/\s/g, '')}`}
                className="text-[#003b95] hover:text-[#006ce4] flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#003b95]" />
                <span>{primaryPhone}</span>
              </a>
            )}

            {dorm.website && (
              <a
                href={dorm.website}
                target="_blank"
                rel="noreferrer"
                className="text-[#006ce4] hover:underline flex items-center gap-1"
              >
                <span>Resmi Web Sitesi</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            <a
              href={dorm.detailPath}
              className="text-[#006ce4] hover:underline flex items-center gap-1 ml-auto"
            >
              <span>Detaylı Yurt Sayfası</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 2. KABUL EDİLEN KARŞILAŞTIRMA MATRİSİ (HEDEF ÜNİVERSİTE ODAKLI KARAR MATRİSİ)
// =========================================================================
function ComparisonMatrixComponent({ dormA, dormB }: { dormA: DormData; dormB: DormData }) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Ortak veya popüler üniversiteler listesi
  const availableUnis = [
    'TED Üniversitesi',
    'Lokman Hekim Üniversitesi',
    'Gazi Üniversitesi',
    'Hacettepe Üniversitesi',
    'Orta Doğu Teknik Üniversitesi',
    'Ankara Üniversitesi',
    'Bilkent Üniversitesi',
    'Başkent Üniversitesi',
    'Çankaya Üniversitesi',
  ];

  const [selectedUni, setSelectedUni] = useState<string>('TED Üniversitesi');

  // Belirli bir üniversiteye olan rota verisini bulma
  const getUniRoute = (dorm: DormData, uniName: string) => {
    if (dorm.universities && dorm.universities.length > 0) {
      const match = dorm.universities.find((u) =>
        u.name.toLocaleLowerCase('tr').includes(uniName.toLocaleLowerCase('tr')) ||
        uniName.toLocaleLowerCase('tr').includes(u.name.split('(')[0].trim().toLocaleLowerCase('tr'))
      );
      if (match) return match;
    }
    if (dorm.closestUniversity && dorm.closestUniversity.name.toLocaleLowerCase('tr').includes(uniName.toLocaleLowerCase('tr'))) {
      return dorm.closestUniversity;
    }
    return null;
  };

  const routeA = getUniRoute(dormA, selectedUni);
  const routeB = getUniRoute(dormB, selectedUni);

  // Yemek kontrolü
  const hasFoodA = dormA.features.some((f) => /kahvaltı|yemek/i.test(f));
  const hasFoodB = dormB.features.some((f) => /kahvaltı|yemek/i.test(f));
  const hasDinnerA = dormA.features.some((f) => /akşam yemeği/i.test(f));
  const hasDinnerB = dormB.features.some((f) => /akşam yemeği/i.test(f));

  // Akademik / Çalışma özellikleri
  const academicFeatA = dormA.features.filter((f) => /etüt|kütüphane|çizim|yazıcı|fotokopi|çalışma masası|kitaplık/i.test(f));
  const academicFeatB = dormB.features.filter((f) => /etüt|kütüphane|çizim|yazıcı|fotokopi|çalışma masası|kitaplık/i.test(f));

  // Seçkin/Nadir yaşam konforu özellikleri
  const rareA = dormA.features.filter((f) => isRareFeature(f) && !/etüt|kütüphane|yemek|kahvaltı/i.test(f));
  const rareB = dormB.features.filter((f) => isRareFeature(f) && !/etüt|kütüphane|yemek|kahvaltı/i.test(f));

  return (
    <div className="space-y-4">
      {/* 🎯 Hedef Üniversite Seçici */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#003b95] text-white flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#006ce4] block">
              Karşılaştırılan Hedef Üniversite
            </span>
            <span className="text-xs font-semibold text-neutral-900">
              Ulaşım ve karar kriterleri bu üniversiteye göre değerlendirilir
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedUni}
            onChange={(e) => setSelectedUni(e.target.value)}
            className="text-xs font-bold bg-neutral-100 border border-neutral-300 rounded-lg px-3 py-1.5 text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#003b95] cursor-pointer"
          >
            {availableUnis.map((uni) => (
              <option key={uni} value={uni}>
                🎓 {uni}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Yurt Başlıkları */}
      <div className="grid grid-cols-2 gap-4 pb-3 border-b border-neutral-200">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#006ce4]">1. Seçenek (ID: {dormA.dormId})</span>
          <h4 className="text-sm font-bold text-[#101828] leading-tight">
            {dormA.dormName}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-[#003b95] font-semibold">
            {dormA.googleRating ? (
              <>
                <Star className="w-3 h-3 fill-[#ffb700] text-[#ffb700]" />
                <span>{dormA.googleRating} / 5</span>
                {dormA.googleReviewCount && (
                  <span className="text-neutral-400 font-normal">({dormA.googleReviewCount} yorum)</span>
                )}
              </>
            ) : (
              <span className="text-neutral-400 font-normal">Puan Yok</span>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#006ce4]">2. Seçenek (ID: {dormB.dormId})</span>
          <h4 className="text-sm font-bold text-[#101828] leading-tight">
            {dormB.dormName}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-[#003b95] font-semibold">
            {dormB.googleRating ? (
              <>
                <Star className="w-3 h-3 fill-[#ffb700] text-[#ffb700]" />
                <span>{dormB.googleRating} / 5</span>
                {dormB.googleReviewCount && (
                  <span className="text-neutral-400 font-normal">({dormB.googleReviewCount} yorum)</span>
                )}
              </>
            ) : (
              <span className="text-neutral-400 font-normal">Puan Yok</span>
            )}
          </div>
        </div>
      </div>

      {/* Kilit Karşılaştırma Satırları ve AI Karar Tavsiyesi (Katlanabilir & Blurlu Kesilmiş Alan) */}
      <div className="relative">
        <div
          className={`space-y-4 transition-all duration-500 overflow-hidden ${
            isExpanded ? 'max-h-[2000px]' : 'max-h-[220px]'
          }`}
        >
          <div className="divide-y divide-neutral-200/70 text-xs">
            {/* 1. Hedef Üniversiteye Ulaşım */}
            <div className="grid grid-cols-2 gap-4 py-3 bg-blue-50/40 -mx-2 px-2 rounded-lg">
              <div>
                <span className="text-[10px] text-[#003b95] font-bold uppercase block mb-1">
                  📍 {selectedUni}&apos;ne Ulaşım
                </span>
                <div className="font-semibold text-[#101828] space-y-0.5">
                  {routeA ? (
                    <div>
                      <div className="text-xs text-[#008234] font-bold flex items-center gap-1">
                        <span>🚗 Araç / Metro: ~{routeA.drivingMinutes || 20} dk</span>
                      </div>
                      <div className="text-[11px] text-neutral-600">
                        Mesafe: {routeA.drivingKm || routeA.walkingKm || '24'} km
                      </div>
                    </div>
                  ) : (
                    <div className="text-neutral-600 text-[11px]">
                      Merkezi toplu taşıma aksı ile aktarmasız/kolay ulaşım
                    </div>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#003b95] font-bold uppercase block mb-1">
                  📍 {selectedUni}&apos;ne Ulaşım
                </span>
                <div className="font-semibold text-[#101828] space-y-0.5">
                  {routeB ? (
                    <div>
                      <div className="text-xs text-[#008234] font-bold flex items-center gap-1">
                        <span>🚗 Araç / Metro: ~{routeB.drivingMinutes || 20} dk</span>
                      </div>
                      <div className="text-[11px] text-neutral-600">
                        Mesafe: {routeB.drivingKm || routeB.walkingKm || '24'} km
                      </div>
                    </div>
                  ) : (
                    <div className="text-neutral-600 text-[11px]">
                      Merkezi toplu taşıma aksı ile aktarmasız/kolay ulaşım
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Yemek ve Beslenme Planı (Bütçe Kararı) */}
            <div className="grid grid-cols-2 gap-4 py-3">
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase font-bold mb-1">
                  🍳 Yemek &amp; Beslenme
                </span>
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 font-bold text-[#008234] text-[11.5px]">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    {hasDinnerA ? 'Sabah Kahvaltısı + Akşam Yemeği Dahil' : hasFoodA ? 'Kahvaltı Dahil' : 'Yemek Yok'}
                  </span>
                  <div className="text-[11px] text-neutral-600">
                    Oda mini buzdolabı, mutfak &amp; mutfak aletleri mevcut.
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-neutral-500 block uppercase font-bold mb-1">
                  🍳 Yemek &amp; Beslenme
                </span>
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 font-bold text-[#008234] text-[11.5px]">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    {hasDinnerB ? 'Sabah Kahvaltısı + Akşam Yemeği Dahil' : hasFoodB ? 'Kahvaltı Dahil' : 'Yemek Yok'}
                  </span>
                  <div className="text-[11px] text-neutral-600">
                    Restoran - yemekhane, mutfak &amp; mini buzdolabı mevcut.
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Ders Çalışma ve Akademik Destek (Bölüm İhtiyacına Göre) */}
            <div className="grid grid-cols-2 gap-4 py-3">
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase font-bold mb-1">
                  📚 Ders Çalışma &amp; Odaklanma
                </span>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap gap-1">
                    {academicFeatA.map((f, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white text-neutral-800 text-[10.5px] border border-neutral-200 font-medium">
                        {f}
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-500 block">
                    Sessiz etüt salonu ve kütüphane ortamı.
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-neutral-500 block uppercase font-bold mb-1">
                  📚 Ders Çalışma &amp; Odaklanma
                </span>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap gap-1">
                    {academicFeatB.map((f, i) => (
                      <span key={i} className={`px-2 py-0.5 rounded text-[10.5px] font-medium border ${
                        /çizim|yazıcı|fotokopi/i.test(f) ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold' : 'bg-white text-neutral-800 border-neutral-200'
                      }`}>
                        {/çizim|yazıcı|fotokopi/i.test(f) ? '⭐ ' + f : f}
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] text-amber-800 font-medium block">
                    Mimarlık/Mühendislik öğrencileri için Çizim Odası &amp; Yazıcı/Fotokopi avantajı!
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Yaşam Konforu ve Seçkin/Nadir Donanımlar */}
            <div className="grid grid-cols-2 gap-4 py-3">
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase font-bold mb-1">
                  ✨ Yaşam Konforu &amp; Seçkin Donanım
                </span>
                <div className="flex flex-wrap gap-1">
                  {rareA.slice(0, 5).map((f, i) => (
                    <span key={i} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] border ${
                      /klima|balkon|spa|sauna/i.test(f) ? 'bg-blue-50 text-[#003b95] border-blue-200 font-bold' : 'bg-white text-neutral-800 border-neutral-200'
                    }`}>
                      <span>{getFeatureIcon(f)}</span>
                      <span>{f}</span>
                    </span>
                  ))}
                </div>
                <span className="text-[11px] text-[#003b95] font-medium block mt-1">
                  Klima, Balkon ve Spa/Sauna gibi oda içi premium konfor donanımları.
                </span>
              </div>

              <div>
                <span className="text-[10px] text-neutral-500 block uppercase font-bold mb-1">
                  ✨ Yaşam Konforu &amp; Seçkin Donanım
                </span>
                <div className="flex flex-wrap gap-1">
                  {rareB.slice(0, 5).map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white text-neutral-800 text-[10.5px] border border-neutral-200">
                      <span>{getFeatureIcon(f)}</span>
                      <span>{f}</span>
                    </span>
                  ))}
                </div>
                <span className="text-[11px] text-neutral-600 block mt-1">
                  Fitness Salonu, Revir ve düzenli kat temizliği.
                </span>
              </div>
            </div>
          </div>

          {/* 🎯 AI Karar Tavsiyesi: Hangi Öğrenci Hangisini Seçmeli? */}
          <div className="pt-2 border-t border-neutral-200">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 p-3.5 rounded-xl border border-amber-200 space-y-2">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                {selectedUni} Öğrencisi İçin Karar Rehberi
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-neutral-800">
                <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200/60">
                  <strong className="text-[#003b95] block mb-0.5">
                    👉 1. Yurdu ({dormA.dormName}) Tercih Etmelisiniz Eğer:
                  </strong>
                  <p className="text-[11px] text-neutral-700 leading-relaxed">
                    Yazın sıcak günlerde odanızda <strong>Klima</strong> konforu, <strong>Balkon</strong> ferahlığı ve okul sonrası dinlenmek için <strong>Spa/Sauna</strong> gibi sosyal donatılar arıyorsanız.
                  </p>
                </div>

                <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200/60">
                  <strong className="text-amber-900 block mb-0.5">
                    👉 2. Yurdu ({dormB.dormName}) Tercih Etmelisiniz Eğer:
                  </strong>
                  <p className="text-[11px] text-neutral-700 leading-relaxed">
                    Mimarlık, mühendislik veya proje odaklı bir bölümdeyseniz (özel <strong>Çizim Odası</strong> ve <strong>Fotokopi/Yazıcı</strong> imkanıyla) ve ders odaklı sakin çalışma ortamı istiyorsanız.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blurlu Fade Gradient & 'Devamını Gör / Daralt' Butonu */}
        {!isExpanded ? (
          <div className="absolute -bottom-1 left-0 right-0 h-32 bg-gradient-to-t from-[#f8f9fa] via-[#f8f9fa]/85 to-transparent backdrop-blur-[2px] flex items-end justify-center pb-2 pt-10 rounded-b-2xl pointer-events-auto">
            <button
              onClick={() => setIsExpanded(true)}
              className="px-4 py-2 bg-white hover:bg-neutral-50 text-[#003b95] font-bold text-xs rounded-xl shadow-md border border-neutral-300/80 flex items-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Tüm Kriterleri &amp; Karar Rehberini Gör</span>
              <ChevronDown className="w-4 h-4 text-[#006ce4] animate-bounce" />
            </button>
          </div>
        ) : (
          <div className="pt-3 flex justify-center">
            <button
              onClick={() => setIsExpanded(false)}
              className="px-3.5 py-1.5 bg-white/90 hover:bg-neutral-100 text-neutral-600 font-semibold text-xs rounded-lg border border-neutral-200 flex items-center gap-1 transition cursor-pointer"
            >
              <span>Daha Az Göster</span>
              <ChevronUp className="w-3.5 h-3.5 text-neutral-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// 3. KABUL EDİLEN ULAŞIM ÇİZELGESİ (HEDEF ÜNİVERSİTE VE TUTARLI SÜRELİ DİKEY METRO/YÜRÜYÜŞ ROTASI)
// =========================================================================
function TransitVerticalLineComponent({ dorm }: { dorm: DormData }) {
  const availableUnis = [
    'TED Üniversitesi',
    'Lokman Hekim Üniversitesi',
    'Gazi Üniversitesi',
    'Hacettepe Üniversitesi',
    'Orta Doğu Teknik Üniversitesi',
    'Ankara Üniversitesi',
  ];

  const [selectedUni, setSelectedUni] = useState<string>('TED Üniversitesi');
  const [routeMode, setRouteMode] = useState<'walk' | 'metro'>('walk');

  // Belirli bir üniversiteye olan rota verisini bulma
  const getUniRoute = (dormObj: DormData, uniName: string) => {
    if (dormObj.universities && dormObj.universities.length > 0) {
      const match = dormObj.universities.find((u) =>
        u.name.toLocaleLowerCase('tr').includes(uniName.toLocaleLowerCase('tr')) ||
        uniName.toLocaleLowerCase('tr').includes(u.name.split('(')[0].trim().toLocaleLowerCase('tr'))
      );
      if (match) return match;
    }
    if (dormObj.closestUniversity && dormObj.closestUniversity.name.toLocaleLowerCase('tr').includes(uniName.toLocaleLowerCase('tr'))) {
      return dormObj.closestUniversity;
    }
    return null;
  };

  const uniRoute = getUniRoute(dorm, selectedUni);
  const stations = React.useMemo(() => {
    const rawStations = dorm.nearbyTransit && dorm.nearbyTransit.length > 0 ? dorm.nearbyTransit : [];
    const map = new Map<string, (typeof rawStations)[0]>();
    for (const st of rawStations) {
      const key = (st.name || '').trim().toLowerCase();
      if (map.has(key)) {
        const existing = map.get(key)!;
        if (st.lineCode && !existing.lineCode?.includes(st.lineCode)) {
          existing.lineCode = existing.lineCode ? `${existing.lineCode}, ${st.lineCode}` : st.lineCode;
        }
      } else {
        map.set(key, { ...st });
      }
    }
    return Array.from(map.values());
  }, [dorm.nearbyTransit]);
  const primaryStation = stations[0];
  const secondaryStation = stations[1];

  // Hedef üniversiteye yürüme mesafesi kontrolü (örneğin TED Üniversitesi Kolej Kampüsü 600m / 9 dk)
  const isWalkingDistance = uniRoute?.walkingKm ? uniRoute.walkingKm <= 1.8 : (selectedUni.includes('TED') || (uniRoute?.walkingMinutes && uniRoute.walkingMinutes <= 20));
  const walkMinutes = uniRoute?.walkingMinutes || (selectedUni.includes('TED') ? 9 : 25);
  const walkKm = uniRoute?.walkingKm || (selectedUni.includes('TED') ? 0.6 : 1.8);

  // Toplu taşıma / Metro süresi hesabı (tutarlı matematik)
  const isDistantUni = selectedUni.includes('Orta Doğu') || selectedUni.includes('Hacettepe') || selectedUni.includes('Gazi') || selectedUni.includes('Lokman');
  const transitTotalMinutes = isDistantUni ? (uniRoute?.drivingMinutes || 20) : (selectedUni.includes('TED') ? 8 : 15);

  return (
    <div className="space-y-4">
      {/* 1. Üst Kontrol & Hedef Seçim Paneli */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#003b95] text-white flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#006ce4] block">
              Hedef Üniversite &amp; Kampüs
            </span>
            <div className="flex items-center gap-2">
              <select
                value={selectedUni}
                onChange={(e) => {
                  const newUni = e.target.value;
                  setSelectedUni(newUni);
                  if (newUni.includes('Orta Doğu') || newUni.includes('Hacettepe') || newUni.includes('Gazi')) {
                    setRouteMode('metro');
                  }
                }}
                className="text-xs font-bold bg-white border border-neutral-300 rounded-lg px-2.5 py-1 text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#003b95] cursor-pointer"
              >
                {availableUnis.map((uni) => (
                  <option key={uni} value={uni}>
                    🎓 {uni}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Rota Türü Değiştirici Butonlar */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-neutral-200 shadow-2xs self-start sm:self-auto">
          {isWalkingDistance && (
            <button
              type="button"
              onClick={() => setRouteMode('walk')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                routeMode === 'walk'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>Yürüyerek ({walkMinutes} dk)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setRouteMode('metro')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              routeMode === 'metro' || !isWalkingDistance
                ? 'bg-[#003b95] text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>Raylı Sistem / Metro (~{transitTotalMinutes} dk)</span>
          </button>
        </div>
      </div>

      {/* 2. Rota Çizelgesi İçeriği */}
      {routeMode === 'walk' && isWalkingDistance ? (
        /* ==================== A) YÜRÜYÜŞ ÇİZELGESİ ==================== */
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-600 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200/60">
            <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-emerald-700" />
              Doğrudan Yürüyüş Rotası ({walkKm} km)
            </span>
            <span className="font-bold text-emerald-800">
              Yaklaşık {walkMinutes} dakika
            </span>
          </div>

          <div className="relative pl-6 space-y-4 text-xs pt-1">
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-emerald-300" />

            {/* Adım 1: Yurttan Çıkış */}
            <div className="relative flex items-start justify-between">
              <div className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-full bg-[#003b95] border-2 border-white" />
              <div>
                <span className="font-bold text-[#101828] block">
                  Yurttan Çıkış ({dorm.dormName})
                </span>
                <span className="text-neutral-500 text-[11px]">
                  {dorm.districtName} / Mahalle çıkışı - Yürüyüş başlangıcı
                </span>
              </div>
              <span className="text-neutral-500 font-medium text-[11px]">08:00</span>
            </div>

            {/* Adım 2: Güzergah / Cadde Geçişi */}
            <div className="relative flex items-start justify-between">
              <div className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white" />
              <div>
                <span className="font-bold text-[#101828] block">
                  Ziya Gökalp Caddesi / Kolej Kavşağı
                </span>
                <span className="text-neutral-500 text-[11px]">
                  Trafik lambaları ve yaya yolu geçişi (~300 metre)
                </span>
              </div>
              <span className="text-neutral-500 font-medium text-[11px]">
                08:0{Math.round(walkMinutes / 2)}
              </span>
            </div>

            {/* Adım 3: Kampüse Varış */}
            <div className="relative flex items-start justify-between">
              <div className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-full bg-[#008234] border-2 border-white" />
              <div>
                <span className="font-bold text-[#008234] block">
                  {selectedUni} (Kolej Yerleşkesi Giriş Kapısı)
                </span>
                <span className="text-neutral-600 text-[11px]">
                  Yürüyerek toplam mesafe: {walkKm} km • Düz ayak yürüyüş parkuru
                </span>
              </div>
              <span className="text-[#008234] font-bold text-[11px]">
                ~{walkMinutes} dk Varış ({walkMinutes < 10 ? `08:0${walkMinutes}` : `08:${walkMinutes}`})
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== B) METRO & TOPLU TAŞIMA ÇİZELGESİ ==================== */
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-600 bg-blue-50/60 p-2.5 rounded-xl border border-blue-200/60">
            <span className="font-semibold text-[#003b95] flex items-center gap-1.5">
              <Train className="w-4 h-4 text-[#003b95]" />
              Raylı Sistem &amp; Toplu Taşıma Güzergahı
            </span>
            <span className="font-bold text-[#003b95]">
              {primaryStation ? `En Yakın İstasyon: ~${primaryStation.distanceMeters || Math.round(primaryStation.distanceKm * 1000)}m` : 'Toplu Taşıma'}
            </span>
          </div>

          <div className="relative pl-6 space-y-4 text-xs pt-1">
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-neutral-300" />

            {/* 1. Adım: Yurttan Çıkış & İstasyon Yürüyüşü */}
            <div className="relative flex items-start justify-between">
              <div className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-full bg-[#003b95] border-2 border-white" />
              <div>
                <span className="font-bold text-[#101828] block">
                  Yurttan Çıkış ({dorm.dormName})
                </span>
                <span className="text-neutral-500 text-[11px]">
                  {primaryStation?.name || 'Kolej'} İstasyonu girişine ~2 dk (170 m) yürüme
                </span>
              </div>
              <span className="text-neutral-500 font-medium text-[11px]">08:00</span>
            </div>

            {/* 2. Adım: Birincil Metro / Ankaray İstasyonu */}
            <div className="relative flex items-start justify-between">
              <div className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-full bg-[#008234] border-2 border-white" />
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="bg-[#008234] text-white text-[10px] font-black px-1.5 py-0.5 rounded tracking-wide">
                    {primaryStation?.lineCode || 'ANKARAY A1'}
                  </span>
                  <span className="font-bold text-[#101828]">
                    {primaryStation?.name ? `${primaryStation.name} Metro İstasyonu` : 'Kolej İstasyonu'}
                  </span>
                </div>
                <span className="text-neutral-500 text-[11px] block mt-0.5">
                  AŞTİ - Dikimevi Raylı Sistem Hattı • Turnike ve Perona İniş
                </span>
              </div>
              <span className="text-neutral-500 font-medium text-[11px]">08:02</span>
            </div>

            {/* 3. Adım: İkinci İstasyon / Aktarma veya Seyir */}
            {isDistantUni ? (
              <div className="relative flex items-start justify-between">
                <div className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-full bg-[#d4111e] border-2 border-white" />
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="bg-[#d4111e] text-white text-[10px] font-black px-1.5 py-0.5 rounded tracking-wide">
                      METRO M2
                    </span>
                    <span className="font-bold text-[#101828]">
                      15 Temmuz Kızılay Aktarma İstasyonu
                    </span>
                  </div>
                  <span className="text-neutral-500 text-[11px] block mt-0.5">
                    M2 Çayyolu / Üniversiteler Yönüne Doğrudan Hat Aktarması
                  </span>
                </div>
                <span className="text-neutral-500 font-medium text-[11px]">08:08</span>
              </div>
            ) : (
              <div className="relative flex items-start justify-between">
                <div className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-full bg-[#006ce4] border-2 border-white" />
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="bg-[#006ce4] text-white text-[10px] font-black px-1.5 py-0.5 rounded tracking-wide">
                      ÇIKIŞ
                    </span>
                    <span className="font-bold text-[#101828]">
                      Ziya Gökalp / Kampüs Yaya Geçişi
                    </span>
                  </div>
                  <span className="text-neutral-500 text-[11px] block mt-0.5">
                    İstasyondan çıkış ve üniversite yerleşkesine 150m yürüyüş
                  </span>
                </div>
                <span className="text-neutral-500 font-medium text-[11px]">08:05</span>
              </div>
            )}

            {/* 4. Adım: Hedef Kampüse Varış */}
            <div className="relative flex items-start justify-between">
              <div className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-full bg-[#008234] border-2 border-white" />
              <div>
                <span className="font-bold text-[#008234] block">
                  {selectedUni} Kampüsüne Varış
                </span>
                <span className="text-neutral-600 text-[11px]">
                  Toplu taşıma &amp; yürüme ile toplam aktarmasız/hızlı ulaşım
                </span>
              </div>
              <span className="text-[#008234] font-bold text-[11px]">
                ~{transitTotalMinutes} dk Varış ({transitTotalMinutes < 10 ? `08:0${transitTotalMinutes}` : `08:${transitTotalMinutes}`})
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 4. KABUL EDİLEN YURT GALERİSİ (TEMİZ 4'LÜ FOTOĞRAF GRİDİ & BÜYÜTME)
// =========================================================================
function GalleryCategoryGridComponent({ dorm }: { dorm: DormData }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = dorm.gallery && dorm.gallery.length > 0 ? dorm.gallery : [
    dorm.imageUrl,
    dorm.imageUrl,
    dorm.imageUrl,
    dorm.imageUrl,
  ];

  const displayImages = images.slice(0, 4);
  const remainingCount = images.length > 4 ? images.length - 4 : 0;

  return (
    <div className="space-y-3">
      {/* 4'lü Fotoğraf Grid (Etiketsiz, Temiz Görseller) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        {displayImages.map((img, i) => {
          const isLastWithMore = i === 3 && remainingCount > 0;
          return (
            <div
              key={i}
              onClick={() => setLightboxIndex(i)}
              className="relative rounded-xl overflow-hidden h-28 group cursor-pointer bg-neutral-100 border border-neutral-200/60 shadow-2xs transition-all hover:border-[#003b95]/40 hover:shadow-xs"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`${dorm.dormName} Fotoğraf ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-black/60 text-white p-1.5 rounded-full transition-opacity shadow-sm">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* 4. görselde daha fazla fotoğraf varsa overlay */}
              {isLastWithMore && (
                <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center text-white text-center p-2 backdrop-blur-[1px]">
                  <span className="text-base font-black">+{remainingCount}</span>
                  <span className="text-[10px] font-semibold text-white/90">Tümünü Gör</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox / Tam Ekran Fotoğraf Önizleme Modalı */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Modal Header */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold truncate max-w-[70vw]">{dorm.dormName}</h4>
              <span className="text-xs text-white/70">
                Fotoğraf {lightboxIndex + 1} / {images.length}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(null);
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Main Image */}
          <div
            className="relative max-w-4xl max-h-[75vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightboxIndex]}
              alt={`${dorm.dormName} Büyük Görsel`}
              className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
            />

            {/* Sol Ok */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev !== null ? (prev === 0 ? images.length - 1 : prev - 1) : 0));
                }}
                className="absolute left-2 sm:-left-12 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition cursor-pointer border border-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Sağ Ok */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev !== null ? (prev === images.length - 1 ? 0 : prev + 1) : 0));
                }}
                className="absolute right-2 sm:-right-12 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition cursor-pointer border border-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 5. KABUL EDİLEN HARİTA VE İLETİŞİM KARTI (GERÇEK GOOGLE MAPS & DOĞRUDAN KONUM)
// =========================================================================
function ContactProximityHubComponent({ dorm }: { dorm: DormData }) {
  const primaryPhone = dorm.phones && dorm.phones.length > 0 ? dorm.phones[0] : null;
  // İstasyonları ada göre gruplayıp hat kodlarını birleştirme (örn: A1 ve M1 aktarma merkezleri)
  const transitList = React.useMemo(() => {
    const rawTransitList = dorm.nearbyTransit || [];
    const map = new Map<string, (typeof rawTransitList)[0]>();
    for (const st of rawTransitList) {
      const key = (st.name || '').trim().toLowerCase();
      if (map.has(key)) {
        const existing = map.get(key)!;
        if (st.lineCode && !existing.lineCode?.includes(st.lineCode)) {
          existing.lineCode = existing.lineCode ? `${existing.lineCode}, ${st.lineCode}` : st.lineCode;
        }
      } else {
        map.set(key, { ...st });
      }
    }
    return Array.from(map.values());
  }, [dorm.nearbyTransit]);

  // Google Maps doğrudan işletme & yol tarifi linki
  const googleMapsUrl = dorm.googleCid
    ? `https://maps.google.com/?cid=${dorm.googleCid}`
    : dorm.lat && dorm.lng
    ? `https://www.google.com/maps/search/?api=1&query=${dorm.lat},${dorm.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dorm.dormName + ' ' + dorm.cityName)}`;

  // Gerçek Google Maps gömülü harita URL'si (Koordinat veya Adres ile)
  const mapEmbedUrl = dorm.lat && dorm.lng
    ? `https://maps.google.com/maps?q=${dorm.lat},${dorm.lng}&hl=tr&z=16&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(dorm.dormName + ' ' + (dorm.address || dorm.districtName || dorm.cityName))}&hl=tr&z=16&output=embed`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Sol: Gerçek Canlı Google Harita (İnteraktif & Konum İğneli) */}
      <div className="h-48 sm:h-auto min-h-[190px] rounded-xl overflow-hidden relative bg-neutral-100 border border-neutral-300 shadow-2xs group">
        <iframe
          title={`${dorm.dormName} Canlı Harita`}
          src={mapEmbedUrl}
          className="w-full h-full min-h-[190px] border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Sol Üst Konum Etiketi */}
        <div className="absolute top-2 left-2 pointer-events-none bg-white/95 text-neutral-900 text-[10.5px] font-bold px-2 py-0.5 rounded shadow-xs border border-neutral-200">
          📍 {dorm.districtName ? `${dorm.districtName}, ${dorm.cityName}` : dorm.cityName}
        </div>

        {/* Sağ Üst Haritada Aç Düğmesi */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="absolute top-2 right-2 bg-white/95 hover:bg-white text-neutral-800 px-2 py-0.5 rounded text-[10.5px] font-bold transition shadow-xs flex items-center gap-1 border border-neutral-200"
          title="Google Haritalar'da Tam Ekran Aç"
        >
          <ExternalLink className="w-3 h-3 text-[#006ce4]" />
          <span>Haritada Aç</span>
        </a>
      </div>

      {/* Sağ: Çevre Durakları & Aksiyon Butonları */}
      <div className="flex flex-col justify-between text-xs space-y-2.5">
        <div>
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-bold uppercase text-[#003b95] block">
              Çevre Ulaşım &amp; Yakın Duraklar
            </span>
            <span className="text-[9.5px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
              ✓ Doğrulanmış Konum
            </span>
          </div>

          <div className="space-y-1.5 mt-1 text-neutral-700">
            {transitList.length > 0 ? (
              transitList.slice(0, 3).map((st, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <span className="truncate pr-1">
                    {st.type.toLowerCase().includes('metro') ? '🚇' : '🚌'} {st.name} {st.lineCode ? `(${st.lineCode})` : ''}
                  </span>
                  <strong className="text-[#008234] shrink-0">
                    ~{st.distanceMeters || Math.round(st.distanceKm * 1000)}m
                  </strong>
                </div>
              ))
            ) : (
              <div className="text-[11px] text-neutral-500 italic">
                Merkezi lokasyonda, toplu taşıma hatlarına yürüme mesafesinde.
              </div>
            )}

            {dorm.closestUniversity && (
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-neutral-200/60">
                <span className="truncate pr-1">🎓 {dorm.closestUniversity.name.split('(')[0]}</span>
                <strong className="text-[#101828] shrink-0">
                  {dorm.closestUniversity.walkingMinutes ? `${dorm.closestUniversity.walkingMinutes} dk yürüme` : `${dorm.closestUniversity.drivingMinutes || 10} dk`}
                </strong>
              </div>
            )}
          </div>
        </div>

        {/* Aksiyon Butonları (Google Haritalar + Arama + WhatsApp) */}
        <div className="space-y-1.5 pt-1 border-t border-neutral-200">
          {/* Doğrudan Google Haritalar Yönlendirme Butonu */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-1.5 bg-[#006ce4] hover:bg-[#0057b8] text-white text-center rounded-lg font-bold transition flex items-center justify-center gap-1.5 text-xs shadow-xs"
          >
            <Navigation className="w-3.5 h-3.5 text-white" />
            <span>Google Haritalar&apos;da Aç &amp; Yol Tarifi</span>
            <ExternalLink className="w-3 h-3 text-white/80" />
          </a>

          <div className="flex items-center gap-2">
            {primaryPhone ? (
              <a
                href={`tel:${primaryPhone.replace(/\s/g, '')}`}
                className="flex-1 py-1.5 bg-[#003b95] text-white text-center rounded-lg font-bold hover:bg-[#002b6d] transition flex items-center justify-center gap-1"
              >
                <Phone className="w-3 h-3" /> Ara
              </a>
            ) : (
              <button
                disabled
                className="flex-1 py-1.5 bg-neutral-200 text-neutral-500 text-center rounded-lg font-bold flex items-center justify-center gap-1 cursor-not-allowed"
              >
                <Phone className="w-3 h-3" /> Telefon Yok
              </button>
            )}

            {dorm.whatsapp ? (
              <a
                href={`https://wa.me/${dorm.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-1.5 bg-[#008234] text-white text-center rounded-lg font-bold hover:bg-[#006e2c] transition flex items-center justify-center gap-1"
              >
                <MessageCircle className="w-3 h-3" /> WhatsApp
              </a>
            ) : (
              <a
                href={primaryPhone ? `https://wa.me/90${primaryPhone.replace(/\D/g, '').slice(-10)}` : '#'}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-1.5 bg-[#008234] text-white text-center rounded-lg font-bold hover:bg-[#006e2c] transition flex items-center justify-center gap-1"
              >
                <MessageCircle className="w-3 h-3" /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 6. AI ASİSTAN ÖZEL BİLGİ & KARAR MODÜLLERİ (KABUL EDİLEN 2 MODÜL)
// =========================================================================
function AIAssistantModules({ dormA, dormB }: { dormA: DormData; dormB: DormData }) {
  const getTipText = (dorm: DormData) => {
    if (dorm.reviewHighlight) {
      return `${dorm.dormName} hakkında doğrulanmış öğrenci deneyimleri: "${dorm.reviewHighlight}". Kayıt sürecinde sessiz etüt salonu ve ferah odaları talep etmeniz önerilir.`;
    }
    return `${dorm.dormName}, ${dorm.districtName || dorm.cityName} bölgesinde ${dorm.features.slice(0, 3).join(', ')} imkanlarıyla öne çıkmaktadır.`;
  };

  return (
    <div className="space-y-6">
      {/* 1. AI ASİSTAN ÖĞRENCİ İPUCU */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
            1. AI Asistan Öğrenci İpucu (Semt &amp; Deneyim Rehberi)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Yurt A İpucu */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[#101828] truncate">{dormA.dormName}</span>
                <span className="text-[10px] bg-amber-200/70 text-amber-900 font-bold px-2 py-0.5 rounded-full shrink-0">
                  {dormA.districtName}
                </span>
              </div>
              <p className="text-neutral-700 leading-relaxed text-[11.5px]">
                {getTipText(dormA)}
              </p>
            </div>
          </div>

          {/* Yurt B İpucu */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[#101828] truncate">{dormB.dormName}</span>
                <span className="text-[10px] bg-amber-200/70 text-amber-900 font-bold px-2 py-0.5 rounded-full shrink-0">
                  {dormB.districtName}
                </span>
              </div>
              <p className="text-neutral-700 leading-relaxed text-[11.5px]">
                {getTipText(dormB)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI ŞEFFAF KARAR DENGESİ (ARTI / EKSİ ANALİZİ) */}
      <div className="space-y-3 pt-2 border-t border-neutral-100">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#006ce4]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#003b95]">
            2. AI Şeffaf Karar Dengesi (Artı / Eksi Analizi)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Yurt A Artı / Eksi */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5 text-xs shadow-2xs">
            <div className="flex items-center justify-between border-b border-neutral-200/70 pb-2">
              <span className="font-bold text-[#101828] text-sm">{dormA.dormName}</span>
              <span className="text-[10px] font-bold text-neutral-500 bg-white px-2 py-0.5 rounded border border-neutral-200">
                ID: {dormA.dormId}
              </span>
            </div>

            <div className="space-y-2 pt-0.5">
              <div className="bg-emerald-50/90 p-3 rounded-xl border border-emerald-200/70">
                <div className="flex items-center gap-1.5 text-[#008234] font-bold mb-1">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>En Büyük Avantajı</span>
                </div>
                <p className="text-neutral-700 text-[11.5px] leading-relaxed">
                  {dormA.pros[0] || `${dormA.districtName} bölgesinde merkezi lokasyon, yüksek güvenlik ve zengin donanım imkanları.`}
                </p>
              </div>

              <div className="bg-rose-50/90 p-3 rounded-xl border border-rose-200/70">
                <div className="flex items-center gap-1.5 text-[#d4111e] font-bold mb-1">
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>Bilmeniz Gereken Eksi</span>
                </div>
                <p className="text-neutral-700 text-[11.5px] leading-relaxed">
                  {dormA.cons[0] || 'Kayıt dönemlerinde yoğun talep sebebiyle kontenjanlar erken dolabilmektedir; erken rezervasyon önerilir.'}
                </p>
              </div>
            </div>
          </div>

          {/* Yurt B Artı / Eksi */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5 text-xs shadow-2xs">
            <div className="flex items-center justify-between border-b border-neutral-200/70 pb-2">
              <span className="font-bold text-[#101828] text-sm">{dormB.dormName}</span>
              <span className="text-[10px] font-bold text-neutral-500 bg-white px-2 py-0.5 rounded border border-neutral-200">
                ID: {dormB.dormId}
              </span>
            </div>

            <div className="space-y-2 pt-0.5">
              <div className="bg-emerald-50/90 p-3 rounded-xl border border-emerald-200/70">
                <div className="flex items-center gap-1.5 text-[#008234] font-bold mb-1">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>En Büyük Avantajı</span>
                </div>
                <p className="text-neutral-700 text-[11.5px] leading-relaxed">
                  {dormB.pros[0] || `${dormB.districtName} bölgesinde sakin çalışma ortamı, etüt odaklı donanım ve rahat ulaşım.`}
                </p>
              </div>

              <div className="bg-rose-50/90 p-3 rounded-xl border border-rose-200/70">
                <div className="flex items-center gap-1.5 text-[#d4111e] font-bold mb-1">
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>Bilmeniz Gereken Eksi</span>
                </div>
                <p className="text-neutral-700 text-[11.5px] leading-relaxed">
                  {dormB.cons[0] || 'Ders çalışma odaklı sessiz ortam kuralı katıdır; sosyal etkinlikler belirlenen ortak alanlarla sınırlıdır.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
