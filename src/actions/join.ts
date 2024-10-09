'use server'
import prisma  from '@/lib/prisma';

export async function joinWaitlist(email: string): Promise<boolean> {
  try {
    // 检查邮箱是否已经在等待列表中
    const existingUser = await prisma.waitList.findUnique({
      where: { email },
    });

    if (existingUser) {
      // 邮箱已存在,返回false
      return false;
    }

    // 将新用户添加到等待列表
    await prisma.waitList.create({
      data: { email },
    });

    // 成功添加,返回true
    return true;
  } catch (error) {
    console.error('加入等待列表时出错:', error);
    throw error;
  }
}
