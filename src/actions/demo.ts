"use server"

import prisma from '@/lib/prisma';
import { Goal, Plan } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function getGoals(projectId: string): Promise<Goal[]> {
  try {
    // 从数据库中获取所有目标，并按截止时间排序
    const goals = await prisma.goal.findMany({
      where: {
        projectId: projectId
      },
      orderBy: [{
        deadline: 'asc',
      },{
        createdAt: 'asc'
      }],
      include: {
        parentGoal: true
      }
    });
    return goals as Goal[];
  } catch (error) {
    // 错误处理
    console.error('获取目标失败:', error);
    throw error;
  }
}

export async function getGoalFromDB(id: string): Promise<Goal | null> {
  try {
    const goal = await prisma.goal.findUnique({
      where: { id }
    });
    return goal || null;
  } catch (error) {
    console.error('获取目标失败:', error);
    throw error;
  }
}

export async function addNewGoalToDatabase(newGoalTitle: string, userId: string, projectId: string) {
  try {
    const newGoal = await prisma.goal.create({
      data: {
        title: newGoalTitle,
        status: 'notStarted',
        priority: 'medium',
        creatorId: userId,
        deadline: new Date(new Date().getFullYear(), 11, 31), // 默认截止日期为当年最后一天
        projectId: projectId,
        addway: 'manual',
      },
    });
    return newGoal;
  } catch (error) {
    console.error('Failed to add new goal:', error);
    throw error;
  }
}

export async function createGoal(data: Partial<Goal>) {
  try {
    const newGoal = await prisma.goal.create({
      data: data as Prisma.GoalCreateInput,
    });
    return newGoal;
  } catch (error) {
    console.error('Failed to create goal:', error);
    throw error;
  }
}

export async function updateGoalStatus(goalId: string, value?: string) {
  try {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!goal) {
      throw new Error('Goal not found');
    }

    const newStatus = value ? value : goal.status === 'notStarted' ? 'inProgress' : 
                      goal.status === 'inProgress' ? 'completed' : 'inProgress';
    // 如果新状态是已完成，则将进度设置为100%
    const updatedData: { status: string; progress?: number } = { status: newStatus };
    if (newStatus === 'completed') {
      updatedData.progress = 100;
    }else if (newStatus === 'inProgress') {
        updatedData.progress = 10;
    }else if (newStatus === 'notStarted') {
        updatedData.progress = 0;
    }else if (newStatus === 'suspended') {
        updatedData.progress = updatedData.progress == 100 ? 50 : updatedData.progress;
    }

    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: updatedData,
    });

    return updatedGoal;
  } catch (error) {
    console.error('Error updating goal status:', error);
    throw error;
  }
}

export async function updateGoal(id: string, data: Partial<Goal>) {
  try {
    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: data as Prisma.GoalUpdateInput,
    });
    return updatedGoal;
  } catch (error) {
    console.error('Update goal failed:', error);
    throw error;
  }
}

export async function deleteGoalFromDatabase(goalId: string) {
  try {
    await prisma.goal.delete({
      where: { id: goalId },
    });
    return true;
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
}

export async function searchGoals(projectId: string, searchTerm: string): Promise<Goal[]> {
  try {
    const goals = await prisma.goal.findMany({
      where: {
        projectId: projectId,
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      orderBy: [{
        deadline: 'asc',
      },{
        createdAt: 'asc'
      }],
    });
    return goals;
  } catch (error) {
    // 错误处理
    console.error('搜索目标失败:', error);
    throw error;
  }
}

export async function getGoalStatistics(projectId: string): Promise<{
  total: number;
  completed: number;
  inProgress: number;
  expired: number;
}> {
  try {
    const currentDate = new Date();

    const [total, completed, inProgress, expired] = await Promise.all([
      prisma.goal.count({ where: { projectId } }),
      prisma.goal.count({ where: { projectId, status: 'completed' } }),
      prisma.goal.count({ 
        where: { 
          projectId, 
          status: 'inProgress'
        } 
      }),
      prisma.goal.count({ 
        where: { 
          projectId,
          status: { not: 'completed' },
          deadline: { lt: currentDate }
        } 
      })
    ]);

    return { total, completed, inProgress, expired };
  } catch (error) {
    console.error('获取目标统计信息失败:', error);
    throw error;
  }
}

export async function getAIGeneratedGoalStatistics(projectId: string): Promise<{
  total: number;
  aicount: number;
  airatio: number;
  timesaved: number;
  efficiency: number;
}> {
  try {
    const total = await prisma.goal.count({ where: { projectId } });
    const aicount = await prisma.goal.count({ where: { projectId, addway: 'ai' } });
    const airatio = Number((aicount * 100 / total).toFixed(2));
    const timesaved = Number((aicount / 2).toFixed(2));
    const efficiency = Number((100 + airatio).toFixed(2));

    return { total, aicount, airatio, timesaved, efficiency };
  } catch (error) {
    console.error('获取AI生成目标统计信息失败:', error);
    throw error;
  }
}


