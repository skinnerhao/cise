import { useEffect, useState } from 'react'
const api = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api'

export default function Admin() {
  const [tax, setTax] = useState<{practices:string[];claims:{practice:string;text:string}[]}>({ practices: [], claims: [] })
  const load = async () => { const res = await fetch(`${api}/admin`); const json = await res.json(); setTax(json) }
  useEffect(() => { load() }, [])
  const addPractice = async (e: any) => { e.preventDefault(); const val = e.target.practice.value; await fetch(`${api}/admin/practice`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ practice: val }) }); e.target.reset(); load() }
  const addClaim = async (e: any) => { e.preventDefault(); const practice = e.target.practice.value; const text = e.target.text.value; await fetch(`${api}/admin/claim`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ practice, text }) }); e.target.reset(); load() }
  return (
    <div className="row">
      <div className="col-md-6">
        <h5>实践列表</h5>
        <ul className="list-group mb-2">{tax.practices.map(p=>(<li key={p} className="list-group-item">{p}</li>))}</ul>
        <form onSubmit={addPractice} className="d-flex">
          <input name="practice" className="form-control me-2" placeholder="新增实践" />
          <button className="btn btn-primary">添加</button>
        </form>
      </div>
      <div className="col-md-6">
        <h5>主张列表</h5>
        <ul className="list-group mb-2">{tax.claims.map(c=>(<li key={c.practice+':'+c.text} className="list-group-item">{c.practice}: {c.text}</li>))}</ul>
        <form onSubmit={addClaim}>
          <div className="mb-2"><label className="form-label">实践</label><input name="practice" className="form-control" /></div>
          <div className="mb-2"><label className="form-label">主张</label><input name="text" className="form-control" /></div>
          <button className="btn btn-primary">添加</button>
        </form>
      </div>
    </div>
  )
}

