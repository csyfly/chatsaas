import { tool } from "ai";
import { z } from "zod";
import { marked } from 'marked';
import { updateGoal, createGoal } from "@/actions/demo";

export const getUpdateGoalTool = (userId: string, projectId: string, goalId: string|null) => {
    return tool({
      description: 'Update and save the goal',
      parameters: z.object({
        title: z.string().optional().describe('Goal title, O'),
        description: z.string().optional().describe('Goal description, KR'),
        result: z.string().optional().describe('Goal execution result'),
        progress: z.number().optional().describe('Goal execution progress, 0-100'),
        deadline: z.string().optional().describe('Goal deadline, format: YYYY-MM-DD'),
      }),
      execute: async ({ title, description, result, progress, deadline }) => {
        console.log("tool callto execute updateGoal: ", title, description, result, progress, deadline);
        // 将 description 和 result 从 Markdown 转换为 HTML
        description = description ? await marked.parse(description) : undefined;
        result = result ? await marked.parse(result) : undefined;

        if (goalId) {
          const goal = await updateGoal(goalId, { 
            title, 
            description, 
            result, 
            progress,
            deadline: deadline ? new Date(deadline) : undefined, 
            addway: 'ai',
          });
          return "Update goal successfully";
        } 
      },
    })
}

export const getCreateGoalTool = (userId: string, projectId: string ) => {
  return tool({
    description: 'create goal or sub-goal (deadline within 1 year) ',
    parameters: z.object({
      title: z.string().describe('goal title'),
      description: z.string().describe('goal description, KR format'),
      deadline: z.string().describe('Deadline of the goal, format: YYYY-MM-DD'),
      parentGoalId: z.string().optional().describe('Parent goal ID, if it is a sub-goal'),
    }),
    execute: async ({ title, description, deadline, parentGoalId }) => {
        console.log("tool callto execute createGoal: ", title, description, deadline, parentGoalId);
        const parsedDescription = await marked.parse(description);
        const createdShortGoal = await createGoal({
          title,
          description: parsedDescription,
          deadline: deadline ? new Date(deadline) : new Date(new Date().getFullYear(), 11, 31), // 默认截止日期为当年最后一天
          creatorId: userId || '',
          projectId,
          parentGoalId,
          priority:'medium',
          status:'notStarted',
          addway: 'ai',
        });
        return `Create goal successfully: ${title}`;
    },
  })
}

