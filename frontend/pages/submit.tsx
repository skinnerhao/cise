import { useEffect, useState } from 'react'

const api = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api'

export default function Submit() {
  const [role, setRole] = useState<string>('')
  useEffect(() => { setRole(localStorage.getItem('role') || '') }, [])
  const [status, setStatus] = useState('')
  const [tax, setTax] = useState<{practices:string[];claims:{practice:string;text:string}[]}>({ practices: [], claims: [] })
  useEffect(() => { (async () => { try { const res = await fetch(`${api}/taxonomy`); const json = await res.json(); setTax(json) } catch {} })() }, [])
  const [practice, setPractice] = useState('')
  const [claim, setClaim] = useState('')
  const submitManual = async (e: any) => {
    e.preventDefault()
    try {
      const form = new FormData(e.target)
      if (practice) form.append('practice', practice)
      if (claim) form.append('claim', claim)
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${api}/submit`, { method: 'POST', headers: token ? { 'Authorization': `Bearer ${token}` } : undefined as any, body: form })
      const json = await res.json()
      setStatus(JSON.stringify(json))
    } catch (e: any) {
      setStatus(e?.message || '网络错误')
    }
  }
  const submitBib = async (e: any) => {
    e.preventDefault()
    try {
      const form = new FormData(e.target)
      if (practice) form.append('practice', practice)
      if (claim) form.append('claim', claim)
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${api}/submit`, { method: 'POST', headers: token ? { 'Authorization': `Bearer ${token}` } : undefined as any, body: form })
      const json = await res.json()
      setStatus(JSON.stringify(json))
    } catch (e: any) {
      setStatus(e?.message || '网络错误')
    }
  }
  return (
    <div className="row">
      {role !== 'submitter' && <div className="alert alert-warning">需要提交者登录后使用该页面</div>}
      <div className="col-md-6">
        <h4>手动输入</h4>
        <form onSubmit={submitManual}>
          <div className="mb-2"><label className="form-label">标题</label><input name="title" className="form-control" required /></div>
          <div className="mb-2"><label className="form-label">作者(逗号分隔)</label><input name="authors" className="form-control" /></div>
          <div className="mb-2"><label className="form-label">期刊/会议</label><input name="journal" className="form-control" /></div>
          <div className="mb-2"><label className="form-label">年份</label><input name="year" type="number" className="form-control" /></div>
          <div className="mb-2"><label className="form-label">DOI</label><input name="doi" className="form-control" /></div>
          <div className="mb-2"><label className="form-label">实践</label><select value={practice} onChange={e=>setPractice(e.target.value)} className="form-select"><option value="">不选择</option>{tax.practices.map(p=>(<option key={p} value={p}>{p}</option>))}</select></div>
          <div className="mb-2"><label className="form-label">主张</label><select value={claim} onChange={e=>setClaim(e.target.value)} className="form-select"><option value="">不选择</option>{tax.claims.filter(c=>!practice||c.practice===practice).map(c=>(<option key={c.practice+':'+c.text} value={c.text}>{c.text} ({c.practice})</option>))}</select></div>
          <div className="mb-2"><label className="form-label">您的邮箱</label><input name="submitterEmail" type="email" className="form-control" /></div>
          <button className="btn btn-primary">提交</button>
        </form>
      </div>
      <div className="col-md-6">
        <h4>BibTeX上传（仅支持 .bib）</h4>
        <form onSubmit={submitBib} encType="multipart/form-data">
          <div className="mb-2"><label className="form-label">BibTeX文件(.bib)</label><input name="bibfile" type="file" accept=".bib" className="form-control" /></div>
          <div className="mb-2"><label className="form-label">您的邮箱</label><input name="submitterEmail" type="email" className="form-control" /></div>
          <button className="btn btn-secondary">上传并提交</button>
        </form>
        <p className="mt-2 text-danger">禁止上传PDF或除DOI外的文章链接；文件类型仅限 .bib</p>
      </div>
      <div className="col-12"><pre className="mt-3">{status}</pre></div>
    </div>
  )
}
