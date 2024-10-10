"use server"

import prisma from '@/lib/prisma';
import { Project } from '@prisma/client';

// 创建新项目
export async function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) {
  return prisma.project.create({ data });
}

// 获取指定用户的所有项目
export async function getAllProjects(userId: string) {
  return prisma.project.findMany({
    where: { creatorId: userId }
  });
}

// 根据ID获取单个项目
export async function getProjectById(id: string) {
  return prisma.project.findUnique({ where: { id } });
}

// 更新项目
export async function updateProject(id: string, data: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) {
  return prisma.project.update({
    where: { id },
    data,
  });
}

// 删除项目
export async function deleteProject(id: string) {
  try {
    // 检查项目是否有关联的目标或任务
    const projectWithRelations = await prisma.project.findUnique({
      where: { id },
      include: { goals: true }
    });

    if (projectWithRelations?.goals.length) {
      return { error: '无法删除包含目标或任务的项目。' };
    }

    // 如果没有关联的目标或任务，则删除项目
    await prisma.project.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { error: '删除项目时发生错误。' };
  }
}
