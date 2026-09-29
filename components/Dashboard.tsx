'use client';

import { useState } from 'react';
import { PostsTab } from './PostsTab';
import { ProductsTab } from './ProductsTab';
import { UsersTab } from './UsersTab';

const TABS = [
  { id: 'users', label: 'Завдання 1: Користувачі', Component: UsersTab },
  { id: 'products', label: 'Завдання 2: Товари', Component: ProductsTab },
  { id: 'posts', label: 'Завдання 3: Пости з API', Component: PostsTab },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function Dashboard() {
  const [active, setActive] = useState<TabId>('users');

  return (
    <>
      <nav className="tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            className={`tab-btn${active === tab.id ? ' active' : ''}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="tab-content">
        {TABS.map(({ id, Component }) => (
          <div key={id} role="tabpanel" className="tab-pane" hidden={active !== id}>
            <Component />
          </div>
        ))}
      </div>
    </>
  );
}
