import { create } from 'zustand';
import { Goal, Project } from '@/lib/prisma';
import { getGoals, updateGoal, deleteGoalFromDatabase, createGoal } from '@/actions/demo';
import { getAllProjects } from '@/actions/project';
import { Prisma } from '@prisma/client';
import { useProjectStore } from '@/store/projectStore';

interface GoalState {
  goals: Goal[];
  selectedGoal: Goal | null;

  setGoals: (goals: Goal[]) => void;
  setSelectedGoal: (goal: Goal | null) => void;
  fetchGoals: (projectId: string) => Promise<Goal[]>;
  updateGoal: (id: string, goal: Partial<Goal>) => Promise<Goal>;
  deleteGoal: (goalId: string) => Promise<void>;
  createGoal: (goal: Partial<Goal>) => Promise<Goal>;
  getGoalFromStore: (targetId: string) => Promise<Goal | null>;
  reloadCurrentGoal: () => Promise<void>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  selectedGoal: null,
  projects: [],
  currentProject: null,
  setGoals: (goals) => set({ goals }),
  setSelectedGoal: (goal) => set((state) => {
    return { selectedGoal: goal};
  }),
  fetchGoals: async (projectId: string) => {
    const goalsMap = new Map<string, Goal>();
    const rootGoals: Goal[] = [];
    if(projectId === ''){
      return [];
    }

    const fetchedGoals = await getGoals(projectId);
    // 首先将所有目标添加到 Map 中
    fetchedGoals.forEach(goal => {
      goalsMap.set(goal.id, { ...goal, subGoals: [] });
    });

    // 然后遍历所有目标，将子目标添加到父目标的 subGoals 数组中
    fetchedGoals.forEach(goal => {
      if (goal.parentGoalId) {
        const parentGoal = goalsMap.get(goal.parentGoalId);
        if (parentGoal && parentGoal.subGoals) {
          parentGoal.subGoals.push(goalsMap.get(goal.id)!);
        }
      } else {
        rootGoals.push(goalsMap.get(goal.id)!);
      }
    });

    set({ goals: rootGoals });
    console.log("fetchGoals----rootGoals", rootGoals);
    return rootGoals;
  },
  updateGoal: async (id: string, goal: Partial<Goal>) => {
    const updatedGoal = await updateGoal(id, goal);
    const { currentProject } = useProjectStore.getState();
    if (currentProject) {
      await get().fetchGoals(currentProject.id);
    }
    // 更新 selectedGoal
    const { selectedGoal } = get();
    if (selectedGoal && selectedGoal.id === id) {
      set({ selectedGoal: await get().getGoalFromStore(id) });
    }
    return updatedGoal;
  },
  deleteGoal: async (goalId: string) => {
    await deleteGoalFromDatabase(goalId);
    const { currentProject } = useProjectStore.getState();
    if (currentProject) {
      await get().fetchGoals(currentProject.id);
    }
    // 如果删除的是当前选中的目标
    const { selectedGoal } = get();
    if (selectedGoal && selectedGoal.id === goalId) {
      set({ selectedGoal: null });
    }
    if(selectedGoal ){
      const updatedGoal = await get().getGoalFromStore(selectedGoal.id);
      set({ selectedGoal: updatedGoal });
      console.log("deleteGoal----selectedGoal", selectedGoal);
    }
  },
  createGoal: async (goal: Partial<Goal>) => {
    const newGoal = await createGoal(goal);
    const { currentProject } = useProjectStore.getState();
    if (currentProject) {
      await get().fetchGoals(currentProject.id);
    }
    const { selectedGoal } = get();
    if(selectedGoal ){
      const updatedGoal = await get().getGoalFromStore(selectedGoal.id);
      set({ selectedGoal: updatedGoal });
    }
    return newGoal;
  },
  getGoalFromStore: async (targetId: string) => {
    const { goals } = get();
    
    // 递归函数来遍历目标及其子目标
    const findGoalById = (goals: Goal[], targetId: string): Goal | null => {
      for (const goal of goals) {
        if (goal.id === targetId) {
          return goal;
        }
        if (goal.subGoals && goal.subGoals.length > 0) {
          const foundInSubGoals = findGoalById(goal.subGoals, targetId);
          if (foundInSubGoals) {
            return foundInSubGoals;
          }
        }
      }
      return null;
    };

    const foundGoal = findGoalById(goals, targetId);
    if (foundGoal) {
      return foundGoal;
    } else {
      console.log("未找到目标");
      return null;
    }
  },
  reloadCurrentGoal: async () => {
    const { currentProject } = useProjectStore.getState();
    if (currentProject) {
      await get().fetchGoals(currentProject.id);
    }
    const { selectedGoal } = get();
    if (selectedGoal) {
      const updatedGoal = await get().getGoalFromStore(selectedGoal.id);
      set({ selectedGoal: updatedGoal });
    }
  },
}));