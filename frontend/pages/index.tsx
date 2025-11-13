export default function Home() {
  return (
    <div className="row">
      <div className="col-md-6">
        <div className="card mb-3"><div className="card-body">
          <h5 className="card-title">提交文章</h5>
          <p className="card-text">支持手动填写与BibTeX上传，禁止PDF与外部链接（仅DOI）。</p>
          <a href="/submit" className="btn btn-primary">进入提交</a>
        </div></div>
      </div>
      <div className="col-md-6">
        <div className="card mb-3"><div className="card-body">
          <h5 className="card-title">数据库搜索</h5>
          <p className="card-text">按实践与主张分层筛选，支持年份范围、排序与列自定义。</p>
          <a href="/search" className="btn btn-secondary">进入搜索</a>
        </div></div>
      </div>
      <div className="col-md-6">
        <div className="card mb-3"><div className="card-body">
          <h5 className="card-title">审核队列</h5>
          <p className="card-text">查看待审核文章，执行通过或拒绝并通知相关人员。</p>
          <a href="/review" className="btn btn-outline-primary">进入审核</a>
        </div></div>
      </div>
      <div className="col-md-6">
        <div className="card mb-3"><div className="card-body">
          <h5 className="card-title">分析队列</h5>
          <p className="card-text">录入证据：实践、主张、结果、研究类型与参与者类型。</p>
          <a href="/analysis" className="btn btn-outline-secondary">进入分析</a>
        </div></div>
      </div>
      <div className="col-md-6">
        <div className="card mb-3"><div className="card-body">
          <h5 className="card-title">系统管理</h5>
          <p className="card-text">维护实践与主张词表，供分析与搜索使用。</p>
          <a href="/admin" className="btn btn-dark">进入管理</a>
        </div></div>
      </div>
    </div>
  )
}

