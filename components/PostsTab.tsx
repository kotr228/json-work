'use client';

import { useState, type FormEvent } from 'react';
import { apiRequest } from '@/lib/client';
import type { Post, PostsStats } from '@/lib/types';
import { useNotify } from './Notification';
import { PostList } from './PostList';
import { StatsGrid, type StatItem } from './StatsGrid';

export function PostsTab() {
  const notify = useNotify();
  const [userId, setUserId] = useState('5');
  const [title, setTitle] = useState('Пости');
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [stats, setStats] = useState<PostsStats | null>(null);
  const [loading, setLoading] = useState(false);

  async function run(url: string, onSuccess: (posts: Post[], stats?: PostsStats) => void, errorText: string) {
    setLoading(true);
    try {
      const data = await apiRequest<{ posts: Post[]; stats?: PostsStats }>(url);
      if (data.success) onSuccess(data.posts, data.stats);
      else {
        notify(data.error, 'error');
        setPosts(null);
      }
    } catch {
      notify(errorText, 'error');
      setPosts(null);
    } finally {
      setLoading(false);
    }
  }

  function fetchPosts(event: FormEvent) {
    event.preventDefault();
    run(
      `/api/posts?userId=${encodeURIComponent(userId)}`,
      (posts, stats) => {
        notify(`Завантажено ${posts.length} постів для користувача #${stats?.userId ?? userId}`);
        setTitle(`Пости користувача #${stats?.userId ?? userId} (з API)`);
        setPosts(posts);
        setStats(stats ?? { total: posts.length });
      },
      'Помилка завантаження постів',
    );
  }

  function loadSaved() {
    run(
      '/api/posts/saved',
      (posts) => {
        notify('Збережені пости завантажено');
        setTitle('Збережені пости');
        setPosts(posts);
        setStats(posts.length > 0 ? { total: posts.length } : null);
      },
      'Помилка завантаження збережених постів',
    );
  }

  const statItems: StatItem[] = stats
    ? [
        { label: 'Всього постів', value: stats.total },
        ...(stats.userId ? [{ label: 'User ID', value: stats.userId }] : []),
      ]
    : [];

  return (
    <section>
      <h2>Завантаження даних з API</h2>
      <p className="description">Завантаження постів з JSONPlaceholder та збереження в JSON</p>

      <div className="card">
        <h3>Завантажити пости</h3>
        <form onSubmit={fetchPosts} className="form-row">
          <div className="form-group">
            <label htmlFor="userId">User ID</label>
            <input
              id="userId"
              type="number"
              min={1}
              max={10}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Завантажити з API
          </button>
          <button type="button" onClick={loadSaved} className="btn btn-secondary" disabled={loading}>
            Показати збережені
          </button>
        </form>
      </div>

      {stats && (
        <div className="card">
          <h3>Статистика</h3>
          <StatsGrid items={statItems} />
        </div>
      )}

      <div className="card">
        <h3>{title}</h3>
        {loading ? (
          <div className="loading">Завантаження</div>
        ) : posts === null ? (
          <p className="empty-message">Завантажте пости з API або відкрийте збережені</p>
        ) : (
          <PostList posts={posts} />
        )}
      </div>
    </section>
  );
}
