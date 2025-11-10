import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';

type Evidence = { id: string; practice: string; claim: string; conclusion: '支持' | '不支持' | '混合'; source: string };

export default function SearchPage() {
  const [practice, setPractice] = useState('');
  const [claim, setClaim] = useState('');
  const [results, setResults] = useState<Evidence[]>([]);
  const api = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

  useEffect(() => {
    const load = async () => {
      const qs = new URLSearchParams();
      if (practice) qs.set('practice', practice);
      if (claim) qs.set('claim', claim);
      try {
        const res = await fetch(`${api}/search/evidence?${qs.toString()}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        setResults([]);
      }
    };
    load();
  }, [api, practice, claim]);

  return (
    <Layout>
      <h2>搜索证据</h2>
      <p>输入软件实践与主张进行筛选，结果可排序、可过滤（示例数据）。</p>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <input placeholder="实践（如：TDD）" value={practice} onChange={(e) => setPractice(e.target.value)} />
        <input placeholder="主张（如：提高代码质量）" value={claim} onChange={(e) => setClaim(e.target.value)} />
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>实践</th>
            <th style={{ textAlign: 'left' }}>主张</th>
            <th style={{ textAlign: 'left' }}>结论</th>
            <th style={{ textAlign: 'left' }}>来源</th>
          </tr>
        </thead>
        <tbody>
          {results.map((e) => (
            <tr key={e.id}>
              <td>{e.practice}</td>
              <td>{e.claim}</td>
              <td>{e.conclusion}</td>
              <td>{e.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {results.length === 0 && <p>未找到匹配结果。</p>}
    </Layout>
  );
}