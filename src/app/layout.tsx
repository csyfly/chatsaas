import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from 'next/headers';

const inter = Inter({ subsets: ["latin"] });
// export const runtime = 'edge';

export const metadata: Metadata = {
  title: "ChatSaaS - AI-Powered Personal Goal Coach",
  description: "Achieve your goals with ChatSaaS, an AI-powered personal coach that helps you set clear objectives, break them into manageable steps, create actionable plans, and execute them efficiently.",
  keywords: "AI coach, goal setting, okr, personal development, productivity, action planning, goal achievement, artificial intelligence, self-improvement",
  // 添加规范链接
  alternates: {
    canonical: 'https://chatsaas.net/en',
  },
};

export async function generateStaticParams() {
  return [{ lang: 'en' }]
}

export default function RootLayout({
  children, params:{lang}
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  return (
    <ClerkProvider>
      <html lang={lang}>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
