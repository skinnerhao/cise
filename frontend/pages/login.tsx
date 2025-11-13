import { useState } from 'react'

const api = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  const login = async (e: any) => {
    e.preventDefault()
    setMsg('')
    const res = await fetch(`${api}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    const json = await res.json()
    if (json.token) {
      localStorage.setItem('token', json.token)
      localStorage.setItem('role', json.role)
      setMsg('登录成功')
      location.href = '/'
    } else {
      setMsg(JSON.stringify(json))
    }
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>登录</h4>
        <form onSubmit={login}>
          <div className="mb-2"><label className="form-label">邮箱</label><input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} type="email" required /></div>
          <div className="mb-2"><label className="form-label">密码</label><input className="form-control" value={password} onChange={e=>setPassword(e.target.value)} type="password" required /></div>
          <button className="btn btn-success">登录</button>
          <a className="btn btn-link" href="/register">去注册</a>
        </form>
      </div>
      <div className="col-12"><pre className="mt-3">{msg}</pre></div>
    </div>
  )
}
