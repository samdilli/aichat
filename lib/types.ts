export interface Attachment {
  name: string;
  type: string; // mimeType or 'text' | 'image'
  dataUrl?: string; // base64 data url for images/files
  textContent?: string;
}

export interface SqlQueryLog {
  toolName?: string;
  toolArgs?: Record<string, any>;
  sql: string;
  params: any[];
  durationMs: number;
  rowCount: number;
  error?: string;
}

export interface DebugInfo {
  timestamp: number;
  model: string;
  systemInstruction?: string;
  formattedContents?: Array<any>;
  fullContents?: Array<any>;
  toolsProvided?: string[];
  sqlLogs: SqlQueryLog[];
  totalDurationMs?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
  isStreaming?: boolean;
  error?: boolean;
  attachments?: Attachment[];
  webSearchUsed?: boolean;
  debugInfo?: DebugInfo;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  model?: string;
}

export type ModelId = 'gemini-3.1-flash-lite' | 'gemini-3.7-flash' | 'gemini-3.1-pro-preview';

export interface ModelOption {
  id: ModelId;
  name: string;
  badge: string;
  description: string;
  speed: string;
}
