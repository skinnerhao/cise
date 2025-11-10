import Link from 'next/link';
import { ReactNode } from 'react';

type Props = { children: ReactNode };

export default function Layout({ children }: Props) {
  return (
    <div style={{ fontFamily: 'system-ui, Arial, sans-serif', maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>SPEED</h1>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link href="/">首页</Link>
          <Link href="/submit">提交文章</Link>
          <Link href="/review">审核文章</Link>
          <Link href="/analyze">分析文章</Link>
          <Link href="/search">搜索证据</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer style={{ marginTop: 48, color: '#666' }}>
        © {new Date().getFullYear()} SPEED — Software Practice Empirical Evidence Database
      </footer>
    </div>
  );
}