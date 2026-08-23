'use client';

import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Enter', desc: 'Mesaj gönder' },
    { key: 'Shift + Enter', desc: 'Yeni satır ekle' },
    { key: '⌘ / Ctrl + K', desc: 'Yeni sohbet başlat' },
    { key: 'Esc', desc: 'Pencereleri kapat' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <div className="flex items-center gap-2 text-neutral-900 font-semibold text-base">
            <Keyboard className="w-4 h-4 text-neutral-700" />
            <span>Klavye Kısayolları</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-neutral-100 last:border-0 text-sm">
              <span className="text-neutral-600">{sc.desc}</span>
              <kbd className="px-2 py-1 bg-neutral-100 border border-neutral-200 rounded-md font-mono text-xs text-neutral-800 shadow-2xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-3 bg-neutral-50 border-t border-neutral-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-900 text-white rounded-xl text-xs font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
};
