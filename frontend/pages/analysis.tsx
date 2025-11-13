import { useEffect, useState } from 'react'
const api = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api'

export default function Analysis() {
  const [items, setItems] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  useEffect(() => { (async () => { const res = await fetch(`${api}/analysis`); const json = await res.json(); setItems(json.items||[]) })() }, [])
  const save = async (id: string) => {
    const body = { practice: prompt('实践(如TDD)')||'', claim: prompt('主张')||'', result: 'support', studyType: '实验', participantType: '学生' }
    const res = await fetch(`${api}/analysis/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const json = await res.json()
    setMsg(JSON.stringify(json))
  }
  return (
    <div>
      <h4>待分析队列</h4>
      <ul className="list-group">
        {items.map(i => (<li className="list-group-item d-flex justify-content-between" key={i._id}><span>{i.title}</span><button className="btn btn-sm btn-outline-primary" onClick={() => save(i._id)}>录入证据</button></li>))}
      </ul>
      <pre className="mt-3">{msg}</pre>
    </div>
  )
}

