export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export type ProductFile = 'products1' | 'products2' | 'combined';

export interface MergeStats {
  total: number;
  duplicatesRemoved: number;
  totalPrice: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
}

export interface PostsStats {
  total: number;
  userId?: number;
}

export type ApiResponse<T> = ({ success: true } & T) | { success: false; error: string };
