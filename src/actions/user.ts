'use server'

import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';
import { addMonths, isBefore, parseISO } from 'date-fns';
import { createProject } from '@/actions/project';

export async function createOrGetUser(userId: string, userName?: string|null, userEmail?: string|null) {
  try {
    // 尝试查找用户
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // 如果用户不存在，则创建新用户
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          name: userName || '',
          email: userEmail || ''
          // 可以根据需要添加其他默认字段
        },
      });
      const defaultProject = await createProject({
        name: 'default',
        description: 'default project',
        creatorId: userId,
      });
    }

    return user;
  } catch (error) {
    console.error('创建或获取用户失败:', error);
    throw error;
  }
}

export async function getUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  } catch (error) {
    console.error('获取用户失败:', error);
    throw error;
  }
}

export async function updateUser(userId: string, user: Partial<User>) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: user,
    });
    return updatedUser;
  } catch (error) {
    console.error('更新用户失败:', error);
    throw error;
  }
}

export async function checkAndResetUserProCounter(user: User) {
  try {
    if(!user){
      return null;
    }
    const currentDate = new Date();
    const lastBillingDate = user.curBillingMonth;

    let newBillingDate = lastBillingDate;
    while (isBefore(addMonths(newBillingDate, 1), currentDate)) {
      newBillingDate = addMonths(newBillingDate, 1);
    }

    if (newBillingDate > lastBillingDate) {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          useAICount: 0,
          curBillingMonth: newBillingDate,
        },
      });

      console.log(`用户 ${user.id} 的Pro计数器已重置`);
      return updatedUser;
    } else {
      console.log(`用户 ${user.id} 的Pro计数器无需重置`);
      return user;
    }
  } catch (error) {
    console.error('检查和重置用户Pro计数器失败:', error);
    throw error;
  }
}
