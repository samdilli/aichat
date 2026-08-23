'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  PanelLeft,
  SquarePen,
  Share2,
  Check,
  ChevronDown,
  Download,
} from 'lucide-react';
import { Message, ChatSession, Attachment, ModelId } from '@/lib/types';
import { Sidebar } from '@/components/Sidebar';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { ShortcutsModal } from '@/components/ShortcutsModal';
import { DebugModal } from '@/components/DebugModal';
import { ModelSelector, AVAILABLE_MODELS } from '@/components/ModelSelector';
import { streamWithPunctuationRhythm } from '@/lib/stream';

const STORAGE_KEY = 'ai_asistan_sessions_v2';

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Failed to load sessions:', e);
      }
    }
    return [];
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed[0].id;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [selectedModel, setSelectedModel] = useState<ModelId>('gemini-3.1-flash-lite');
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const [enableThinking, setEnableThinking] = useState(false);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeDebugInfo, setActiveDebugInfo] = useState<any>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Save sessions to localStorage on changes
  useEffect(() => {
    if (sessions.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      } catch (e) {
        console.error('Failed to save sessions:', e);
      }
    }
  }, [sessions]);

  // Current active session
  const currentSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) || null,
    [sessions, activeSessionId]
  );
  const messages = useMemo(() => currentSession?.messages || [], [currentSession]);

  // Scroll to bottom helper
  const scrollToBottom = useCallback((smooth = true) => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom(false);
  }, [activeSessionId, scrollToBottom]);

  useEffect(() => {
    if (isLoading) {
      scrollToBottom(true);
    }
  }, [messages.length, isLoading, scrollToBottom]);

  // Create new session
  const handleNewChat = useCallback(() => {
    if (isLoading && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
    setActiveSessionId(null);
    setInput('');
  }, [isLoading]);

  // Keyboard shortcut: Cmd/Ctrl + K for new chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNewChat]);

  // Select existing session
  const handleSelectSession = (id: string) => {
    if (isLoading && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
    setActiveSessionId(id);
    setInput('');
  };

  // Delete session
  const handleDeleteSession = (id: string) => {
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      if (activeSessionId === id) {
        setActiveSessionId(updated.length > 0 ? updated[0].id : null);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Rename session
  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle, updatedAt: Date.now() } : s))
    );
  };

  // Clear all sessions
  const handleClearAll = () => {
    if (window.confirm('Tüm sohbet geçmişinizi silmek istediğinize emin misiniz?')) {
      setSessions([]);
      setActiveSessionId(null);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Stop streaming generation
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);

    if (activeSessionId) {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId) {
            const updatedMessages = s.messages.map((m) =>
              m.isStreaming ? { ...m, isStreaming: false } : m
            );
            return { ...s, messages: updatedMessages, updatedAt: Date.now() };
          }
          return s;
        })
      );
    }
  };

  // Send message
  const handleSend = async (customPrompt?: string, attachmentsToSend?: Attachment[]) => {
    const textToSend = customPrompt !== undefined ? customPrompt : input.trim();
    if ((!textToSend && (!attachmentsToSend || attachmentsToSend.length === 0)) || isLoading) return;

    setInput('');

    let sessionId = activeSessionId;
    let currentSessionMessages: Message[] = [];

    const userMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      role: 'user',
      content: textToSend,
      createdAt: Date.now(),
      attachments: attachmentsToSend,
    };

    const assistantMessageId = `msg-asst-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
      isStreaming: true,
      webSearchUsed: webSearch,
    };

    if (!sessionId) {
      // Create new session
      const newSessionTitle =
        textToSend.length > 36 ? textToSend.slice(0, 36).trim() + '...' : textToSend || 'Ekli Dosya Sohbeti';
      const newSessionId = `session-${Date.now()}`;
      sessionId = newSessionId;
      currentSessionMessages = [userMessage];

      const newSession: ChatSession = {
        id: newSessionId,
        title: newSessionTitle,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [userMessage, initialAssistantMessage],
        model: selectedModel,
      };

      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSessionId);
    } else {
      // Append to existing session
      const existing = sessions.find((s) => s.id === sessionId);
      currentSessionMessages = existing ? [...existing.messages, userMessage] : [userMessage];

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === sessionId) {
            return {
              ...s,
              updatedAt: Date.now(),
              messages: [...s.messages, userMessage, initialAssistantMessage],
            };
          }
          return s;
        })
      );
    }

    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentSessionMessages.map((m) => ({
            role: m.role,
            content: m.content,
            attachments: m.attachments,
          })),
          model: selectedModel,
          webSearch,
          enableThinking,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Sunucu hatası (${response.status})`);
      }

      if (!response.body) {
        throw new Error('Yanıt akışı bulunamadı.');
      }

      const reader = response.body.getReader();
      const { text: finalAccumulated, debugInfo } = await streamWithPunctuationRhythm(
        reader,
        abortControllerRef.current.signal,
        (currentText) => {
          setSessions((prev) =>
            prev.map((s) => {
              if (s.id === sessionId) {
                const updatedMessages = s.messages.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, content: currentText, isStreaming: true }
                    : m
                );
                return { ...s, messages: updatedMessages, updatedAt: Date.now() };
              }
              return s;
            })
          );
        }
      );

      // Mark streaming completed
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === sessionId) {
            const updatedMessages = s.messages.map((m) =>
              m.id === assistantMessageId
                ? { ...m, content: finalAccumulated, debugInfo, isStreaming: false }
                : m
            );
            return { ...s, messages: updatedMessages, updatedAt: Date.now() };
          }
          return s;
        })
      );
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      console.error('Chat error:', err);
      const errMsg =
        err instanceof Error
          ? err.message
          : 'Bir bağlantı hatası oluştu. Lütfen tekrar deneyin.';

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === sessionId) {
            const updatedMessages = s.messages.map((m) =>
              m.id === assistantMessageId
                ? {
                    ...m,
                    content: `Hata: ${errMsg}`,
                    isStreaming: false,
                    error: true,
                  }
                : m
            );
            return { ...s, messages: updatedMessages, updatedAt: Date.now() };
          }
          return s;
        })
      );
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Edit user message and refork response
  const handleEditUserMessage = (messageId: string, newContent: string) => {
    if (!activeSessionId || isLoading) return;

    const targetIndex = messages.findIndex((m) => m.id === messageId);
    if (targetIndex === -1) return;

    const editedUserMessage = { ...messages[targetIndex], content: newContent };
    const sliced = messages.slice(0, targetIndex);
    const updatedMessages = [...sliced, editedUserMessage];

    const assistantMessageId = `msg-asst-${Date.now()}`;
    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
      isStreaming: true,
      webSearchUsed: webSearch,
    };

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...updatedMessages, initialAssistantMessage],
            updatedAt: Date.now(),
          };
        }
        return s;
      })
    );

    // Call API with updated history
    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    (async () => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
              attachments: m.attachments,
            })),
            model: selectedModel,
            webSearch,
            enableThinking,
          }),
          signal: abortControllerRef.current?.signal,
        });

        if (!response.ok) {
          throw new Error('Yeniden oluşturma başarısız oldu.');
        }

        const reader = response.body?.getReader();
        if (!reader) return;

        const { text: finalAccumulated, debugInfo } = await streamWithPunctuationRhythm(
          reader,
          abortControllerRef.current?.signal || new AbortController().signal,
          (currentText) => {
            setSessions((prev) =>
              prev.map((s) => {
                if (s.id === activeSessionId) {
                  const msgs = s.messages.map((m) =>
                    m.id === assistantMessageId
                      ? { ...m, content: currentText, isStreaming: true }
                      : m
                  );
                  return { ...s, messages: msgs, updatedAt: Date.now() };
                }
                return s;
              })
            );
          }
        );

        setSessions((prev) =>
          prev.map((s) => {
            if (s.id === activeSessionId) {
              const msgs = s.messages.map((m) =>
                m.id === assistantMessageId
                  ? { ...m, content: finalAccumulated, debugInfo, isStreaming: false }
                  : m
              );
              return { ...s, messages: msgs, updatedAt: Date.now() };
            }
            return s;
          })
        );
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error(err);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    })();
  };

  // Regenerate last assistant response
  const handleRegenerate = async () => {
    if (!activeSessionId || isLoading || messages.length < 2) return;

    const lastUserIndex = messages.findLastIndex((m) => m.role === 'user');
    if (lastUserIndex === -1) return;

    const slicedMessages = messages.slice(0, lastUserIndex + 1);

    const assistantMessageId = `msg-asst-${Date.now()}`;
    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
      isStreaming: true,
      webSearchUsed: webSearch,
    };

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...slicedMessages, initialAssistantMessage],
            updatedAt: Date.now(),
          };
        }
        return s;
      })
    );

    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: slicedMessages.map((m) => ({
            role: m.role,
            content: m.content,
            attachments: m.attachments,
          })),
          model: selectedModel,
          webSearch,
          enableThinking,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Yeniden oluşturma başarısız oldu.');
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      const { text: finalAccumulated, debugInfo } = await streamWithPunctuationRhythm(
        reader,
        abortControllerRef.current.signal,
        (currentText) => {
          setSessions((prev) =>
            prev.map((s) => {
              if (s.id === activeSessionId) {
                const updatedMessages = s.messages.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, content: currentText, isStreaming: true }
                    : m
                );
                return { ...s, messages: updatedMessages, updatedAt: Date.now() };
              }
              return s;
            })
          );
        }
      );

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId) {
            const updatedMessages = s.messages.map((m) =>
              m.id === assistantMessageId
                ? { ...m, content: finalAccumulated, debugInfo, isStreaming: false }
                : m
            );
            return { ...s, messages: updatedMessages, updatedAt: Date.now() };
          }
          return s;
        })
      );
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error(err);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleShareChat = async () => {
    if (!currentSession || messages.length === 0) return;
    try {
      const exportText = messages
        .map((m) => `${m.role === 'user' ? 'Kullanıcı' : 'AI Asistan'}:\n${m.content}\n`)
        .join('\n---\n\n');
      await navigator.clipboard.writeText(exportText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadChat = () => {
    if (!currentSession || messages.length === 0) return;
    const exportText = `# ${currentSession.title}\n\nTarih: ${new Date(
      currentSession.createdAt
    ).toLocaleString('tr-TR')}\n\n---\n\n` +
      messages
        .map((m) => `### ${m.role === 'user' ? 'Kullanıcı' : 'AI Asistan'}\n\n${m.content}\n`)
        .join('\n---\n\n');

    const blob = new Blob([exportText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentSession.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentModelObj =
    AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-neutral-900 font-sans antialiased selection:bg-neutral-900 selection:text-white">
      {/* Sol Sidebar (Left Sidebar) */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        onClearAll={handleClearAll}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onOpenShortcuts={() => setShortcutsOpen(true)}
      />

      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-white relative">
        {/* Top Minimalist Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-xs border-b border-neutral-100/80">
          <div className="flex items-center gap-2 relative">
            {!sidebarOpen && (
              <button
                id="open-sidebar-header-btn"
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer"
                title="Kenar çubuğunu aç"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}

            {/* Model selector pill */}
            <button
              id="model-selector-pill-btn"
              onClick={() => setModelSelectorOpen(!modelSelectorOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-neutral-100/90 text-neutral-900 text-sm font-semibold transition-colors cursor-pointer border border-transparent hover:border-neutral-200/80"
            >
              <span>{currentModelObj.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
            </button>

            {/* Model selector dropdown */}
            <ModelSelector
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
              isOpen={modelSelectorOpen}
              onClose={() => setModelSelectorOpen(false)}
            />

            <a
              href="/test-dorm-card"
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-medium border border-emerald-200 transition"
              title="Yatay Kart Tasarım Test Sayfası"
            >
              <span>Kart Tasarım Testi</span>
            </a>
          </div>

          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <>
                <button
                  id="download-chat-btn"
                  onClick={handleDownloadChat}
                  className="p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer"
                  title="Markdown Olarak İndir"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  id="share-chat-header-btn"
                  onClick={handleShareChat}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer"
                  title="Sohbeti Kopyala"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Paylaş</span>
                    </>
                  )}
                </button>
              </>
            )}

            <button
              id="header-new-chat-btn"
              onClick={handleNewChat}
              className="p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer"
              title="Yeni Sohbet"
            >
              <SquarePen className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Chat Body Container */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 flex flex-col justify-between scroll-smooth">
          <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col justify-start">
            {messages.length === 0 ? (
              <WelcomeScreen onSelectPrompt={(prompt) => handleSend(prompt)} />
            ) : (
              <div className="space-y-6 pb-6 pt-2">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isLast={index === messages.length - 1}
                    onRegenerate={handleRegenerate}
                    onEditUserMessage={handleEditUserMessage}
                    onOpenDebug={(info) => setActiveDebugInfo(info)}
                  />
                ))}
                <div ref={chatBottomRef} />
              </div>
            )}
          </div>

          {/* Sticky Input Bar at Bottom of ChatBody */}
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={(attachments) => handleSend(undefined, attachments)}
            onStop={handleStop}
            isLoading={isLoading}
            webSearch={webSearch}
            setWebSearch={setWebSearch}
            enableThinking={enableThinking}
            setEnableThinking={setEnableThinking}
          />
        </div>
      </main>

      {/* Shortcuts Modal */}
      <ShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />

      {/* Debug & SQL Inspector Modal */}
      <DebugModal
        isOpen={!!activeDebugInfo}
        onClose={() => setActiveDebugInfo(null)}
        debugInfo={activeDebugInfo}
      />
    </div>
  );
}
