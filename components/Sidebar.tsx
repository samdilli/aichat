'use client';

import React, { useState } from 'react';
import {
  SquarePen,
  MessageSquare,
  Trash2,
  Pencil,
  Check,
  X,
  Search,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { ChatSession } from '@/lib/types';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onToggle: () => void;
  onOpenShortcuts: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  onClearAll,
  isOpen,
  onToggle,
  onOpenShortcuts,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group sessions by date
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 86400000;
  const last7Days = today - 7 * 86400000;

  const todaySessions = filteredSessions.filter((s) => s.updatedAt >= today);
  const yesterdaySessions = filteredSessions.filter(
    (s) => s.updatedAt < today && s.updatedAt >= yesterday
  );
  const last7DaysSessions = filteredSessions.filter(
    (s) => s.updatedAt < yesterday && s.updatedAt >= last7Days
  );
  const olderSessions = filteredSessions.filter((s) => s.updatedAt < last7Days);

  const startRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditingTitle(session.title);
  };

  const saveRename = (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editingTitle.trim()) {
      onRenameSession(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const renderSessionGroup = (title: string, group: ChatSession[]) => {
    if (group.length === 0) return null;
    return (
      <div className="mb-4">
        <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
          {title}
        </div>
        <div className="space-y-0.5 mt-0.5">
          {group.map((session) => {
            const isActive = session.id === activeSessionId;
            const isEditing = editingId === session.id;

            return (
              <div
                key={session.id}
                id={`session-item-${session.id}`}
                onClick={() => onSelectSession(session.id)}
                className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-200/70 text-neutral-900 font-medium'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MessageSquare className="w-4 h-4 shrink-0 text-neutral-400 group-hover:text-neutral-700" />
                  {isEditing ? (
                    <form
                      onSubmit={(e) => saveRename(session.id, e)}
                      className="flex items-center gap-1 flex-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        autoFocus
                        className="w-full bg-white border border-neutral-300 rounded px-1.5 py-0.5 text-xs text-neutral-900 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="p-1 hover:text-emerald-600 text-neutral-500 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="p-1 hover:text-red-500 text-neutral-500 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  ) : (
                    <span className="truncate text-[13.5px] leading-snug">
                      {session.title}
                    </span>
                  )}
                </div>

                {!isEditing && (
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                    <button
                      id={`rename-session-btn-${session.id}`}
                      onClick={(e) => startRename(session, e)}
                      className="p-1 rounded-md hover:bg-neutral-200 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                      title="Yeniden Adlandır"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`delete-session-btn-${session.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="p-1 rounded-md hover:bg-neutral-200 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Sohbeti Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onToggle}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col h-full bg-[#fbfbfb] border-r border-neutral-200/80 transition-all duration-300 ease-in-out ${
          isOpen
            ? 'w-[270px] translate-x-0'
            : '-translate-x-full md:translate-x-0 md:w-0 md:border-none md:overflow-hidden'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-3 pb-2 flex items-center justify-between border-b border-neutral-100">
          <div className="flex items-center gap-2 px-1">
            <div className="p-1.5 rounded-lg bg-neutral-900 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-semibold text-[15px] text-neutral-900 tracking-tight">
              AI Asistan
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              id="sidebar-toggle-btn"
              onClick={onToggle}
              className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-200/70 hover:text-neutral-800 transition-colors cursor-pointer"
              title="Kenar çubuğunu kapat"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* New Chat Action Button */}
        <div className="p-3 pb-2">
          <button
            id="new-chat-btn"
            onClick={onNewChat}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-neutral-900 text-sm font-medium transition-all shadow-2xs cursor-pointer group"
          >
            <span className="flex items-center gap-2">
              <SquarePen className="w-4 h-4 text-neutral-600 group-hover:text-neutral-900" />
              Yeni Sohbet
            </span>
            <span className="text-[11px] font-mono text-neutral-400 border border-neutral-200 rounded px-1.5 py-0.5 bg-neutral-50">
              ⌘K
            </span>
          </button>
        </div>

        {/* Search Chats Input */}
        {sessions.length > 2 && (
          <div className="px-3 pb-2">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-3 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Sohbetlerde ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-neutral-100/70 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-lg text-neutral-800 placeholder:text-neutral-400 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto px-2 py-1 scrollbar-thin">
          {sessions.length === 0 ? (
            <div className="p-4 text-center text-xs text-neutral-400">
              Henüz sohbet geçmişi yok.
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-4 text-center text-xs text-neutral-400">
              Aramaya uygun sohbet bulunamadı.
            </div>
          ) : (
            <>
              {renderSessionGroup('Bugün', todaySessions)}
              {renderSessionGroup('Dün', yesterdaySessions)}
              {renderSessionGroup('Son 7 Gün', last7DaysSessions)}
              {renderSessionGroup('Daha Eski', olderSessions)}
            </>
          )}
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="p-2 border-t border-neutral-200/80 bg-neutral-50/50 space-y-1">
          {/* Active Model Indicator */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-neutral-600 bg-white border border-neutral-200/60 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-neutral-800">Gemini 3.5 Flash Lite</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">Aktif</span>
          </div>

          <div className="flex items-center justify-between pt-1 px-1">
            <button
              id="shortcuts-btn"
              onClick={onOpenShortcuts}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-neutral-500 hover:bg-neutral-200/60 hover:text-neutral-800 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Kısayollar</span>
            </button>

            {sessions.length > 0 && (
              <button
                id="clear-all-sessions-btn"
                onClick={onClearAll}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                title="Tüm sohbetleri temizle"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Temizle</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
