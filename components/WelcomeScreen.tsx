'use client';

import React from 'react';
import { Code, FileText, Lightbulb, Compass, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectPrompt }) => {
  const suggestions = [
    {
      title: 'Kadıköy Erkek Yurtları',
      desc: 'Kadıköy bölgesindeki erkek öğrenci yurtlarını, fiyatları ve puanları listele',
      prompt: 'Kadıköy\'deki erkek öğrenci yurtlarını, Google puanlarını ve tahmini aylık fiyatlarını karşılaştırmalı olarak listeler misin?',
      icon: Compass,
    },
    {
      title: 'Marmara Üniversitesi Yakını',
      desc: 'Marmara Üniversitesi yerleşkelerine en yakın kız/erkek yurtları',
      prompt: 'Marmara Üniversitesi Göztepe Kampüsü\'ne yakın öğrenci yurtlarını, mesafe ve olanaklarıyla birlikte önerir misin?',
      icon: Lightbulb,
    },
    {
      title: 'Bütçe & Fiyat Analizi',
      desc: 'İstanbul veya Ankara\'da uygun fiyatlı yurt seçenekleri',
      prompt: 'İstanbul\'da aylık 20.000 TL altındaki öğrenci yurtlarını ve sundukları imkanları listeler misin?',
      icon: FileText,
    },
    {
      title: 'Yurt Karşılaştırma & Olanaklar',
      desc: 'Yemek, internet, servis ve güvenlik gibi olanakları sorgula',
      prompt: 'Ege Üniversitesi ve Bornova çevresindeki yemekli ve çalışma salonu olan yurtları önerir misin?',
      icon: Sparkles,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-4 text-center my-auto">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-neutral-100 text-neutral-800 mb-4 shadow-2xs">
          <Sparkles className="w-6 h-6 stroke-[1.75]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight">
          Eyurtlar AI Asistanına Hoş Geldiniz
        </h1>
        <p className="text-neutral-500 text-sm mt-2 max-w-md mx-auto">
          Yurt arama, üniversite yakınlıkları, tahmini fiyatlar, ulaşım ve öğrenci yorumları hakkında dilediğinizi sorabilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full mt-4 text-left">
        {suggestions.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              id={`suggestion-card-${index}`}
              onClick={() => onSelectPrompt(item.prompt)}
              className="flex flex-col p-3.5 rounded-2xl border border-neutral-200/80 bg-white hover:bg-neutral-50/90 hover:border-neutral-300 transition-all cursor-pointer group shadow-2xs text-left"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className="w-4 h-4 text-neutral-500 group-hover:text-neutral-900 transition-colors" />
                <span className="text-sm font-medium text-neutral-900">
                  {item.title}
                </span>
              </div>
              <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                {item.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
