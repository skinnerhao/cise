import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <section>
        <h2>项目简介</h2>
        <p>
          SPEED（Software Practice Empirical Evidence Database）是一个面向软件工程实践的证据数据库。
          它整合并结构化展示学术研究中的实证结果，帮助从业者根据真实证据做出实践选择。
        </p>
      </section>
      <section>
        <h2>核心流程</h2>
        <ol>
          <li>提交文章：公众成员提交文献的基本信息。</li>
          <li>审核文章：审核员确认文章合格且不重复。</li>
          <li>分析文章：分析师录入实践、主张、结果等证据信息。</li>
          <li>搜索展示：搜索者按实践与主张查看证据列表。</li>
        </ol>
      </section>
    </Layout>
  );
}