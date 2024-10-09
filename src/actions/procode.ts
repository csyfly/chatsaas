"use server"

import prisma from '@/lib/prisma';

export async function getPromoCode(code: string) {
  try {
    const promoCode = await prisma.promoCode.findUnique({
      where: {
        code: code,
      },
      include: {
        usedBy: true,
      },
    });
    return promoCode;
  } catch (error) {
    console.error('获取PromoCode时出错:', error);
    throw error;
  }
}

export async function getPromoCodes() {
  try {
    const promoCodes = await prisma.promoCode.findMany({
      include: {
        usedBy: true,
      },
    });
    return promoCodes;
  } catch (error) {
    console.error('获取PromoCodes时出错:', error);
    throw error;
  }
}

export async function createPromoCode(code: string, days: number, description: string) {
  try {
    const promoCode = await prisma.promoCode.create({
      data: {
        code: code,
        days: days,
        description: description,
      },
    });
    return promoCode;
  } catch (error) {
    console.error('创建PromoCode时出错:', error);
    throw error;
  }
}

export async function upgradePromoCode(code: string, userId: string) {
  try {
    // 先获取当前的 PromoCode
    const existingPromoCode = await prisma.promoCode.findUnique({
      where: { code },
    });

    // 检查 PromoCode 是否存在
    if (!existingPromoCode) {
      throw new Error('Code not found');
    }

    // 检查是否已过期
    if (existingPromoCode.expiredAt && existingPromoCode.expiredAt < new Date()) {
      throw new Error('Code expired');
    }

    // 检查是否已被使用
    if (existingPromoCode.isUsed) {
      throw new Error('Code already used');
    }
    const promoCode = await prisma.promoCode.update({
      where: {
        code,
      },
      data: {
        usedById: userId,
        usedAt: new Date(),
        isUsed: true,
      },
    });
    // 更新用户信息
    await prisma.user.update({
      where: { id: userId },
      data: {
        proExpiredTime: new Date(Date.now() + existingPromoCode.days * 24 * 60 * 60 * 1000),
        isPro: true,
        useAICount: 0,
        maxUseAICount: parseInt(process.env.MAX_AICOUNT || '3000'),
        curBillingMonth: new Date(),
      },
    });
    return promoCode;
  } catch (error) {
    console.error('使用PromoCode时出错:', error);
    throw error;
  }
}

