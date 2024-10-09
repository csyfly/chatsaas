'use server'
import prisma from '@/lib/prisma';
import { FriendlyLink } from '@prisma/client';
import * as cheerio from 'cheerio';

export async function fetchLinkInfo(url: string, checkurl: string) {
  console.log('fetchLinkInfo url:', url);
  const response = await fetch(url);  
  const html = await response.text();

  const $ = cheerio.load(html);
  
  const logoHref = $('link[rel="icon"]').attr('href') || '';
  const logoUrl = logoHref ? new URL(logoHref, url).href : 'No logo found';
  // 检查页面中是否包含指定的URL
  const containsCheckUrl = $('body').text().includes(checkurl) || $('a[href*="' + checkurl + '"]').length > 0;

  return {
    title: $('title').text().trim() || 'No title found',
    description: $('meta[name="description"]').attr('content') || 'No description found',
    logo: logoUrl,
    containsCheckUrl: containsCheckUrl
  };
}

export async function getFriendlyLinks() {
  try {
    const links = await prisma.friendlyLink.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        url: true,
        name: true,
        description: true,
        logo: true,
      },
      orderBy: {
        createdAt: 'desc', // 按创建时间降序排列
      },
    });
    return links;
  } catch (error) {
    console.error('获取友情链接时出错:', error);
    throw error;
  }
}

export async function createFriendlyLink(data: {
  url: string;
  name: string;
  description: string;
  logo: string;
  creatorId: string;
}) {
  try {
    const newLink = await prisma.friendlyLink.create({
      data: {
        url: data.url,
        name: data.name,
        description: data.description,
        logo: data.logo,
        isActive: true, // 默认设置为激活状态
        creatorId: data.creatorId
      },
    });
    return newLink;
  } catch (error) {
    console.error('创建友情链接时出错:', error);
    throw error;
  }
}

