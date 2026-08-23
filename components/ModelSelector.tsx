'use client';

import React, { useRef, useEffect } from 'react';
import { Sparkles, Zap, Brain, Check } from 'lucide-react';
import { ModelId, ModelOption } from '@/lib/types';

interface ModelSelectorProps {
  selectedModel: ModelId;
  onSelectModel: (model: ModelId) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.5 Flash Lite',
    badge: 'Varsayılan • Hızlı',
    description: 'Ultra hızlı yanıt süresi, anlık sorgulamalar ve veritabanı analizleri için optimize edildi.',
    speed: 'Çok Hızlı',
  },
  {
    id: 'gemini-3.7-flash',
    name: 'Gemini 3.7 Flash',
    badge: 'Dengeli & Zeki',
    description: 'Yüksek akıl yürütme yeteneği, karmaşık sorular ve yaratıcı içerikler için ideal.',
    speed: 'Dengeli',
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro',
    badge: 'Derin Akıl Yürütme',
    description: 'En gelişmiş STEM, derin kodlama, mimari analiz ve mantıksal problem çözümü.',
    speed: 'Kapsamlı',
  },
];

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onSelectModel,
  isOpen,
  onClose,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getModelIcon = (id: ModelId) => {
    switch (id) {
      case 'gemini-3.1-flash-lite':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'gemini-3.7-flash':
        return <Sparkles className="w-4 h-4 text-emerald-500" />;
      case 'gemini-3.1-pro-preview':
        return <Brain className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-14 left-4 z-50 w-84 bg-white rounded-2xl border border-neutral-200/90 shadow-xl p-2 animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="px-3 py-2 border-b border-neutral-100 mb-1">
        <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          Model Seçimi
        </span>
      </div>

      <div className="space-y-1">
        {AVAILABLE_MODELS.map((model) => {
          const isSelected = selectedModel === model.id;
          return (
            <button
              key={model.id}
              id={`select-model-${model.id}`}
              onClick={() => {
                onSelectModel(model.id);
                onClose();
              }}
              className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-start justify-between gap-2 ${
                isSelected
                  ? 'bg-neutral-100/90 text-neutral-900 border border-neutral-200/60'
                  : 'hover:bg-neutral-50 text-neutral-700'
              }`}
            >
              <div className="flex items-start gap-2.5 flex-1">
                <div className="p-1 rounded-lg bg-neutral-50 border border-neutral-200/60 mt-0.5">
                  {getModelIcon(model.id)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-neutral-900">
                      {model.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-medium">
                      {model.badge}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1 leading-snug">
                    {model.description}
                  </p>
                </div>
              </div>

              {isSelected && (
                <Check className="w-4 h-4 text-neutral-900 shrink-0 mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
