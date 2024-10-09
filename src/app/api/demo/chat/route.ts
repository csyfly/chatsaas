import { streamText, convertToCoreMessages } from 'ai'; // 导入保存消息的函数
import { getGoalFromDB } from '@/actions/demo'; // 导入获取目标的函数
import { getSystemMessage } from './prompt';
import { z } from 'zod';
import { getUser } from '@/actions/user';
import { getCreateGoalTool, getUpdateGoalTool } from '@/actions/tools';
import { getAIModel } from '@/actions/model';
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
// export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json() as { messages: any };
  //console.log("POST messages", messages);

  const conversationId = req.headers.get('x-conversation-id')
  const userId = req.headers.get('x-user-id')
  const goalId = req.headers.get('x-goal-id')
  const projectId = req.headers.get('x-project-id')
  if (!conversationId || !userId || !projectId) {
    return new Response('Missing conversation or user ID or project ID', { status: 400 });
  }

  //console.log("POST goalId: ", goalId, messages[messages.length - 1].content);

  let context = ''
  // 获取目标信息
  if (goalId) {
    const goal = await getGoalFromDB(goalId);
    if (goal) { 
      context = `
      id：${goal.id}
      title：${goal.title}
      deadline：${goal.deadline}
      detail：${goal.description}
      progress：${goal.progress}
      result：${goal.result}
      `;
      //console.log("goalContext", goalContext);
    } 
  } 

  let userInfo = ''
  // 获取用户信息
  if (userId) {
    const user = await getUser(userId);
    if (user) {
      userInfo = `
      userId：${user.id}
      name：${user.name}
      email：${user.email}
      job：${user.job}
      gender：${user.gender}
      position：${user.position}
      skill：${user.skill}
      personality：${user.personality}
      `;
    }
  }
  
  const model = await getAIModel('gpt4o');
  if (!model) {
    return new Response('Model config not found', { status: 404 });
  }

  const systemMessage = getSystemMessage(context, userInfo);
  // 只取最近3轮会话
  const recentMessages = messages.slice(-6);  // 每轮包含用户和AI的消息，所以乘以2
  // 如果消息少于3轮，则使用所有可用消息
  const messagesToUse = recentMessages.length < 6 ? messages : recentMessages;
  const result = await streamText({
    model: model,
    messages: convertToCoreMessages([systemMessage, ...messagesToUse]),
    onFinish: async (completion) => {
      // console.log("onFinish completion: ", completion.text, completion.finishReason);
    },
    onChunk: (chunk) => {
      //console.log("onChunk: ", chunk);
    },
    tools: {
      updateGoal: getUpdateGoalTool(userId, projectId, goalId),
      createGoal: getCreateGoalTool(userId, projectId),
      askForConfirmation: { //client端调用
        description: 'Ask the user for confirmation.',
        parameters: z.object({
          message: z.string().describe('The message to ask for confirmation.'),
        }),
      },
    },
    toolChoice: 'auto',
    maxToolRoundtrips:5
  });

  return result.toDataStreamResponse();
}