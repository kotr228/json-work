import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { NotificationProvider } from '@/components/Notification';
import './globals.css';

export const metadata: Metadata = {
  title: 'Лабораторна робота №8 — Робота з JSON',
  description: 'Робота з JSON-файлами: Next.js + TypeScript',
};

export const viewport: Viewport = {
  themeColor: '#0F172A',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <NotificationProvider>
          <div className="container">
            {children}
            <footer>Лабораторна робота №8 — ООРВЗ | Next.js + TypeScript</footer>
          </div>
        </NotificationProvider>
      </body>
    </html>
  );
}
