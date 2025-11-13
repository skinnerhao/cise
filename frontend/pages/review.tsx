import { useEffect, useState } from 'react'
const api = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api'

export default function Review() {
  const [role, setRole] = useState<string>('')
  useEffect(() => { setRole(localStorage.getItem('role') || '') }, [])
  const [items, setItems] = useState<any[]>([])
  const [actionMsg, setActionMsg] = useState('')
  const [err, setErr] = useState('')
  const load = async () => {
    try {
      const token = localStorage.getItem('token')||''
      const res = await fetch(`${api}/review`, { headers: token ? { 'Authorization': `Bearer ${token}` } : undefined as any })
      const json = await res.json()
      setItems(json.items || [])
      setErr('')
    } catch (e: any) {
      setErr(e?.message || '网络错误')
    }
  }
  useEffect(() => { load() }, [])
  const approve = async (id: string) => { try { const token = localStorage.getItem('token')||''; const res = await fetch(`${api}/review/${id}/approve`, { method: 'POST', headers: token ? { 'Authorization': `Bearer ${token}` } : undefined as any }); const json = await res.json(); setActionMsg(JSON.stringify(json)); setErr(''); load() } catch (e: any) { setErr(e?.message || '网络错误') } }
  const reject = async (id: string, reason: string) => { try { const token = localStorage.getItem('token')||''; const res = await fetch(`${api}/review/${id}/reject`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }, body: JSON.stringify({ reason }) }); const json = await res.json(); setActionMsg(JSON.stringify(json)); setErr(''); load() } catch (e: any) { setErr(e?.message || '网络错误') } }
  return (
    <div>
      {role !== 'reviewer' && <div className="alert alert-warning">需要审核员登录后使用该页面</div>}
      {err && <div className="alert alert-danger">{err}</div>}
      <h4>待审核队列</h4>
      <table className="table table-striped"><thead><tr><th>标题</th><th>作者</th><th>年份</th><th>操作</th></tr></thead><tbody>
        {items.map(i => (
          <tr key={i._id}>
            <td>{i.title}</td>
            <td>{(i.authors||[]).join(', ')}</td>
            <td>{i.year||''}</td>
            <td>
              <button className="btn btn-sm btn-success me-2" onClick={() => approve(i._id)}>通过</button>
              <button className="btn btn-sm btn-danger" onClick={() => reject(i._id, prompt('拒绝原因')||'')}>拒绝</button>
            </td>
          </tr>
        ))}
      </tbody></table>
      <pre>{actionMsg}</pre>
    </div>
  )
}
