import { create } from 'zustand';
import { Goal, Project } from '@/lib/prisma';
import { getGoals, updateGoal, deleteGoalFromDatabase, createGoal } from '@/actions/demo';
import { getAllProjects } from '@/actions/project';
import { Prisma } from '@prisma/client';
import { useGoalStore } from './goalStore';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;

  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  fetchProjects: (id: string) => Promise<void>;
  //reloadCurrentGoal: () => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,

  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  fetchProjects: async (id: string) => {
    const fetchedProjects = await getAllProjects(id);
    set({ projects: fetchedProjects });
  },
  // reloadCurrentGoal: async () => {
  //   const { selectedGoal } = useGoalStore();
  //   //todo
  // },
}));