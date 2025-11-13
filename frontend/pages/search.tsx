import { useEffect, useState } from 'react'
const api = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api'

export default function Search() {
  const [tax, setTax] = useState<{practices:string[];claims:{practice:string;text:string}[]}>({ practices: [], claims: [] })
  const [rows, setRows] = useState<any[]>([])
  const [cols, setCols] = useState<string>('')
  const [sort, setSort] = useState('')
  const [practice, setPractice] = useState('')
  const [claim, setClaim] = useState('')
  const [yearFrom, setYearFrom] = useState('')
  const [yearTo, setYearTo] = useState('')
  useEffect(() => { (async () => { const res = await fetch(`${api}/taxonomy`); const json = await res.json(); setTax(json) })() }, [])
  const run = async (e: any) => {
    e.preventDefault()
    const qs = new URLSearchParams({ practice, claim, yearFrom, yearTo, sort, columns: cols })
    const res = await fetch(`${api}/search?`+qs.toString())
    const json = await res.json()
    setRows(json.rows||[])
  }
  const rate = async (id: string, userEmail: string, stars: number) => {
    await fetch(`${api}/rate/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userEmail, stars }) })
    run({ preventDefault: () => {} })
  }
  const visible = (name: string) => !cols || cols.split(',').includes(name)
  return (
    <div>
      <h4>搜索</h4>
      <form onSubmit={run} className="row gy-2">
        <div className="col-md-4">
          <label className="form-label">SE实践</label>
          <select value={practice} onChange={e=>setPractice(e.target.value)} className="form-select">
            {tax.practices.map(p => (<option key={p} value={p}>{p}</option>))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">主张</label>
          <select value={claim} onChange={e=>setClaim(e.target.value)} className="form-select">
            {tax.claims.map(c => (<option key={c.practice+':'+c.text} value={c.text}>{c.text} ({c.practice})</option>))}
          </select>
        </div>
        <div className="col-md-2"><label className="form-label">起始年份</label><input value={yearFrom} onChange={e=>setYearFrom(e.target.value)} type="number" className="form-control" /></div>
        <div className="col-md-2"><label className="form-label">结束年份</label><input value={yearTo} onChange={e=>setYearTo(e.target.value)} type="number" className="form-control" /></div>
        <div className="col-md-4"><label className="form-label">排序</label><select value={sort} onChange={e=>setSort(e.target.value)} className="form-select"><option value="">默认</option><option value="author">作者</option><option value="year">年份</option><option value="claim">主张</option><option value="result">证据结果</option></select></div>
        <div className="col-md-8"><label className="form-label">列可见性(逗号分隔)</label><input value={cols} onChange={e=>setCols(e.target.value)} className="form-control" placeholder="title,authors,year,journal,practice,claim,result,studyType,participantType" /></div>
        <div className="col-12"><button className="btn btn-primary">搜索</button></div>
      </form>
      <table className="table table-hover mt-3"><thead><tr>
        {visible('title') && <th>标题</th>}
        {visible('authors') && <th>作者</th>}
        {visible('year') && <th>出版年份</th>}
        {visible('journal') && <th>期刊/会议</th>}
        {visible('practice') && <th>SE实践</th>}
        {visible('claim') && <th>主张</th>}
        {visible('result') && <th>证据结果</th>}
        {visible('studyType') && <th>研究类型</th>}
        {visible('participantType') && <th>参与者类型</th>}
        <th>平均评分</th>
        <th>评分</th>
      </tr></thead><tbody>
        {rows.map((r: any) => (
          <tr key={r._id}>
            {visible('title') && <td>{r.title}</td>}
            {visible('authors') && <td>{(r.authors||[]).join(', ')}</td>}
            {visible('year') && <td>{r.year||''}</td>}
            {visible('journal') && <td>{r.journal||''}</td>}
            {visible('practice') && <td>{r.practice||''}</td>}
            {visible('claim') && <td>{r.claim||''}</td>}
            {visible('result') && <td>{r.result||''}</td>}
            {visible('studyType') && <td>{r.studyType||''}</td>}
            {visible('participantType') && <td>{r.participantType||''}</td>}
            <td>{Number(r.rating||0).toFixed(2)}</td>
            <td>
              <form onSubmit={(e:any)=>{e.preventDefault(); rate(r._id, e.target.userEmail.value, Number(e.target.stars.value))}} className="d-flex">
                <input name="userEmail" type="email" className="form-control form-control-sm me-2" placeholder="您的邮箱" required />
                <select name="stars" className="form-select form-select-sm me-2">{[1,2,3,4,5].map(s=>(<option key={s} value={s}>{s}</option>))}</select>
                <button className="btn btn-sm btn-outline-primary">提交</button>
              </form>
            </td>
          </tr>
        ))}
      </tbody></table>
    </div>
  )
}

