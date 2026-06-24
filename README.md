# Wiki 项目

一个前后端分离的 Wiki 知识库应用。

## 项目结构

```
wiki/
├── wiki-frontend/          # Vue 3 + Vite 前端
│   ├── src/
│   │   ├── api/            API 请求层
│   │   ├── components/     公共组件
│   │   ├── views/          页面视图
│   │   ├── router/         路由配置
│   │   ├── stores/         Pinia 状态管理
│   │   ├── styles/         样式文件
│   │   ├── types/          TypeScript 类型定义
│   │   ├── App.vue         根组件
│   │   └── main.ts         入口文件
│   ├── public/             静态资源
│   ├── package.json
│   └── vite.config.ts      Vite 配置（含代理）
│
└── wiki-backend/           # Express 后端
    ├── src/
    │   ├── config/         数据库配置
    │   ├── middleware/     中间件
    │   ├── models/         数据模型
    │   ├── routes/         路由（auth, posts, comments, upload）
    │   ├── uploads/        上传文件目录
    │   └── server.js       入口文件
    ├── seed.js             种子数据脚本
    ├── .env                环境变量
    └── package.json
```

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Vue 3 + TypeScript |
| 构建工具 | Vite 8 |
| UI 组件库 | Element Plus |
| 状态管理 | Pinia |
| 路由 | Vue Router |
| HTTP 请求 | Axios |
| 富文本编辑器 | TipTap |
| Markdown 渲染 | markdown-it + highlight.js |
| 后端框架 | Express |
| 数据库 | MongoDB |
| 认证 | JWT |

## 启动流程

### 前置条件

- Node.js
- MongoDB（本地或 Docker）

### 1. 启动 MongoDB

```bash
# 本地安装
mongod --dbpath <数据目录>

# 或 Docker
docker run -d -p 27017:27017 --name wiki-mongo mongo
```

### 2. 启动后端（端口 3000）

```bash
cd wiki-backend
npm run dev
```

### 3. 启动前端（端口 5173）

```bash
cd wiki-frontend
npm run dev
```

浏览器访问 `http://localhost:5173` 即可使用。

## 前后端通信

Vite 开发服务器配置了代理（`vite.config.ts`），`/api` 和 `/uploads` 请求会自动转发到后端 `http://localhost:3000`，无需额外 CORS 配置。

## 环境变量

**后端**（`wiki-backend/.env`）：
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/wiki
JWT_SECRET=wiki_jwt_secret_key_2024
```
