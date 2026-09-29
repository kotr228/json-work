import type { ApiResponse } from './types';

/** Запит до внутрішнього REST API з типізованою відповіддю */
export async function apiRequest<T>(url: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(url, init);
  return (await response.json()) as ApiResponse<T>;
}
