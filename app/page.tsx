import { Dashboard } from '@/components/Dashboard';
import { Header } from '@/components/Header';

export default function HomePage() {
  return (
    <>
      <Header subtitle="Робота з JSON-файлами в Next.js + TypeScript" />
      <Dashboard />
    </>
  );
}
