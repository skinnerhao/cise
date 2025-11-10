import { useState } from 'react';
import Layout from '../components/Layout';

export default function SubmitPage() {
  const [form, setForm] = useState({ title: '', authors: '', doi: '', url: '' });
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const api = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${api}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('提交失败');
      setSubmitted(true);
    } catch (err) {
      alert('提交失败，请稍后再试');
    }
  };

  return (
    <Layout>
      <h2>提交文章</h2>
      <p>请输入文献的基本书目信息（仅标题、作者、DOI、URL）。</p>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 640 }}>
        <label>
          标题
          <input name="title" value={form.title} onChange={onChange} required style={{ width: '100%' }} />
        </label>
        <label>
          作者
          <input name="authors" value={form.authors} onChange={onChange} required style={{ width: '100%' }} />
        </label>
        <label>
          DOI
          <input name="doi" value={form.doi} onChange={onChange} style={{ width: '100%' }} />
        </label>
        <label>
          URL
          <input name="url" type="url" value={form.url} onChange={onChange} style={{ width: '100%' }} />
        </label>
        <button type="submit">提交建议</button>
      </form>
      {submitted && <p style={{ color: 'green' }}>提交成功，已进入审核队列。</p>}
    </Layout>
  );
}