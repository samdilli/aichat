'use client';

import React, { useState } from 'react';
import {
  X,
  Database,
  Terminal,
  Copy,
  Check,
  Code2,
  Clock,
  Layers,
  Cpu,
  FileText,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { DebugInfo } from '@/lib/types';

interface DebugModalProps {
  isOpen: boolean;
  onClose: () => void;
  debugInfo: DebugInfo | null;
}

export const DebugModal: React.FC<DebugModalProps> = ({ isOpen, onClose, debugInfo }) => {
  const [activeTab, setActiveTab] = useState<'sql' | 'context' | 'json'>('sql');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !debugInfo) return null;

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
  };

  const sqlCount = debugInfo.sqlLogs?.length || 0;

  return (
    <div
      id="debug-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="debug-modal-content"
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden text-neutral-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 bg-neutral-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-neutral-900 text-white shadow-xs">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-neutral-900 tracking-tight">
                  AI Bağlam & SQL İnceleyici
                </h3>
                <span className="px-2 py-0.5 text-[11px] font-medium bg-neutral-200 text-neutral-700 rounded-full">
                  Debug Mode
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Model: <span className="font-mono font-medium text-neutral-700">{debugInfo.model}</span>
                {debugInfo.totalDurationMs !== undefined && (
                  <span className="ml-2">
                    • Süre: <span className="font-mono font-medium text-neutral-700">{debugInfo.totalDurationMs} ms</span>
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="debug-copy-btn"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
              title="Tüm JSON verisini panoya kopyala"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-500" />
                  <span>JSON Kopyala</span>
                </>
              )}
            </button>
            <button
              id="debug-close-btn"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-neutral-200 bg-neutral-50/40 text-xs font-medium text-neutral-600">
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'sql'
                ? 'border-neutral-900 text-neutral-900 font-semibold bg-white rounded-t-lg'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>SQL Sorguları</span>
            <span
              className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-semibold ${
                sqlCount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              {sqlCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('context')}
            className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'context'
                ? 'border-neutral-900 text-neutral-900 font-semibold bg-white rounded-t-lg'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>AI Bağlamı (Prompt & Mesajlar)</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'json'
                ? 'border-neutral-900 text-neutral-900 font-semibold bg-white rounded-t-lg'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Ham Veri (Raw JSON)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm bg-neutral-50/20">
          {/* TAB 1: SQL LOGS */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              {sqlCount === 0 ? (
                <div className="p-8 text-center bg-white rounded-xl border border-dashed border-neutral-300">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-800 mb-1">
                    Bu yanıtta veritabanı sorgusu çalıştırılmadı
                  </h4>
                  <p className="text-xs text-neutral-500 max-w-md mx-auto">
                    Kullanıcı genel bir sohbet mesajı gönderdiyse veya yurt aramadan önceki zorunlu aşama olan cinsiyet/üniversite bilgilerini henüz belirtmediyse doğrudan model yanıtı üretilmiştir.
                  </p>
                </div>
              ) : (
                debugInfo.sqlLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs space-y-3"
                  >
                    {/* Log top bar */}
                    <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 font-mono text-[11px] font-bold bg-neutral-900 text-white rounded-md">
                          #{idx + 1}
                        </span>
                        {log.toolName && (
                          <span className="font-mono font-semibold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200">
                            Tool: {log.toolName}
                          </span>
                        )}
                        {log.error ? (
                          <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200 font-medium text-[11px]">
                            <AlertCircle className="w-3 h-3" /> Hata
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-medium text-[11px]">
                            <CheckCircle2 className="w-3 h-3" /> Başarılı
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-neutral-500 font-mono text-[11px]">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {log.durationMs} ms
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {log.rowCount} satır döndü
                        </span>
                      </div>
                    </div>

                    {/* Tool Arguments if any */}
                    {log.toolArgs && Object.keys(log.toolArgs).length > 0 && (
                      <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-150 text-xs">
                        <span className="font-semibold text-neutral-600 block mb-1">
                          Tool Parametreleri (Modelin Belirlediği):
                        </span>
                        <pre className="font-mono text-[11px] text-neutral-800 whitespace-pre-wrap overflow-x-auto">
                          {JSON.stringify(log.toolArgs, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Executed SQL statement */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 mb-1">
                        <span>Çalıştırılan SQL:</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(log.sql)}
                          className="text-[11px] text-neutral-500 hover:text-neutral-800 hover:underline cursor-pointer"
                        >
                          SQL Kopyala
                        </button>
                      </div>
                      <div className="bg-neutral-900 text-neutral-100 p-3 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800">
                        {log.sql}
                      </div>
                    </div>

                    {/* SQL Bind Parameters */}
                    {log.params && log.params.length > 0 && (
                      <div>
                        <span className="text-xs font-semibold text-neutral-700 block mb-1">
                          Parametre Değerleri (Bind Parameters):
                        </span>
                        <div className="bg-neutral-100 p-2 rounded-lg font-mono text-xs text-neutral-800 overflow-x-auto">
                          {JSON.stringify(log.params)}
                        </div>
                      </div>
                    )}

                    {/* Error message if any */}
                    {log.error && (
                      <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                        <strong>Hata Mesajı:</strong> {log.error}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: AI PROMPT & CONTEXT */}
          {activeTab === 'context' && (
            <div className="space-y-4">
              {/* 1. System Instruction */}
              <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-neutral-700" />
                    <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                      1. Sistem Talimatı (System Instruction)
                    </h4>
                  </div>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(debugInfo.systemInstruction || '')
                    }
                    className="text-xs text-neutral-500 hover:text-neutral-900 hover:underline cursor-pointer"
                  >
                    Kopyala
                  </button>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg font-mono text-xs text-neutral-800 max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-neutral-150">
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
                  <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200/90 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-emerald-700" />
                        <h4 className="text-xs font-semibold text-emerald-950 uppercase tracking-wider">
                          2. Backend&apos;in Veritabanından Getirip Modele İlettiği Bilgiler
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                        {toolResponseTurns.length > 0 ? `${toolResponseTurns.length} Araç Çıktısı` : `${debugInfo.sqlLogs.length} SQL Sonucu`}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 leading-normal">
                      Aşağıdaki veriler, modelin soruyu yanıtlamak için çağırdığı veritabanı fonksiyonlarından elde edilen ve modele girdi olarak beslenen gerçek kayıtlardır:
                    </p>

                    <div className="space-y-2.5">
                      {toolResponseTurns.map((turn: any, tIdx: number) => {
                        const functionCalls = turn.parts?.filter((p: any) => p.functionCall);
                        const functionResponses = turn.parts?.filter((p: any) => p.functionResponse);

                        return (
                          <div key={tIdx} className="space-y-2">
                            {functionCalls?.map((fc: any, fcIdx: number) => (
                              <div key={fcIdx} className="bg-white p-3 rounded-lg border border-emerald-200 text-xs">
                                <span className="font-semibold text-neutral-800 block text-xs mb-1">
                                  🤖 Modelin Çağırdığı Araç: <code className="font-mono text-emerald-800 font-bold">{fc.functionCall?.name}</code>
                                </span>
                                <pre className="font-mono text-[11px] text-neutral-700 bg-neutral-50 p-2.5 rounded border border-neutral-200 overflow-x-auto">
                                  {JSON.stringify(fc.functionCall?.args, null, 2)}
                                </pre>
                              </div>
                            ))}

                            {functionResponses?.map((fr: any, frIdx: number) => (
                              <div key={frIdx} className="bg-white p-3 rounded-lg border border-emerald-300 text-xs shadow-2xs">
                                <span className="font-semibold text-emerald-900 block text-xs mb-1">
                                  ⚡ Backend DB Yanıt Paketi (<code className="font-mono">{fr.functionResponse?.name}</code>):
                                </span>
                                <pre className="font-mono text-[11px] text-neutral-100 bg-neutral-900 p-3 rounded-md border border-neutral-800 max-h-60 overflow-y-auto leading-relaxed">
                                  {JSON.stringify(fr.functionResponse?.response, null, 2)}
                                </pre>
                              </div>
                            ))}
                          </div>
                        );
                      })}

                      {/* Fallback if toolResponseTurns is empty but sqlLogs exist */}
                      {toolResponseTurns.length === 0 && debugInfo.sqlLogs.length > 0 && (
                        <div className="bg-white p-3 rounded-lg border border-emerald-200 text-xs space-y-2">
                          <span className="font-semibold text-emerald-900 block text-xs">
                            Çalıştırılan DB Sorguları ve Dönen Kayıtlar:
                          </span>
                          {debugInfo.sqlLogs.map((log, lIdx) => (
                            <div key={lIdx} className="text-xs font-mono text-neutral-800 bg-neutral-50 p-2.5 rounded border border-neutral-200">
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

              {/* 3. Formatted Messages Context */}
              <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-neutral-700" />
                    <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                      3. Modele İletilen Mesaj Geçmişi ({(debugInfo.formattedContents || []).length} Tur)
                    </h4>
                  </div>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        JSON.stringify(debugInfo.formattedContents || [], null, 2)
                      )
                    }
                    className="text-xs text-neutral-500 hover:text-neutral-900 hover:underline cursor-pointer"
                  >
                    Kopyala
                  </button>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {(debugInfo.formattedContents || []).map((msg: any, mIdx: number) => {
                    const isUserRole = msg.role === 'user';
                    const textParts = msg.parts
                      ?.map((p: any) => p.text)
                      .filter(Boolean)
                      .join('\n\n');

                    return (
                      <div
                        key={mIdx}
                        className={`p-3 rounded-lg border text-xs ${
                          isUserRole
                            ? 'bg-blue-50/60 border-blue-200 text-blue-950'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-xs flex items-center gap-1">
                            {isUserRole ? '👤 Kullanıcı Girdisi' : '🤖 Önceki Model Yanıtı'}
                          </span>
                          <span className="text-[10px] font-mono opacity-60">
                            #{mIdx + 1}
                          </span>
                        </div>
                        <div className="text-xs whitespace-pre-wrap font-sans leading-relaxed">
                          {textParts || (
                            <span className="font-mono text-[11px] text-neutral-500">
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
                <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs space-y-2">
                  <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                    4. Modele Tanımlanan Veritabanı Araçları ({debugInfo.toolsProvided.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {debugInfo.toolsProvided.map((toolName, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 bg-neutral-100 border border-neutral-200 text-neutral-800 rounded-md font-mono text-xs font-medium"
                      >
                        ⚡ {toolName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Full Raw Payload */}
              <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs space-y-2">
                <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                  5. Modele Giden Ham İstek Dizisi (Full Payload Array)
                </h4>
                <div className="bg-neutral-900 text-neutral-100 p-3.5 rounded-lg font-mono text-xs max-h-60 overflow-y-auto leading-relaxed border border-neutral-800">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(debugInfo.fullContents || debugInfo.formattedContents || [], null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RAW JSON */}
          {activeTab === 'json' && (
            <div className="bg-neutral-900 text-neutral-100 p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800 shadow-inner">
              <pre className="whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-200 bg-neutral-50/80 flex items-center justify-between text-xs text-neutral-500">
          <span>
            Bu panel geliştirme ve doğrulama amacıyla sorgu şeffaflığı sağlar.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 font-medium transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
