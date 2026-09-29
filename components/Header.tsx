import Image from 'next/image';
import Link from 'next/link';

export function Header({ subtitle }: { subtitle: string }) {
  return (
    <header className="header">
      <Link href="/" className="brand">
        <Image src="/Logo.svg" alt="JSON Work" width={64} height={64} priority unoptimized />
        <div>
          <h1>Лабораторна робота №8</h1>
          <p className="subtitle">{subtitle}</p>
        </div>
      </Link>
      <nav className="header-nav">
        <Link href="/">Панель</Link>
        <Link href="/fetch-posts">Пости (клієнт)</Link>
      </nav>
    </header>
  );
}
