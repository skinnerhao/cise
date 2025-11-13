import { useEffect, useState } from 'react'
const api = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api'

export default function Admin() {
  const [role, setRole] = useState<string>('')
  useEffect(() => { setRole(localStorage.getItem('role') || '') }, [])
  const [tax, setTax] = useState<{practices:string[];claims:{practice:string;text:string}[]}>({ practices: [], claims: [] })
  const [err, setErr] = useState('')
  const load = async () => {
    try {
      const res = await fetch(`${api}/admin`)
      const json = await res.json()
      setTax(json)
      setErr('')
    } catch (e: any) {
      setErr(e?.message || '网络错误')
    }
  }
  useEffect(() => { load() }, [])
  const addPractice = async (e: any) => { e.preventDefault(); const val = e.target.practice.value; try { const token = localStorage.getItem('token')||''; await fetch(`${api}/admin/practice`, { method: 'POST', headers: { 'Content-Type':'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }, body: JSON.stringify({ practice: val }) }); e.target.reset(); setErr(''); load() } catch (e: any) { setErr(e?.message || '网络错误') } }
  const addClaim = async (e: any) => { e.preventDefault(); const practice = e.target.practice.value; const text = e.target.text.value; try { const token = localStorage.getItem('token')||''; await fetch(`${api}/admin/claim`, { method: 'POST', headers: { 'Content-Type':'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }, body: JSON.stringify({ practice, text }) }); e.target.reset(); setErr(''); load() } catch (e: any) { setErr(e?.message || '网络错误') } }
  const delPractice = async (p: string) => { try { const token = localStorage.getItem('token')||''; await fetch(`${api}/admin/practice/delete`, { method: 'POST', headers: { 'Content-Type':'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }, body: JSON.stringify({ practice: p }) }); load() } catch (e: any) { setErr(e?.message || '网络错误') } }
  const delClaim = async (practice: string, text: string) => { try { const token = localStorage.getItem('token')||''; await fetch(`${api}/admin/claim/delete`, { method: 'POST', headers: { 'Content-Type':'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }, body: JSON.stringify({ practice, text }) }); load() } catch (e: any) { setErr(e?.message || '网络错误') } }
  return (
    <div className="row">
      {role !== 'analyst' && <div className="alert alert-warning">需要分析师登录后使用该页面</div>}
      {err && <div className="alert alert-danger">{err}</div>}
      <div className="col-md-6">
        <h5>实践列表</h5>
        <ul className="list-group mb-2">{tax.practices.map(p=>(<li key={p} className="list-group-item d-flex justify-content-between"><span>{p}</span><button className="btn btn-sm btn-outline-danger" onClick={()=>delPractice(p)}>删除</button></li>))}</ul>
        <form onSubmit={addPractice} className="d-flex">
          <input name="practice" className="form-control me-2" placeholder="新增实践" />
          <button className="btn btn-primary">添加</button>
        </form>
      </div>
      <div className="col-md-6">
        <h5>主张列表</h5>
        <ul className="list-group mb-2">{tax.claims.map(c=>(<li key={c.practice+':'+c.text} className="list-group-item d-flex justify-content-between"><span>{c.practice}: {c.text}</span><button className="btn btn-sm btn-outline-danger" onClick={()=>delClaim(c.practice, c.text)}>删除</button></li>))}</ul>
        <form onSubmit={addClaim}>
          <div className="mb-2"><label className="form-label">实践</label><input name="practice" className="form-control" /></div>
          <div className="mb-2"><label className="form-label">主张</label><input name="text" className="form-control" /></div>
          <button className="btn btn-primary">添加</button>
        </form>
      </div>
    </div>
  )
}
