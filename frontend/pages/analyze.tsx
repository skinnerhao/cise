import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';

type Accepted = { id: string; title: string };

export default function AnalyzePage() {
  const [queue, setQueue] = useState<Accepted[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const selected = useMemo(() => queue.find((x) => x.id === selectedId), [queue, selectedId]);
  const [form, setForm] = useState({ practice: '', claim: '', result: '', studyType: '' });
  const [saved, setSaved] = useState(false);

  const api = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${api}/analysis/queue`);
        const data = await res.json();
        setQueue(data);
        if (data.length > 0) setSelectedId(data[0].id);
      } catch (err) {
        // ignore
      }
    };
    load();
  }, [api]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${api}/analysis/${selectedId}/evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('保存失败');
      setSaved(true);
    } catch (err) {
      alert('保存失败');
    }
  };

  return (
    <Layout>
      <h2>分析文章</h2>
      <p>为通过审核的文章录入证据数据（示例流程）。</p>
      <label>
        选择文章：
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          {queue.map((x) => (
            <option key={x.id} value={x.id}>{x.title}</option>
          ))}
        </select>
      </label>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 640, marginTop: 12 }}>
        <label>
          实践
          <input name="practice" value={form.practice} onChange={onChange} placeholder="如：TDD、代码审查" required />
        </label>
        <label>
          主张
          <input name="claim" value={form.claim} onChange={onChange} placeholder="如：提高代码质量" required />
        </label>
        <label>
          结果
          <input name="result" value={form.result} onChange={onChange} placeholder="如：支持/不支持/混合" required />
        </label>
        <label>
          研究类型
          <input name="studyType" value={form.studyType} onChange={onChange} placeholder="如：控制实验、案例研究" required />
        </label>
        <button type="submit">保存证据</button>
      </form>
      {saved && selected && (
        <p style={{ color: 'green' }}>已为“{selected.title}”保存证据（当前为前端占位）。</p>
      )}
    </Layout>
  );
}