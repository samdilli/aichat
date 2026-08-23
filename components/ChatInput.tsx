'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  ArrowUp,
  Square,
  Paperclip,
  Globe,
  Sparkles,
  X,
  Mic,
  MicOff,
  Image as ImageIcon,
  FileCode,
} from 'lucide-react';
import { Attachment } from '@/lib/types';

interface ChatInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  onSend: (attachments?: Attachment[]) => void;
  onStop?: () => void;
  isLoading: boolean;
  disabled?: boolean;
  webSearch: boolean;
  setWebSearch: (enabled: boolean) => void;
  enableThinking: boolean;
  setEnableThinking: (enabled: boolean) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSend,
  onStop,
  isLoading,
  disabled,
  webSearch,
  setWebSearch,
  enableThinking,
  setEnableThinking,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea according to content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 180)}px`;
    }
  }, [input]);

  // Voice recognition support (Speech-to-Text)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'tr-TR';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
            setInput((prev: string) => (prev ? `${prev} ${currentTranscript}` : currentTranscript));
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [setInput]);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert('Tarayıcınız ses tanıma özelliğini desteklemiyor.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && (input.trim() || attachments.length > 0) && !disabled) {
        handleTriggerSend();
      }
    }
  };

  const handleTriggerSend = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    const currentAttachments = [...attachments];
    setAttachments([]);
    onSend(currentAttachments);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setAttachments((prev) => [
            ...prev,
            {
              name: file.name,
              type: file.type,
              dataUrl: reader.result as string,
            },
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setAttachments((prev) => [
            ...prev,
            {
              name: file.name,
              type: 'text/plain',
              textContent: reader.result as string,
            },
          ]);
        };
        reader.readAsText(file);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const canSubmit = (input.trim().length > 0 || attachments.length > 0) && !disabled;

  return (
    <div className="sticky bottom-0 w-full bg-gradient-to-t from-white via-white/95 to-transparent pt-3 pb-5 px-3 md:px-0 z-20">
      <div className="max-w-3xl mx-auto">
        {/* Attachment preview tags */}
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((att, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 border border-neutral-200/80 rounded-xl text-xs text-neutral-800 shadow-2xs animate-in fade-in"
              >
                {att.type.startsWith('image/') ? (
                  <ImageIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                ) : (
                  <FileCode className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                )}
                <span className="truncate max-w-[180px] font-medium">{att.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="text-neutral-400 hover:text-neutral-700 p-0.5 rounded-full hover:bg-neutral-200 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ChatGPT Style High-Radius Input Container */}
        <div className="relative flex flex-col bg-[#fbfbfb] hover:bg-neutral-50/90 focus-within:bg-white border border-neutral-200 focus-within:border-neutral-400 rounded-[28px] p-2 sm:p-2.5 shadow-xs focus-within:shadow-md transition-all duration-200">
          <textarea
            ref={textareaRef}
            id="chat-input-textarea"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="AI asistana bir mesaj gönderin..."
            disabled={disabled}
            className="w-full bg-transparent text-neutral-900 placeholder:text-neutral-400 text-[15px] px-3.5 py-1.5 focus:outline-none resize-none max-h-[180px] min-h-[28px] leading-relaxed"
          />

          <div className="flex items-center justify-between mt-1 px-1">
            {/* Left Tools */}
            <div className="flex items-center gap-1 text-neutral-500">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                accept=".txt,.md,.pdf,.png,.jpg,.jpeg,.webp,.json,.js,.ts,.tsx,.py,.html,.css"
              />

              <button
                id="attach-file-btn"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full hover:bg-neutral-200/70 text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
                title="Dosya veya Görsel Ekle"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button
                id="web-search-toggle-btn"
                type="button"
                onClick={() => setWebSearch(!webSearch)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  webSearch
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'text-neutral-600 hover:bg-neutral-200/70'
                }`}
                title="Google Arama Entegrasyonu (Canlı Web)"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Web Arama</span>
              </button>

              <button
                id="deep-reasoning-toggle-btn"
                type="button"
                onClick={() => setEnableThinking(!enableThinking)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  enableThinking
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'text-neutral-600 hover:bg-neutral-200/70'
                }`}
                title="Derin Akıl Yürütme Modu"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Derin Düşünme</span>
              </button>
            </div>

            {/* Right: Voice Input & Send/Stop button */}
            <div className="flex items-center gap-1.5">
              <button
                id="voice-input-btn"
                type="button"
                onClick={toggleSpeechRecognition}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-neutral-500 hover:bg-neutral-200/70 hover:text-neutral-800'
                }`}
                title={isListening ? 'Dinlemeyi Durdur' : 'Sesli Yaz'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {isLoading ? (
                <button
                  id="stop-generation-btn"
                  type="button"
                  onClick={onStop}
                  className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Yanıtı durdur"
                >
                  <Square className="w-3 h-3 fill-current" />
                </button>
              ) : (
                <button
                  id="send-message-btn"
                  type="button"
                  onClick={handleTriggerSend}
                  disabled={!canSubmit}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                    canSubmit
                      ? 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-xs cursor-pointer active:scale-95'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                  title="Mesaj gönder (Enter)"
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Minimal disclaimer footer */}
        <p className="text-center text-[11.5px] text-neutral-400 mt-2 font-normal">
          AI Asistan hata yapabilir. Önemli bilgileri kontrol ediniz.
        </p>
      </div>
    </div>
  );
};
