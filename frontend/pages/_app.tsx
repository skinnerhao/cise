import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const [role, setRole] = useState<string>('')
  const [token, setToken] = useState<string>('')
  useEffect(() => { setRole(localStorage.getItem('role') || ''); setToken(localStorage.getItem('token') || '') }, [])
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('role'); location.href = '/login' }
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
      </Head>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">SPEED</a>
          <div>
            {!token && (
              <>
                <a className="btn btn-warning me-2" href="/login">登录</a>
                <a className="btn btn-outline-warning" href="/register">注册</a>
              </>
            )}
            {!!token && role === 'submitter' && (
              <>
                <a className="btn btn-outline-light me-2" href="/submit">提交</a>
                <a className="btn btn-outline-light me-2" href="/search">搜索</a>
              </>
            )}
            {!!token && role === 'reviewer' && (
              <>
                <a className="btn btn-outline-light me-2" href="/review">审核</a>
                <a className="btn btn-outline-light me-2" href="/search">搜索</a>
              </>
            )}
            {!!token && role === 'analyst' && (
              <>
                <a className="btn btn-outline-light me-2" href="/analysis">分析</a>
                <a className="btn btn-outline-light me-2" href="/admin">管理</a>
                <a className="btn btn-outline-light me-2" href="/search">搜索</a>
              </>
            )}
            {!!token && (<button className="btn btn-outline-warning ms-2" onClick={logout}>退出</button>)}
          </div>
        </div>
      </nav>
      <div className="container"><Component {...pageProps} /></div>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    </>
  )
}
