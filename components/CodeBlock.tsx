'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  value: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language = 'text', value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 text-neutral-100 text-sm shadow-xs">
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-800 border-b border-neutral-700/60 text-xs text-neutral-300 font-mono">
        <span className="uppercase tracking-wider text-[11px] font-medium">{language || 'kod'}</span>
        <button
          id={`copy-code-${language}`}
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer text-xs"
          title="Kodu kopyala"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Kopyalandı</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Kopyala</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13.5px] leading-relaxed font-mono font-normal">
        <code>{value}</code>
      </pre>
    </div>
  );
};
