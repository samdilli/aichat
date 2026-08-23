import mysql from 'mysql2/promise';
import { AsyncLocalStorage } from 'node:async_hooks';

export interface SqlQueryLog {
  toolName?: string;
  toolArgs?: Record<string, any>;
  sql: string;
  params: any[];
  durationMs: number;
  rowCount: number;
  error?: string;
}

export const queryLogStorage = new AsyncLocalStorage<SqlQueryLog[]>();

// Global connection pool cache for Next.js hot-reloading & serverless safety
let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    const host = process.env.DB_HOST || '84.247.20.88';
    const user = process.env.DB_USER || 'eyur_eyurtlark';
    const password = process.env.DB_PASSWORD || 'Corleone86159669000*';
    const database = process.env.DB_NAME || 'eyur_eyurtlar';
    const port = Number(process.env.DB_PORT || 3306);

    pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10,
      idleTimeout: 60000,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      connectTimeout: 10000,
      charset: 'utf8mb4',
    });
  }

  return pool;
}

export async function executeQuery<T = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  const startTime = Date.now();
  try {
    const db = getDbPool();
    const [rows] = await db.query(sql, params);
    const durationMs = Date.now() - startTime;
    const resultRows = rows as T[];

    const logs = queryLogStorage.getStore();
    if (logs) {
      logs.push({
        sql: sql.trim().replace(/\s+/g, ' '),
        params: params || [],
        durationMs,
        rowCount: Array.isArray(resultRows) ? resultRows.length : 0,
      });
    }

    return resultRows;
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    const logs = queryLogStorage.getStore();
    if (logs) {
      logs.push({
        sql: sql.trim().replace(/\s+/g, ' '),
        params: params || [],
        durationMs,
        rowCount: 0,
        error: error?.message || 'Sorgu hatası',
      });
    }

    console.error('MySQL Query Error:', {
      sql,
      params,
      message: error?.message,
    });
    throw error;
  }
}
