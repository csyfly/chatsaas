import React from 'react';
import { FaRegFrown, FaPaperPlane } from 'react-icons/fa';

import { addNewGoalToDatabase } from '@/actions/demo';
import { useAuth } from '@/lib/auth';
import { useGoalStore } from '@/store/goalStore';
import SubGoalList from '@/components/demo/SubGoalList';
import { useProjectStore } from '@/store/projectStore';
import { useParams, useRouter } from 'next/navigation';

interface GoalListProps {
  islong: boolean;
  title: string;
}

const GoalList: React.FC<GoalListProps> = ({ islong, title }) => {
  const { goals, selectedGoal, setSelectedGoal, fetchGoals } = useGoalStore();
  const { userId } = useAuth();
  const { lang } = useParams();
  const router = useRouter();
  //const { showError } = useError();
  const { currentProject } = useProjectStore();
  const addNewGoal = async (newGoalTitle: string) => {
    console.log('userId:', userId);
    console.log('currentProject:', currentProject);
    if (!userId || !currentProject) {
      //showError('User not authenticated Or No current project');
      return;
    }
    try {
      const newGoal = await addNewGoalToDatabase(newGoalTitle, userId, currentProject.id);
      fetchGoals(currentProject.id);
      setSelectedGoal(newGoal);
      router.push(`/${lang}/demo/${newGoal.id}`);
    } catch (error) {
      //showError('Failed to add new goal: '+error);
    }
  };

  // 根据 islong 参数过滤目标
  const filterGoals = () => {
    const now = new Date();
    const nextYear = new Date(now.getFullYear() + 1, 0, 1); // 下一年的1月1日

    return goals.filter(goal => {
      const goalDeadline = new Date(goal.deadline);
      if (islong) {
        return goalDeadline >= nextYear;
      } else {
        return goalDeadline < nextYear && goalDeadline.getFullYear() === now.getFullYear();
      }
    });
  };

  const filteredGoals = goals;

  const handleSendClick = async () => {
    const input = document.getElementById('goal-input') as HTMLInputElement;
    const newGoal = input.value.trim();
    if (newGoal) {
      await addNewGoal(newGoal);
      input.value = '';
    }
  };

  return (
    <>
    <h2 className="text-2xl font-semibold mb-0 px-2 pt-2 pb-0">{title}</h2>
      {!islong && <div className="mt-0 px-2 text-sm flex items-center relative">
        <input
          id="goal-input"
          type="text"
          placeholder="Fast add new ..."
          className="w-full px-3 py-1 mb-2 rounded-full border focus:outline-none focus:ring-0 focus:ring-gray-300 pr-10"
          onKeyPress={async (e) => {
            if (e.key === 'Enter') {
              const input = e.target as HTMLInputElement;
              const newGoal = input.value.trim();
              if (newGoal) {
                await addNewGoal(newGoal);
                input.value = '';
              }
            }
          }}
        />
        <FaPaperPlane 
          className="absolute w-4 h-4 right-4 top-4 transform -translate-y-1/2 text-blue-500 cursor-pointer"
          onClick={handleSendClick}
        />
      </div>}
      {filteredGoals.length === 0 ? (
        <div className="flex justify-center items-center mt-4">
          <FaRegFrown className="text-gray-500 mr-2" />
          <span className="text-gray-500">No plans available</span>
        </div>
      ) : (
        <SubGoalList filteredGoals={filteredGoals} showadd={false} />
      )}
    </>
  );
};

export default GoalList;
