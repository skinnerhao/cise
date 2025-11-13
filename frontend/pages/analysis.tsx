import { useEffect, useState } from 'react'
const api = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api'

export default function Analysis() {
  const [role, setRole] = useState<string>('')
  useEffect(() => { setRole(localStorage.getItem('role') || '') }, [])
  const [items, setItems] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  useEffect(() => { (async () => { try { const token = localStorage.getItem('token')||''; const res = await fetch(`${api}/analysis`, { headers: token ? { 'Authorization': `Bearer ${token}` } : undefined as any }); const json = await res.json(); setItems(json.items||[]); setErr('') } catch (e: any) { setErr(e?.message || '网络错误') } })() }, [])
  const save = async (id: string) => { try { const token = localStorage.getItem('token')||''; const body = { practice: prompt('实践(如TDD)')||'', claim: prompt('主张')||'', result: 'support', studyType: '实验', participantType: '学生' }; const res = await fetch(`${api}/analysis/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }, body: JSON.stringify(body) }); const json = await res.json(); setMsg(JSON.stringify(json)); setErr('') } catch (e: any) { setErr(e?.message || '网络错误') } }
  return (
    <div>
      {role !== 'analyst' && <div className="alert alert-warning">需要分析师登录后使用该页面</div>}
      {err && <div className="alert alert-danger">{err}</div>}
      <h4>待分析队列</h4>
      <ul className="list-group">
        {items.map(i => (<li className="list-group-item d-flex justify-content-between" key={i._id}><span>{i.title}</span><button className="btn btn-sm btn-outline-primary" onClick={() => save(i._id)}>录入证据</button></li>))}
      </ul>
      <pre className="mt-3">{msg}</pre>
    </div>
  )
}
