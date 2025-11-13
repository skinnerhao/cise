import { useState } from 'react'

const api = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api'

export default function Submit() {
  const [status, setStatus] = useState('')
  const submitManual = async (e: any) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const res = await fetch(`${api}/submit`, { method: 'POST', body: form })
    const json = await res.json()
    setStatus(JSON.stringify(json))
  }
  const submitBib = async (e: any) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const res = await fetch(`${api}/submit`, { method: 'POST', body: form })
    const json = await res.json()
    setStatus(JSON.stringify(json))
  }
  return (
    <div className="row">
      <div className="col-md-6">
        <h4>手动输入</h4>
        <form onSubmit={submitManual}>
          <div className="mb-2"><label className="form-label">标题</label><input name="title" className="form-control" required /></div>
          <div className="mb-2"><label className="form-label">作者(逗号分隔)</label><input name="authors" className="form-control" /></div>
          <div className="mb-2"><label className="form-label">期刊/会议</label><input name="journal" className="form-control" /></div>
          <div className="mb-2"><label className="form-label">年份</label><input name="year" type="number" className="form-control" /></div>
          <div className="mb-2"><label className="form-label">DOI</label><input name="doi" className="form-control" /></div>
          <div className="mb-2"><label className="form-label">您的邮箱</label><input name="submitterEmail" type="email" className="form-control" /></div>
          <button className="btn btn-primary">提交</button>
        </form>
      </div>
      <div className="col-md-6">
        <h4>BibTeX上传</h4>
        <form onSubmit={submitBib} encType="multipart/form-data">
          <div className="mb-2"><label className="form-label">BibTeX文件(.bib)</label><input name="bibfile" type="file" accept=".bib" className="form-control" /></div>
          <div className="mb-2"><label className="form-label">您的邮箱</label><input name="submitterEmail" type="email" className="form-control" /></div>
          <button className="btn btn-secondary">上传并提交</button>
        </form>
        <p className="mt-2 text-danger">禁止上传PDF或除DOI外的文章链接</p>
      </div>
      <div className="col-12"><pre className="mt-3">{status}</pre></div>
    </div>
  )
}

