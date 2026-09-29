import { promises as fs } from 'fs';
import path from 'path';
import type { ProductFile } from './types';

export const DATA_DIR = path.join(process.cwd(), 'data');

export const FILES = {
  users: path.join(DATA_DIR, 'users.json'),
  products1: path.join(DATA_DIR, 'products1.json'),
  products2: path.join(DATA_DIR, 'products2.json'),
  combined: path.join(DATA_DIR, 'products_combined.json'),
  posts: path.join(DATA_DIR, 'user_posts.json'),
} as const;

export const PRODUCT_FILES: Record<ProductFile, string> = {
  products1: FILES.products1,
  products2: FILES.products2,
  combined: FILES.combined,
};

/** Десеріалізація: читання та парсинг JSON-файлу */
export async function readJSON<T>(filePath: string): Promise<T> {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data) as T;
}

/** Серіалізація: запис даних у JSON-файл з відступами */
export async function writeJSON<T>(filePath: string, data: T): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
