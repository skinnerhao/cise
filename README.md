# SPEED — Software Practice Empirical Evidence Database

一个基于 MNNN 技术栈（MongoDB、Node.js、Nest.js、Next.js）的响应式 Web 应用，用于集中化、结构化地呈现软件工程实践的实证研究证据，支持提交—审核—分析—搜索的证据流水线。

## 目录结构

- `frontend/`：Next.js 前端
- `backend/`：Nest.js 后端

## 本地开发

前置需求：安装 Node.js 18+；本地或远程可用的 MongoDB（默认 `mongodb://localhost:27017/speed`）。

1. 启动后端（Nest.js）
   - `cd backend`
   - `npm install`
   - 如需自定义端口或连接字符串，复制 `.env.example` 为 `.env` 并修改
   - `npm run start:dev`
   - 默认监听 `http://localhost:4000`

2. 启动前端（Next.js）
   - `cd frontend`
   - `npm install`
   - 复制 `.env.local.example` 为 `.env.local` 并设置 `NEXT_PUBLIC_API_BASE_URL`
   - `npm run dev`
   - 打开 `http://localhost:3000`

## 环境变量

后端（`backend/.env`）：

- `MONGODB_URI`：MongoDB 连接字符串，默认 `mongodb://localhost:27017/speed`
- `PORT`：后端端口，默认 `4000`

前端（`frontend/.env.local`）：

- `NEXT_PUBLIC_API_BASE_URL`：后端基础地址，默认 `http://localhost:4000`

## 角色与流程

- 提交者：提交文章书目信息（标题、作者、DOI、URL）
- 审核员：审核提交是否合格、不重复
- 分析师：录入通过文章的证据数据（实践、主张、结果、研究类型）
- 搜索者：按实践与主张搜索证据，表格展示可过滤

当前后端接口为占位实现，后续将替换为真实的 MongoDB 持久化与业务逻辑。