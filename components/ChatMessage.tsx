'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Pencil,
  Globe,
  FileCode,
  CheckCheck,
  Terminal,
  Database,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Layers,
  Cpu,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle2,
  Code2,
  Sparkles,
} from 'lucide-react';
import { Message, DebugInfo } from '@/lib/types';
import { CodeBlock } from './CodeBlock';

interface ChatMessageProps {
  message: Message;
  onRegenerate?: () => void;
  onEditUserMessage?: (messageId: string, newContent: string) => void;
  onOpenDebug?: (debugInfo: NonNullable<Message['debugInfo']>) => void;
  isLast?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onRegenerate,
  onEditUserMessage,
  onOpenDebug,
  isLast,
}) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownTab, setDropdownTab] = useState<'sql' | 'context' | 'json'>('sql');
  const [copiedSqlIndex, setCopiedSqlIndex] = useState<number | null>(null);
  const [copiedContext, setCopiedContext] = useState(false);

  const isAssistant = message.role === 'assistant';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Kopyalama başarısız:', err);
    }
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && onEditUserMessage) {
      onEditUserMessage(message.id, editContent.trim());
      setIsEditing(false);
    }
  };

  // Build fallback debug info if not provided directly
  const debugInfo: DebugInfo = message.debugInfo || {
    timestamp: message.createdAt,
    model: 'gemini-3.1-flash-lite',
    systemInstruction: 'Eyurtlar AI Öğrenci Yurdu ve Üniversite Danışmanı Sistem Promptu (Varsayılan)',
    formattedContents: [
      { role: 'user', parts: [{ text: 'Kullanıcı sorusu ve sohbet geçmişi' }] },
    ],
    fullContents: [
      { role: 'user', parts: [{ text: 'Kullanıcı sorusu ve sohbet geçmişi' }] },
    ],
    toolsProvided: [
      'searchDorms',
      'getDormDetails',
      'searchUniversities',
      'searchTransitStations',
    ],
    sqlLogs: [],
    totalDurationMs: 0,
  };

  const sqlCount = debugInfo.sqlLogs?.length || 0;

  const handleCopySql = async (sql: string, index: number) => {
    try {
      await navigator.clipboard.writeText(sql);
      setCopiedSqlIndex(index);
      setTimeout(() => setCopiedSqlIndex(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyContext = async () => {
    try {
      const textToCopy = JSON.stringify(
        {
          systemInstruction: debugInfo.systemInstruction,
          formattedContents: debugInfo.formattedContents,
          toolsProvided: debugInfo.toolsProvided,
        },
        null,
        2
      );
      await navigator.clipboard.writeText(textToCopy);
      setCopiedContext(true);
      setTimeout(() => setCopiedContext(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAssistant) {
    // User message: No avatar, sleek subtle bubble on the right
    return (
      <div className="flex flex-col items-end w-full my-4 group">
        {/* Attached previews */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap justify-end gap-2 mb-2 max-w-[80%] md:max-w-[70%]">
            {message.attachments.map((att, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden border border-neutral-200 shadow-2xs">
                {att.type.startsWith('image/') && att.dataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={att.dataUrl}
                    alt={att.name}
                    className="max-h-48 max-w-xs object-cover rounded-xl"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2.5 bg-neutral-100 text-neutral-800 text-xs font-mono">
                    <FileCode className="w-4 h-4 text-neutral-600" />
                    <span className="truncate max-w-[160px] font-medium">{att.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 max-w-[85%] md:max-w-[75%] justify-end">
          {/* Edit user message button */}
          {!isEditing && onEditUserMessage && (
            <button
              onClick={() => setIsEditing(true)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-all cursor-pointer"
              title="Mesajı Düzenle"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}

          {isEditing ? (
            <div className="w-full bg-neutral-100 p-3 rounded-2xl border border-neutral-300 shadow-sm">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-white p-2.5 text-sm rounded-xl border border-neutral-200 focus:outline-none resize-none leading-relaxed text-neutral-900"
                rows={3}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(message.content);
                  }}
                  className="px-3 py-1 text-xs rounded-lg text-neutral-600 hover:bg-neutral-200 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 text-xs bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 cursor-pointer flex items-center gap-1 font-medium"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Güncelle ve Gönder
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-100/90 text-neutral-900 px-5 py-3 rounded-3xl text-[15px] leading-relaxed break-words shadow-2xs">
              <p className="whitespace-pre-wrap font-normal">{message.content}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Assistant message: No avatar, NO message bubble (direct seamless text rendering)
  return (
    <div className="w-full my-6 text-neutral-900 group">
      <div className="w-full">
        {message.webSearchUsed && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-[11px] font-medium text-neutral-600 mb-3 shadow-2xs">
            <Globe className="w-3 h-3 text-neutral-500" />
            <span>Google Arama ile güncel bilgiler kullanıldı</span>
          </div>
        )}

        {message.error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-sm">
            {message.content}
          </div>
        ) : !message.content && message.isStreaming ? (
          /* Subtle Thinking state indicator while waiting for the first token */
          <div className="flex items-center gap-1.5 py-2 text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce"></span>
          </div>
        ) : (
          <div className="prose prose-neutral max-w-none text-[15px] leading-7 font-normal tracking-[-0.01em]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-4 last:mb-0 leading-7">{children}</p>,
                h1: ({ children }) => (
                  <h1 className="text-xl font-semibold text-neutral-900 mt-6 mb-3 tracking-tight">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-semibold text-neutral-900 mt-5 mb-2.5 tracking-tight">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-semibold text-neutral-900 mt-4 mb-2 tracking-tight">
                    {children}
                  </h3>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 mb-4 space-y-1.5">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 mb-4 space-y-1.5">{children}</ol>
                ),
                li: ({ children }) => <li className="pl-0.5">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-neutral-300 pl-4 my-3 text-neutral-600 italic">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="my-4 overflow-x-auto rounded-xl border border-neutral-200">
                    <table className="min-w-full divide-y divide-neutral-200 text-sm">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="bg-neutral-50 px-4 py-2 text-left font-semibold text-neutral-700">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-2 border-t border-neutral-100 text-neutral-800">
                    {children}
                  </td>
                ),
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match && !String(children).includes('\n');
                  if (isInline) {
                    return (
                      <code
                        className="bg-neutral-100 text-neutral-800 font-mono text-[13px] px-1.5 py-0.5 rounded-md font-medium"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <CodeBlock
                      language={match ? match[1] : ''}
                      value={String(children).replace(/\n$/, '')}
                    />
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Action icons below assistant message */}
        {!message.isStreaming && message.content && !message.error && (
          <div className="flex items-center justify-between flex-wrap gap-2 mt-3 pt-1 text-neutral-400 opacity-80 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-1">
              <button
                id={`copy-msg-btn-${message.id}`}
                onClick={handleCopy}
                className="p-1.5 rounded-lg hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer"
                title="Mesajı Kopyala"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              {isLast && onRegenerate && (
                <button
                  id={`regenerate-btn-${message.id}`}
                  onClick={onRegenerate}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer"
                  title="Yeniden Oluştur"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              <button
                id={`like-btn-${message.id}`}
                onClick={() => setLiked(liked === true ? null : true)}
                className={`p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer ${
                  liked === true ? 'text-emerald-600 bg-emerald-50' : 'hover:text-neutral-700'
                }`}
                title="İyi yanıt"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>

              <button
                id={`dislike-btn-${message.id}`}
                onClick={() => setLiked(liked === false ? null : false)}
                className={`p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer ${
                  liked === false ? 'text-red-500 bg-red-50' : 'hover:text-neutral-700'
                }`}
                title="Kötü yanıt"
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>

            {/* Debug & SQL Inspection Button */}
            <div className="flex items-center gap-1.5">
              <button
                id={`debug-toggle-btn-${message.id}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer shadow-2xs border ${
                  isDropdownOpen
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-neutral-100/90 hover:bg-neutral-200/90 text-neutral-800 border-neutral-200/80 hover:border-neutral-300'
                }`}
                title="AI Bağlamını ve Çalıştırılan SQL Sorgularını Göster/Gizle"
              >
                <Terminal className={`w-3.5 h-3.5 ${isDropdownOpen ? 'text-white' : 'text-neutral-600'}`} />
                <span>AI Bağlamı & SQL</span>
                {sqlCount > 0 ? (
                  <span
                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold ${
                      isDropdownOpen
                        ? 'bg-emerald-500 text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    <Database className="w-2.5 h-2.5" />
                    {sqlCount} SQL
                  </span>
                ) : (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                      isDropdownOpen
                        ? 'bg-neutral-700 text-neutral-200'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    SQL Yok
                  </span>
                )}
                {isDropdownOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-70" />
                )}
              </button>

              {onOpenDebug && (
                <button
                  id={`debug-modal-btn-${message.id}`}
                  onClick={() => onOpenDebug(debugInfo)}
                  className="p-1.5 rounded-lg bg-neutral-100/80 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 border border-neutral-200/70 transition-colors cursor-pointer"
                  title="Tam Ekran Modal Olarak Aç"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* INLINE EXPANDABLE DEBUG & SQL DROPDOWN PANEL */}
        {isDropdownOpen && !message.isStreaming && (
          <div
            id={`debug-dropdown-${message.id}`}
            className="mt-3.5 rounded-2xl border border-neutral-200 bg-neutral-50/90 shadow-sm overflow-hidden text-neutral-900 animate-in fade-in slide-in-from-top-1 duration-200"
          >
            {/* Dropdown Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-100/80 border-b border-neutral-200 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-semibold text-neutral-800">
                  Geliştirici İnceleme Paneli
                </span>
                <span className="text-[11px] font-mono text-neutral-500">
                  Model: <span className="font-semibold text-neutral-700">{debugInfo.model}</span>
                </span>
                {debugInfo.totalDurationMs ? (
                  <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
                    • Süre: <span className="text-neutral-700">{debugInfo.totalDurationMs} ms</span>
                  </span>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                {onOpenDebug && (
                  <button
                    onClick={() => onOpenDebug(debugInfo)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 rounded-lg border border-neutral-200 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3 h-3 text-neutral-500" />
                    <span>Modalda Büyüt</span>
                  </button>
                )}
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-200/60 cursor-pointer"
                  title="Paneli Kapat"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sub-tab Navigation */}
            <div className="flex items-center gap-1 px-4 pt-2 border-b border-neutral-200/80 bg-white text-xs font-medium">
              <button
                onClick={() => setDropdownTab('sql')}
                className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 font-medium transition-colors cursor-pointer ${
                  dropdownTab === 'sql'
                    ? 'border-neutral-900 text-neutral-900 font-semibold'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>SQL Sorguları</span>
                <span
                  className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    sqlCount > 0 ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  {sqlCount}
                </span>
              </button>

              <button
                onClick={() => setDropdownTab('context')}
                className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 font-medium transition-colors cursor-pointer ${
                  dropdownTab === 'context'
                    ? 'border-neutral-900 text-neutral-900 font-semibold'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>AI Bağlamı (Prompt & Mesajlar)</span>
              </button>

              <button
                onClick={() => setDropdownTab('json')}
                className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 font-medium transition-colors cursor-pointer ${
                  dropdownTab === 'json'
                    ? 'border-neutral-900 text-neutral-900 font-semibold'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Ham JSON</span>
              </button>
            </div>

            {/* Sub-tab Contents */}
            <div className="p-4 max-h-96 overflow-y-auto space-y-3 bg-white/70">
              {/* TAB 1: SQL LOGS */}
              {dropdownTab === 'sql' && (
                <div className="space-y-3">
                  {sqlCount === 0 ? (
                    <div className="p-5 text-center bg-neutral-50/80 rounded-xl border border-neutral-200">
                      <Database className="w-6 h-6 mx-auto mb-2 text-neutral-400" />
                      <p className="text-xs font-semibold text-neutral-700">
                        Bu mesajda veritabanı (SQL) sorgusu çalıştırılmadı.
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-1 max-w-sm mx-auto">
                        Doğrudan yapay zeka bağlamı ve sohbet geçmişi üzerinden yanıt üretildi.
                      </p>
                    </div>
                  ) : (
                    debugInfo.sqlLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-neutral-50/90 rounded-xl border border-neutral-200/90 space-y-2.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 font-mono text-[10px] font-bold bg-neutral-900 text-white rounded-md">
                              #{idx + 1}
                            </span>
                            {log.toolName && (
                              <span className="font-mono text-[11px] font-semibold text-neutral-800 bg-white px-2 py-0.5 rounded-md border border-neutral-200">
                                Araç: {log.toolName}
                              </span>
                            )}
                            {log.error ? (
                              <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200 text-[10px] font-medium">
                                <AlertCircle className="w-3 h-3" /> Hata
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[10px] font-medium">
                                <CheckCircle2 className="w-3 h-3" /> Başarılı
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2.5 text-neutral-500 font-mono text-[11px]">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {log.durationMs} ms
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {log.rowCount} satır
                            </span>
                          </div>
                        </div>

                        {/* Tool arguments if any */}
                        {log.toolArgs && Object.keys(log.toolArgs).length > 0 && (
                          <div className="bg-white p-2 rounded-lg border border-neutral-200/80 text-[11px]">
                            <span className="font-medium text-neutral-500 block mb-0.5">
                              Modelin Gönderdiği Parametreler:
                            </span>
                            <code className="font-mono text-neutral-800 whitespace-pre-wrap">
                              {JSON.stringify(log.toolArgs)}
                            </code>
                          </div>
                        )}

                        {/* SQL code */}
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-700 mb-1">
                            <span>Çalıştırılan SQL Sorgusu:</span>
                            <button
                              onClick={() => handleCopySql(log.sql, idx)}
                              className="text-neutral-500 hover:text-neutral-900 font-medium inline-flex items-center gap-1 cursor-pointer"
                            >
                              {copiedSqlIndex === idx ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-700 font-semibold">Kopyalandı</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Kopyala</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="bg-neutral-900 text-neutral-100 p-2.5 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800">
                            {log.sql}
                          </div>
                        </div>

                        {/* SQL bind params */}
                        {log.params && log.params.length > 0 && (
                          <div className="bg-white p-2 rounded-lg border border-neutral-200 text-[11px]">
                            <span className="font-medium text-neutral-500 block mb-0.5">
                              Sorgu Parametreleri (Bind Parameters):
                            </span>
                            <code className="font-mono text-neutral-800">
                              {JSON.stringify(log.params)}
                            </code>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 2: AI CONTEXT */}
              {dropdownTab === 'context' && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-neutral-600" />
                      <span>AI&apos;ye Gönderilen Tam Bağlam (Girdi Bilgileri):</span>
                    </span>
                    <button
                      onClick={handleCopyContext}
                      className="text-xs text-neutral-600 hover:text-neutral-900 font-medium inline-flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-neutral-200 shadow-2xs transition-colors"
                    >
                      {copiedContext ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Kopyalandı</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-neutral-500" />
                          <span>Tüm Bağlamı Kopyala</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* 1. System Instruction */}
                  <div className="bg-neutral-50/90 p-3 rounded-xl border border-neutral-200/90 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800">
                        <Cpu className="w-3.5 h-3.5 text-neutral-600" />
                        <span>1. Sistem Talimatı (System Instruction)</span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {debugInfo.systemInstruction?.length || 0} karakter
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-neutral-200 text-[11px] font-mono text-neutral-800 max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                      {debugInfo.systemInstruction || 'Eyurtlar Danışmanı Sistem Promptu'}
                    </div>
                  </div>

                  {/* 2. Backend DB Data & Tool Outputs provided to AI */}
                  {(() => {
                    const contentsToInspect = debugInfo.fullContents || debugInfo.formattedContents || [];
                    const toolResponseTurns = contentsToInspect.filter((turn: any) =>
                      turn.parts?.some((p: any) => p.functionResponse || p.functionCall)
                    );

                    if (toolResponseTurns.length === 0 && (!debugInfo.sqlLogs || debugInfo.sqlLogs.length === 0)) {
                      return null;
                    }

                    return (
                      <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/90 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-950">
                            <Database className="w-3.5 h-3.5 text-emerald-700" />
                            <span>2. Backend&apos;in Veritabanından Getirip Modele İlettiği Bilgiler</span>
                          </div>
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                            {toolResponseTurns.length > 0 ? `${toolResponseTurns.length} Araç Çıktısı` : `${debugInfo.sqlLogs.length} SQL Sonucu`}
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-800 leading-normal">
                          Aşağıdaki veriler, modelin soruyu yanıtlamak için çağırdığı veritabanı fonksiyonlarından elde edilen ve modele girdi olarak beslenen gerçek kayıtlardır:
                        </p>

                        <div className="space-y-2">
                          {toolResponseTurns.map((turn: any, tIdx: number) => {
                            const functionCalls = turn.parts?.filter((p: any) => p.functionCall);
                            const functionResponses = turn.parts?.filter((p: any) => p.functionResponse);

                            return (
                              <div key={tIdx} className="space-y-1.5">
                                {functionCalls?.map((fc: any, fcIdx: number) => (
                                  <div key={fcIdx} className="bg-white p-2.5 rounded-lg border border-emerald-200 text-xs">
                                    <span className="font-semibold text-neutral-800 block text-[11px] mb-1">
                                      🤖 Modelin Çağırdığı Araç: <code className="font-mono text-emerald-800 font-bold">{fc.functionCall?.name}</code>
                                    </span>
                                    <pre className="font-mono text-[10px] text-neutral-700 bg-neutral-50 p-2 rounded border border-neutral-200 overflow-x-auto">
                                      {JSON.stringify(fc.functionCall?.args, null, 2)}
                                    </pre>
                                  </div>
                                ))}

                                {functionResponses?.map((fr: any, frIdx: number) => (
                                  <div key={frIdx} className="bg-white p-2.5 rounded-lg border border-emerald-300 text-xs shadow-2xs">
                                    <span className="font-semibold text-emerald-900 block text-[11px] mb-1">
                                      ⚡ Backend DB Yanıt Paketi (<code className="font-mono">{fr.functionResponse?.name}</code>):
                                    </span>
                                    <pre className="font-mono text-[10px] text-neutral-800 bg-neutral-900 text-neutral-100 p-2.5 rounded-md border border-neutral-800 max-h-48 overflow-y-auto leading-relaxed">
                                      {JSON.stringify(fr.functionResponse?.response, null, 2)}
                                    </pre>
                                  </div>
                                ))}
                              </div>
                            );
                          })}

                          {/* Fallback if toolResponseTurns is empty but sqlLogs exist */}
                          {toolResponseTurns.length === 0 && debugInfo.sqlLogs.length > 0 && (
                            <div className="bg-white p-2.5 rounded-lg border border-emerald-200 text-xs space-y-1.5">
                              <span className="font-semibold text-emerald-900 block text-[11px]">
                                Çalıştırılan DB Sorguları ve Dönen Kayıtlar:
                              </span>
                              {debugInfo.sqlLogs.map((log, lIdx) => (
                                <div key={lIdx} className="text-[11px] font-mono text-neutral-800 bg-neutral-50 p-2 rounded border border-neutral-200">
                                  <div><strong>Araç:</strong> {log.toolName} ({log.rowCount} satır)</div>
                                  <div><strong>Sorgu:</strong> {log.sql}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* 3. Conversation History sent to AI */}
                  <div className="bg-neutral-50/90 p-3 rounded-xl border border-neutral-200/90 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800">
                        <FileText className="w-3.5 h-3.5 text-neutral-600" />
                        <span>3. Modele Gönderilen Sohbet Geçmişi & Mesajlar</span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {(debugInfo.formattedContents || []).length} Tur
                      </span>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {(debugInfo.formattedContents || []).map((msg: any, mIdx: number) => {
                        const isUserRole = msg.role === 'user';
                        const textParts = msg.parts
                          ?.map((p: any) => p.text)
                          .filter(Boolean)
                          .join('\n\n');

                        return (
                          <div
                            key={mIdx}
                            className={`p-2.5 rounded-lg border text-xs ${
                              isUserRole
                                ? 'bg-blue-50/60 border-blue-200/80 text-blue-950'
                                : 'bg-white border-neutral-200 text-neutral-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-[11px] flex items-center gap-1">
                                {isUserRole ? '👤 Kullanıcı Girdisi' : '🤖 Önceki Model Yanıtı'}
                              </span>
                              <span className="text-[10px] font-mono opacity-60">
                                #{mIdx + 1}
                              </span>
                            </div>
                            <div className="text-[11px] whitespace-pre-wrap font-sans leading-relaxed">
                              {textParts || (
                                <span className="font-mono text-[10px] text-neutral-500">
                                  {JSON.stringify(msg.parts)}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Tools Provided */}
                  {debugInfo.toolsProvided && debugInfo.toolsProvided.length > 0 && (
                    <div className="bg-neutral-50/90 p-3 rounded-xl border border-neutral-200/90 space-y-1.5">
                      <span className="text-xs font-semibold text-neutral-800 block">
                        4. Modele Tanımlı Veritabanı Fonksiyonları ({debugInfo.toolsProvided.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {debugInfo.toolsProvided.map((tool, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 bg-white border border-neutral-200 text-neutral-800 rounded-md font-mono text-[11px] font-medium"
                          >
                            ⚡ {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. Full Context JSON (Raw Request Payload) */}
                  <div className="bg-neutral-50/90 p-3 rounded-xl border border-neutral-200/90 space-y-1.5">
                    <span className="text-xs font-semibold text-neutral-800 block">
                      5. Modele Giden Ham İstek Dizisi (Full Payload Array)
                    </span>
                    <div className="bg-neutral-900 text-neutral-100 p-2.5 rounded-lg font-mono text-[10px] max-h-40 overflow-y-auto leading-relaxed border border-neutral-800">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(debugInfo.fullContents || debugInfo.formattedContents || [], null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: RAW JSON */}
              {dropdownTab === 'json' && (
                <div className="bg-neutral-900 text-neutral-100 p-3 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
