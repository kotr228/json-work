import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { ClientPosts } from './ClientPosts';

export const metadata: Metadata = {
  title: 'Завдання 3: Завантаження постів з API',
};

export default function FetchPostsPage() {
  return (
    <>
      <Header subtitle="Завантаження постів з JSONPlaceholder прямо в браузері" />
      <div className="tab-content">
        <ClientPosts />
      </div>
    </>
  );
}
