'use client';

import { useState } from 'react';
import { apiRequest } from '@/lib/client';
import type { MergeStats, Product, ProductFile } from '@/lib/types';
import { useNotify } from './Notification';
import { StatsGrid } from './StatsGrid';

const TITLES: Record<ProductFile, string> = {
  products1: 'Товари з products1.json',
  products2: 'Товари з products2.json',
  combined: "Об'єднані товари (відсортовано за ціною)",
};

export function ProductsTab() {
  const notify = useNotify();
  const [title, setTitle] = useState('Товари');
  const [products, setProducts] = useState<Product[] | null>(null);
  const [stats, setStats] = useState<MergeStats | null>(null);

  async function loadProducts(file: ProductFile) {
    try {
      const data = await apiRequest<{ products: Product[] }>(`/api/products/${file}`);
      if (data.success) {
        setTitle(TITLES[file]);
        setProducts(data.products);
        setStats(null);
      } else {
        notify(data.error, 'error');
      }
    } catch {
      notify('Помилка завантаження товарів', 'error');
    }
  }

  async function merge() {
    try {
      const data = await apiRequest<{ products: Product[]; stats: MergeStats }>('/api/products/merge', {
        method: 'POST',
      });
      if (data.success) {
        notify("Товари успішно об'єднано!");
        setTitle(TITLES.combined);
        setProducts(data.products);
        setStats(data.stats);
      } else {
        notify(data.error, 'error');
      }
    } catch {
      notify("Помилка об'єднання товарів", 'error');
    }
  }

  return (
    <section>
      <h2>Злиття JSON-файлів з товарами</h2>
      <p className="description">Об&apos;єднання двох файлів, видалення дублікатів, сортування за ціною</p>

      <div className="card">
        <h3>Перегляд файлів</h3>
        <div className="button-group">
          <button onClick={() => loadProducts('products1')} className="btn btn-secondary">
            Товари 1
          </button>
          <button onClick={() => loadProducts('products2')} className="btn btn-secondary">
            Товари 2
          </button>
          <button onClick={merge} className="btn btn-primary">
            Об&apos;єднати
          </button>
          <button onClick={() => loadProducts('combined')} className="btn btn-secondary">
            Результат
          </button>
        </div>
      </div>

      {stats && (
        <div className="card">
          <h3>Статистика</h3>
          <StatsGrid
            items={[
              { label: 'Всього товарів', value: stats.total },
              { label: 'Видалено дублікатів', value: stats.duplicatesRemoved },
              { label: 'Загальна вартість (грн)', value: stats.totalPrice },
              { label: 'Середня ціна (грн)', value: stats.avgPrice },
              { label: 'Мінімальна ціна (грн)', value: stats.minPrice },
              { label: 'Максимальна ціна (грн)', value: stats.maxPrice },
            ]}
          />
        </div>
      )}

      <div className="card">
        <h3>{title}</h3>
        {products === null ? (
          <p className="empty-message">Оберіть файл для перегляду</p>
        ) : products.length === 0 ? (
          <p className="empty-message">Немає товарів</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Назва</th>
                  <th className="num">Ціна (грн)</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td className="num">{product.price}</td>
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
