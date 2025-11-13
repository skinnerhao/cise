import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
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
            <a className="btn btn-outline-light me-2" href="/search">搜索</a>
            <a className="btn btn-outline-light me-2" href="/review">审核</a>
            <a className="btn btn-outline-light me-2" href="/analysis">分析</a>
            <a className="btn btn-outline-light" href="/admin">管理</a>
          </div>
        </div>
      </nav>
      <div className="container"><Component {...pageProps} /></div>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    </>
  )
}

