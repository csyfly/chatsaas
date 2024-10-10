# ChatSaaS

一个使用 Next.js 构建的企业级 AI Chat SaaS产品服务模板，适用于开发者快速构建自己的AI Chat SaaS产品服务。

ChatSaaS 提供了一个完整的开源解决方案，可以快速轻松地构建 AI 驱动的Chat SaaS产品服务。

## ⚡ 在线演示

DEMO: [https://chatsaas.chatgoal.net](https://chatsaas.chatgoal.net)

## 🚀 快速开始

### 前提条件

在开始之前，请确保你已经安装了以下内容：

1. [Node.js](https://nodejs.org/) (v18 或更高版本)
2. [PostgreSQL](https://www.postgresql.org/)

### 安装

要开始使用 ChatSaaS，请按照以下步骤操作：

1. 克隆仓库：

```bash
git clone https://github.com/czyfly/chatsaas.git
cd chatsaas
npm install
```

2. 设置环境变量：

```bash
cp .env.example .env
```
注册一个 Clerk 账户，获取 NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY 和 CLERK_SECRET_KEY，然后将它们填写到 .env 文件中。

3. 设置数据库：

```bash
npx prisma generate
npx prisma db push
```

4. 运行开发服务器：

```bash
npm run dev
```

5. 在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看效果。

## ⭐ 功能

- 多模型 AI 聊天支持 (GPT-4, GPT-4o, Azure 等)
- 实时聊天与 WebSocket 集成
- 用户认证和授权
- 订阅管理与PromoCode邀请码对话会员，即将支持Stripe
- 可定制的聊天界面
- 聊天记录和会话管理
- 用户和会话管理的管理仪表板
- 国际化 (i18n) 支持
- SEO 优化
- 适用于移动和桌面的响应式设计
- 自助交换友情链接

## 🛠 技术栈

- **框架**: Next.js
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI 组件**: shadcn/ui
- **状态管理**: Zustand
- **数据库**: 使用 Prisma ORM 的 PostgreSQL
- **认证**: clerk
- **支付**: Stripe（即将推出）
- **部署**: Vercel
- **AI SDK**: Vercel AI SDK

## 📦 项目结构

- `app`: Next.js 应用代码
- `components`: 可重用的 React 组件
- `lib`: 实用函数和共享逻辑
- `app/api`: API 路由
- `prisma`: 数据库架构和迁移
- `public`: 静态资源
- `styles`: 全局样式和 Tailwind 配置

## 📜 许可证

此项目根据 MIT 许可证授权。详情请参阅 [LICENSE](./LICENSE) 文件。

## 🙏 致谢

此项目受到了各种开源聊天应用程序和 SaaS 模板的启发。

## 👨‍💻 贡献者

<a href="https://github.com/czyfly/chatsaas/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=czyfly/chatsaas" />
</a>

由 [contrib.rocks](https://contrib.rocks) 制作。