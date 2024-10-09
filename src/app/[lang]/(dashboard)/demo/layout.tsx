'use client'
import React, { useEffect } from 'react';
import GoalList from '@/components/demo/GoalList';
import { useGoalStore } from '@/store/goalStore';
import AIChat from '@/components/chat/AIChat';
import { useParams } from 'next/navigation';
import { useProjectStore } from '@/store/projectStore';

const GoalLayout = ({ children }: { children: React.ReactNode }) => {
  const { goals, setGoals, fetchGoals, 
    selectedGoal, getGoalFromStore, setSelectedGoal } = useGoalStore();
  const { currentProject } = useProjectStore();
  const { id } = useParams();
  //console.log("目标ID:", id);

  useEffect(() => {
    console.log("enter goal layout");
    if (currentProject) {
      const fetchGoalsAsync = async () => {
        console.log("start fetch goals");
        const goals = await fetchGoals(currentProject.id);
        console.log("goals=", goals);
        if (id) {
          const goal = await getGoalFromStore(id as string);
          console.log("selected goal=", goal);
          setSelectedGoal(goal);
        }
      };
      fetchGoalsAsync();
    }
  }, [fetchGoals, currentProject, id]);

  return (
    <div className="flex h-full w-full">
      {/* 左侧栏，宽度为1/4 */}
      <div className="w-1/4 flex-shrink-0 border-r p-0 overflow-y-auto min-w-80">
        <GoalList islong={false} title="Demo" />
      </div>
      {/* 右侧栏，宽度为3/4，包含中间内容和AI聊天 */}
      <div className="w-3/4 flex-shrink-0 flex flex-col md:flex-row">
        {/* 中间内容，在小屏幕上全宽，大屏幕上宽度为1/2 */}
        <div className="w-full md:w-1/2 overflow-y-auto border-r p-0">
          {children}
        </div>
        {/* AI聊天，在小屏幕上全宽，大屏幕上宽度为1/2 */}
        <div className="w-full md:w-1/2 p-2 overflow-y-auto">
          <AIChat goalId={selectedGoal?.id} key={selectedGoal?.id}/>
        </div>
      </div>
    </div>
  );
};

export default GoalLayout;
