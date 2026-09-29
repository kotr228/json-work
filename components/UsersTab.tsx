'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { apiRequest } from '@/lib/client';
import type { User } from '@/lib/types';
import { useNotify } from './Notification';

export function UsersTab() {
  const notify = useNotify();
  const [users, setUsers] = useState<User[] | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      const data = await apiRequest<{ users: User[] }>('/api/users');
      if (data.success) setUsers(data.users);
      else notify(data.error, 'error');
    } catch {
      notify('Помилка завантаження користувачів', 'error');
    }
  }, [notify]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function addUser(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const data = await apiRequest<{ user: User; total: number }>('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      if (data.success) {
        notify(`Користувача "${data.user.name}" додано! Всього: ${data.total}`);
        setName('');
        setEmail('');
        loadUsers();
      } else {
        notify(data.error, 'error');
      }
    } catch {
      notify('Помилка додавання користувача', 'error');
    } finally {
      setBusy(false);
    }
  }

  async function deleteUser(id: number) {
    if (!confirm('Ви впевнені, що хочете видалити цього користувача?')) return;
    try {
      const data = await apiRequest<{ total: number }>(`/api/users/${id}`, { method: 'DELETE' });
      if (data.success) {
        notify('Користувача видалено');
        loadUsers();
      } else {
        notify(data.error, 'error');
      }
    } catch {
      notify('Помилка видалення користувача', 'error');
    }
  }

  return (
    <section>
      <h2>Управління користувачами</h2>
      <p className="description">Додавання, перегляд та видалення користувачів з JSON файлу</p>

      <div className="card">
        <h3>Додати користувача</h3>
        <form onSubmit={addUser} className="form-row">
          <div className="form-group">
            <label htmlFor="userName">Ім&apos;я</label>
            <input
              id="userName"
              type="text"
              placeholder="Іван Петренко"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="userEmail">Email</label>
            <input
              id="userEmail"
              type="email"
              placeholder="ivan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            Додати
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Список користувачів</h3>
          <button onClick={loadUsers} className="btn btn-secondary">
            Оновити
          </button>
        </div>
        {users === null ? (
          <div className="loading">Завантаження</div>
        ) : users.length === 0 ? (
          <p className="empty-message">Немає користувачів</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ім&apos;я</th>
                  <th>Email</th>
                  <th>Дії</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <button className="btn btn-danger" onClick={() => deleteUser(user.id)}>
                        Видалити
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
