# ASPICE 项目开发管理平台

遵循 ASPICE 汽车软件过程能力评估标准的一站式项目开发管理平台。

## 功能特性

- ✅ **用户认证**：JWT 登录/注册
- ✅ **项目管理**：创建、编辑、删除项目
- ✅ **任务看板**：拖拽式 Kanban 面板
- ✅ **ASPICE 过程**：支持 VDA QAR 16 项必选过程
- ✅ **Sprint 管理**：敏捷开发支持

## 技术栈

### 前端
- React 18 + TypeScript
- Vite
- Ant Design Pro
- React Router 6

### 后端
- Node.js + Express
- TypeScript
- TypeORM
- PostgreSQL

## 快速启动

### 前端

```bash
cd frontend
npm install
npm run dev
```

### 后端

```bash
cd backend
npm install
npm run dev
```

## 项目结构

```
aspice-platform/
├── frontend/          # React 前端
│   ├── src/
│   │   ├── pages/     # 页面组件
│   │   ├── services/  # API 服务
│   │   └── App.tsx    # 路由配置
│   └── vite.config.ts
├── backend/           # Node.js 后端
│   ├── src/
│   │   ├── entities/  # 数据库实体
│   │   ├── routes/    # API 路由
│   │   ├── middleware/ # 中间件
│   │   └── app.ts      # 主应用
│   └── package.json
└── README.md
```

## 开发计划

| 阶段 | 模块 | 状态 |
|------|------|------|
| M0.1 | 项目脚手架 | ✅ |
| M0.2 | 用户认证 | ✅ |
| M0.3 | 项目 CRUD | ✅ |
| M0.4 | 任务 Kanban | ✅ |
| M1.1 | ASPICE 过程配置 | 🔄 |
| M1.2 | 工作产品模板 | ⬜ |
| M2.1 | NCR 管理 | ⬜ |
| M2.2 | 质量门禁 | ⬜ |

## License

MIT
