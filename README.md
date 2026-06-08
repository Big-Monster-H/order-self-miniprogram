# 自主接单平台 - 通用任务接单微信小程序

> 一站式 O2O 任务接单平台：用户下单 → 任务发布 → 员工抢单 → 在线支付 → 完成结算

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vue3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)](https://vuejs.org)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E?logo=nestjs)](https://nestjs.com)
[![uni-app](https://img.shields.io/badge/uni--app-3.x-2B9939)](https://uniapp.dcloud.net.cn)

## 功能亮点

### 店铺可视化装修
![店铺装修](screenshots/page-builder.png)

> 拖拽式 DIY 首页编辑器，17种组件类型，4套预设模板，实时预览，撤销/重做，一键发布。

### 核心功能
- **通用任务接单** — 管理人员上架服务，用户购买下单，员工抢单接单
- **内置聊天** — 与接单者实时 IM 沟通
- **微信支付** — 在线支付 + 平台抽佣
- **保证金制度** — 员工需缴纳保证金并通过认证才能接单
- **退款审核** — 未完成前可申请退款，管理员审核确认
- **微信模板消息** — 订单状态变更实时通知
- **CMS内容管理** — 公告、文章、轮播图后台配置
- **可视化后台** — 拖拽式页面装修编辑器

## 技术架构

`
微信小程序 (uni-app)
Vue3 + Pinia + RemixIcon
        |
    HTTPS API
        |
Nginx (反向代理 + SSL)
        |
    NestJS 后端
TypeORM + MySQL
        |
    Vue3 管理后台
Dashboard | Products | Orders | Builder
`

| 模块 | 技术栈 | 说明 |
|------|--------|------|
| 小程序前端 | uni-app (Vue3) | 一套代码多端运行 |
| 管理后台 | Vue3 + Vite + Pinia | 现代化 SPA |
| 后端服务 | NestJS 10.x | 企业级 Node.js 框架 |
| 图标 | RemixIcon | 2000+ 开源图标 |
| 认证 | JWT + 微信登录 | 双因素认证 |
| ORM | TypeORM 0.3 | 支持 MySQL |
| 实时通信 | Socket.IO | WebSocket 聊天 |
| 支付 | 微信支付 | JSAPI + 回调验签 |
| 数据库 | MySQL 8.0 | 生产环境 |
| 部署 | Docker / PM2 + Nginx | 容器化部署 |

## 快速开始

### 环境要求
- Node.js 18+
- MySQL 8.0（生产环境）
- 微信小程序 AppID（小程序端）

### 安装

`ash
# 克隆项目
git clone https://github.com/Big-Monster-H/order-self-miniprogram.git
cd task-platform

# 安装后端依赖
cd server
npm install
npm run build

# 安装管理后台依赖
cd ../admin
npm install

# 小程序：用 HBuilderX 打开 mini-program/ 目录运行
`

### 管理后台

| 项目 | 详情 |
|------|------|
| 地址 | http://localhost:5173/login |
| 账号 | admin |
| 密码 | admin123 |

### Docker 部署

`ash
# MySQL + NestJS + Nginx 一键启动
docker-compose up -d
`

## 项目结构

`
├── mini-program/            # uni-app 小程序源码
│   ├── pages/               # 主包页面（首页/消息/订单/我的）
│   ├── subpkg/              # 分包（分类/商品/订单/聊天/员工）
│   │   ├── api/             # API 请求封装
│   │   ├── store/           # Pinia 状态管理
│   │   └── static/          # 图标/图片资源
├── admin/                   # Vue3 管理后台
│   └── src/
│       ├── views/           # 15个页面
│       │   └── PageBuilder.vue    # 店铺装修编辑器
│       ├── components/      # CompRenderer / PropsEditor
│       └── api/             # Axios 封装
├── server/                  # NestJS 后端
│   └── src/
│       ├── modules/         # 业务模块
│       │   ├── auth/        # 认证模块
│       │   ├── user/        # 用户模块
│       │   ├── category/    # 分类模块
│       │   ├── product/     # 商品模块
│       │   ├── order/       # 订单模块
│       │   ├── employee/    # 员工模块
│       │   ├── chat/        # 聊天模块
│       │   ├── refund/      # 退款模块
│       │   ├── settlement/  # 结算模块
│       │   ├── cms/         # CMS模块
│       │   └── page-config/ # 页面装修配置
├── nginx.conf               # Nginx 配置
├── init.sql                 # 数据库初始化
└── docker-compose.yml       # Docker 编排
`

## 微信小程序部署

1. 登录 [微信公众平台](https://mp.weixin.qq.com)
2. 配置服务器域名（开发 → 开发管理 → 服务器域名）
   - request合法域名: https://你的域名
   - uploadFile合法域名: https://你的域名
3. 配置隐私接口声明（getLocation / chooseLocation）
4. 微信开发者工具打开 mini-program/dist/build/mp-weixin/
5. 上传代码并提交审核

## 订单流程

`
下单 → 已支付 → 已接单 → 服务中 → 已完成 → 已评价
  ↓                ↓
取消            退款中 → 已退款
`

## License

MIT (c) 2024 Task Platform
