# ChatSaaS

An enterprise-grade AI Chat SaaS product service template built with Next.js.

ChatSaaS provides a complete, open-source solution for building AI-powered chat SaaS product services quickly and easily.

[中文文档](./README_zh.md)

## ⚡ Live Demo

Try it out for yourself!

Demo Server: [https://chatsaas.chatgoal.net](https://chatsaas.chatgoal.net)

## 🚀 Getting Started

### Prerequisites

Before you start, make sure you have the following installed:

1. [Node.js](https://nodejs.org/) (v18 or later)
2. [PostgreSQL](https://www.postgresql.org/)

### Installation

To get started with ChatSaaS, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/czyfly/chatsaas.git
cd chatsaas
npm install
```

2. Set up the environment variables:

```bash
cp .env.example .env
```
Register a Clerk account, obtain the NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY, and then fill them in the .env file.


3. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## ⭐ Features

- Multi-model AI chat support (GPT-4, GPT-4o, Azure, etc.)
- Real-time chat with WebSocket integration
- User authentication and authorization
- Subscription management with PromoCode, or Stripe(coming soon)
- Customizable chat interface
- Chat history and conversation management
- Admin dashboard for user and conversation management
- Internationalization (i18n) support
- SEO optimization
- Responsive design for mobile and desktop
- Self-service friendly link exchange

## 🛠 Tech Stack

- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: clerk
- **Payment**: Stripe(coming soon)
- **Deployment**: Vercel
- **AI SDK**: Vercel AI SDK

## 📦 Project Structure

- `app`: Next.js application code
- `components`: Reusable React components
- `lib`: Utility functions and shared logic
- `pages/api`: API routes
- `prisma`: Database schema and migrations
- `public`: Static assets
- `styles`: Global styles and Tailwind config

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgements

This project was inspired by various open-source chat applications and SaaS boilerplates.

## 👨‍💻 Contributors

<a href="https://github.com/czyfly/chatsaas/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=czyfly/chatsaas" />
</a>

Made with [contrib.rocks](https://contrib.rocks).
