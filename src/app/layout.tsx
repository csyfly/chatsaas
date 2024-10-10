import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from 'next/headers';

const inter = Inter({ subsets: ["latin"] });
// export const runtime = 'edge';

export const metadata: Metadata = {
  title: "ChatSaaS - AI-Powered SaaS Starter Kit",
  description: "ChatSaaS is an AI-driven platform designed to streamline your business operations, enhance customer engagement, and drive growth through intelligent automation.",
  keywords: "AI SaaS, business automation, customer engagement, growth, intelligent automation, AI platform, business operations, ChatSaaS",
  // 添加规范链接
  alternates: {
    canonical: 'https://chatsaas.chatgoal.net/',
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
