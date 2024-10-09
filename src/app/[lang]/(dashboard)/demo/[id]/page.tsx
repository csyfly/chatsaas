'use client'
import React, { useEffect } from 'react';
import GoalDetail from '@/components/demo/GoalDetail';
import { useGoalStore } from '@/store/goalStore';

// export const runtime = 'edge';

interface GoalPageProps {
  params: {
    id?: string;
  };
}

const GoalPage = ({ params }: GoalPageProps) => {
  const { id } = params;
  const { selectedGoal, setSelectedGoal, goals, fetchGoals } = useGoalStore();
  //const { showError } = useError();
  //console.log("enter goal page id=", id);

  useEffect(() => {
    if (id) {
      //console.log("useEffect enter goal page id=", id);
      
    }
  }, [id]);

  if (!selectedGoal) {
    return <div></div>;
  }

  return <GoalDetail />;
};

export default GoalPage;