'use client';

import { useCallback, useEffect, useState } from 'react';
import { PostList } from '@/components/PostList';
import { StatsGrid } from '@/components/StatsGrid';
import { useNotify } from '@/components/Notification';
import { errorMessage, fetchAllPosts, filterByUser } from '@/lib/logic';
import type { Post } from '@/lib/types';

const USER_ID = 5;

/** Клієнтська версія завдання 3: Fetch API у браузері + збереження JSON через Blob */
export function ClientPosts() {
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const all = await fetchAllPosts();
      setTotal(all.length);
      setPosts(filterByUser(all, USER_ID));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function download() {
    const blob = new Blob([JSON.stringify(posts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_posts.json';
    a.click();
    URL.revokeObjectURL(url);
    notify('Файл user_posts.json збережено!');
  }

  return (
    <section>
      <h2>Завантаження постів з JSONPlaceholder API</h2>
      <p className="description">
        Запит виконується з браузера, пости фільтруються за userId = {USER_ID}, результат можна зберегти як JSON-файл
      </p>

      <div className="card">
        <div className="button-group">
          <button className="btn btn-primary" onClick={load} disabled={loading}>
            Завантажити пости
          </button>
          <button className="btn btn-secondary" onClick={download} disabled={loading || posts.length === 0}>
            Зберегти JSON
          </button>
        </div>
      </div>

      {error && <div className="card error-box">Помилка завантаження: {error}</div>}

      {total > 0 && !error && (
        <div className="card">
          <h3>Статистика</h3>
          <StatsGrid
            items={[
              { label: 'Всього постів', value: total },
              { label: `Для користувача ${USER_ID}`, value: posts.length },
            ]}
          />
        </div>
      )}

      <div className="card">
        <h3>Пости користувача #{USER_ID}</h3>
        {loading ? <div className="loading">Завантаження</div> : !error && <PostList posts={posts} />}
      </div>
    </section>
  );
}
