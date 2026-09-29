import type { MergeStats, Post, Product, User } from './types';

export const POSTS_API_URL = 'https://jsonplaceholder.typicode.com/posts';

/** Наступний ID = максимальний існуючий + 1 */
export function nextId(items: { id: number }[]): number {
  return items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
}

/** Валідація нового користувача. Повертає текст помилки або null */
export function validateUser(users: User[], name: string, email: string): string | null {
  if (!name || !email) return "Необхідно вказати ім'я та email";
  if (!email.includes('@')) return 'Некоректний формат email';
  if (users.some((u) => u.email === email)) return 'Користувач з таким email вже існує';
  return null;
}

/** Злиття двох масивів товарів через Map (дублікати за id видаляються), сортування за ціною */
export function mergeProducts(products1: Product[], products2: Product[]): Product[] {
  const productMap = new Map<number, Product>();
  products1.forEach((p) => productMap.set(p.id, p));
  products2.forEach((p) => {
    if (!productMap.has(p.id)) productMap.set(p.id, p);
  });
  return Array.from(productMap.values()).sort((a, b) => a.price - b.price);
}

export function productStats(merged: Product[], sourceCount: number): MergeStats {
  const totalPrice = merged.reduce((sum, p) => sum + p.price, 0);
  return {
    total: merged.length,
    duplicatesRemoved: sourceCount - merged.length,
    totalPrice,
    avgPrice: merged.length ? parseFloat((totalPrice / merged.length).toFixed(2)) : 0,
    minPrice: merged.length ? merged[0].price : 0,
    maxPrice: merged.length ? merged[merged.length - 1].price : 0,
  };
}

/** Завантаження всіх постів з JSONPlaceholder */
export async function fetchAllPosts(): Promise<Post[]> {
  const response = await fetch(POSTS_API_URL, { cache: 'no-store' });
  if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
  return (await response.json()) as Post[];
}

export function filterByUser(posts: Post[], userId: number): Post[] {
  return posts.filter((p) => p.userId === userId);
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
