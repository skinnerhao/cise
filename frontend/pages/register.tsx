import { useState } from 'react'

const api = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('submitter')
  const [msg, setMsg] = useState('')

  const register = async (e: any) => {
    e.preventDefault()
    setMsg('')
    const res = await fetch(`${api}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, role }) })
    const json = await res.json()
    if (json.success) {
      setMsg('注册成功，请前往登录')
    } else {
      setMsg(JSON.stringify(json))
    }
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>注册</h4>
        <form onSubmit={register}>
          <div className="mb-2"><label className="form-label">邮箱</label><input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} type="email" required /></div>
          <div className="mb-2"><label className="form-label">密码</label><input className="form-control" value={password} onChange={e=>setPassword(e.target.value)} type="password" required /></div>
          <div className="mb-2"><label className="form-label">职业</label><select className="form-select" value={role} onChange={e=>setRole(e.target.value)}><option value="submitter">提交者</option><option value="reviewer">审核员</option><option value="analyst">分析师</option></select></div>
          <button className="btn btn-primary">注册</button>
          <a className="btn btn-link" href="/login">去登录</a>
        </form>
      </div>
      <div className="col-12"><pre className="mt-3">{msg}</pre></div>
    </div>
  )
}

