import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

type Submission = { id: string; title: string; authors: string; doi?: string };

export default function ReviewPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const api = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${api}/submissions/pending`);
        const data = await res.json();
        setItems(data);
      } catch (err) {
        // ignore for now
      }
    };
    load();
  }, [api]);

  const accept = async (id: string) => {
    try {
      await fetch(`${api}/reviews/accept/${id}`, { method: 'POST' });
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      alert('操作失败');
    }
  };
  const reject = async (id: string) => {
    try {
      await fetch(`${api}/reviews/reject/${id}`, { method: 'POST' });
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      alert('操作失败');
    }
  };

  return (
    <Layout>
      <h2>审核文章</h2>
      <p>审核队列（示例数据）。接受或拒绝提交。</p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>标题</th>
            <th style={{ textAlign: 'left' }}>作者</th>
            <th style={{ textAlign: 'left' }}>DOI</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((s) => (
            <tr key={s.id}>
              <td>{s.title}</td>
              <td>{s.authors}</td>
              <td>{s.doi || '-'}</td>
              <td style={{ textAlign: 'center' }}>
                <button onClick={() => accept(s.id)} style={{ marginRight: 8 }}>接受</button>
                <button onClick={() => reject(s.id)}>拒绝</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <p style={{ color: 'green' }}>队列已清空（示例）。</p>}
    </Layout>
  );
}