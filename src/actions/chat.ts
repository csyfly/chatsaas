"use server"

import prisma from '@/lib/prisma';
import { Goal, Conversation, ChatMessage } from '@prisma/client';

export async function getOrCreateConversations(creatorId: string, goalId?: string|null): Promise<Conversation[]> {
  if(!creatorId) return [];
  console.log("getOrCreateConversations:", goalId, creatorId);
  let where = {
    goalId: goalId,
    creatorId: creatorId
  };
  if (!goalId ) {
    where = {
      creatorId: creatorId,
      goalId: null,
    };
  }

  try {
    let conversations = await prisma.conversation.findMany({
      where: where as any,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 如果没有找到会话，创建一个新的
    if (conversations.length === 0) {
      const newConversation = await prisma.conversation.create({
        data: {
          title: 'New Chat',
          goalId: goalId || null,
          creatorId: creatorId,
        },
      });
      conversations = [newConversation];
    }

    //console.log("getOrCreateConversations:", conversations);
    return conversations;
  } catch (error) {
    console.error('获取或创建会话失败:', error);
    return [];
  }
}

// 新增函数：根据会话id获取消息列表
export async function getMessagesByConversationId(conversationId: string) {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: {
        conversationId: conversationId
      },
      orderBy: {
        createdAt: 'asc'
      },
      
    });
    return messages;
  } catch (error) {
    console.error('获取消息列表失败:', error);
    return [];
  }
}

// 新增函数：保存聊天消息
export async function saveChatMessage(message: {
  id: string;
  role: string;
  content: string;
  conversationId: string;
  creatorId: string;
}) {
  try {
    //console.log("saveChatMessage", message);
    const savedMessage = await prisma.chatMessage.create({
      data: {
        id: message.id,
        role: message.role,
        content: message.content,
        conversationId: message.conversationId,
        creatorId: message.creatorId
      }
    });
    // 更新用户的 AI 使用次数，只有assistant的消息才算
    if(message.role === 'assistant'){
      const user = await prisma.user.update({
        where: { id: message.creatorId },
        data: { useAICount: { increment: 1 } }
      });
    }
    return savedMessage;
  } catch (error) {
    console.error('保存聊天消息失败:', error);
    throw error; // 抛出错误以便调用者处理
  }
}

// 新增函数：删除聊天消息
export async function deleteChatMessage(messageId: string) {
  try {
    const deletedMessage = await prisma.chatMessage.delete({
      where: {
        id: messageId
      }
    });
    return deletedMessage;
  } catch (error) {
    console.error('删除聊天消息失败:', error);
    throw error; // 抛出错误以便调用者处理
  }
}

// 新增函数：创建新会话
export async function createNewConversation(data: {
  title: string;
  goalId?: string;
  planId?: string;
  creatorId?: string|null;
}) {
  try {
    const newConversation = await prisma.conversation.create({
      data: {
        title: data.title,
        goalId: data.goalId,
        planId: data.planId,
        creatorId: data.creatorId || '',
      },
    });
    return newConversation;
  } catch (error) {
    console.error('创建新会话失败:', error);
    throw error; // 抛出错误以便调用者处理
  }
}
