import { Goal } from "@/lib/prisma";
import { useGoalStore } from "@/store/goalStore";
import { formatDeadline, isOverdue } from '@/lib/utils';
import Link from "next/link";
import StatusIcon from '@/components/StatusIcon';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronRight, MoreVertical } from "lucide-react";
import { updateGoalStatus } from "@/actions/demo";
//import { useError } from '@/components/ErrorContext';
import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useProjectStore } from '@/store/projectStore';
import { useParams } from "next/navigation";


const SubGoalList = ({ filteredGoals, showadd = false }: 
  { filteredGoals: Goal[], showadd: boolean}) => 
{
  const { selectedGoal, setSelectedGoal, goals, 
    fetchGoals, updateGoal, createGoal, deleteGoal, getGoalFromStore} = useGoalStore();
  const { currentProject } = useProjectStore();
  //const { showError } = useError();
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());
  const { lang } = useParams();
  const { userId } = useAuth();
  if (!userId || !currentProject) {
    return null;
  }

  const toggleStatus = async (id: string) => {
    try {
      const updatedGoal = await updateGoalStatus(id);
      fetchGoals(currentProject?.id || '');
      if (selectedGoal && selectedGoal.id === id) {
        setSelectedGoal(updatedGoal);
      } 
    } catch (error) {
      //showError('Failed to update goal status: ' + error);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await deleteGoal(id);
      // if(selectedGoal){
      //     const updatedGoal = await getGoalFromStore(selectedGoal.id);
      //     setSelectedGoal(updatedGoal);
      // }
    } catch (error) {
      //showError('Failed to delete goal: ' + error);
    }
  };

  const toggleSubGoals = async (goalId: string) => {
    setExpandedGoals(prev => {
      const newExpandedGoals = new Set(prev);
      newExpandedGoals.has(goalId) ? newExpandedGoals.delete(goalId) : newExpandedGoals.add(goalId);
      return newExpandedGoals;
    });
  };

  const addNewSubGoal = async (title: string) => {
    try {
      const newGoal = await createGoal({
        title: title,
        description: '',
        priority: 'medium',
        status: 'notStarted',
        creatorId: userId,
        projectId: currentProject?.id || '',
        parentGoalId: selectedGoal?.id || '',
        deadline: new Date(),
        addway: 'manual',
      });
    } catch (error) {
      //showError('Failed to add new subgoal: ' + error);
    }
  };

  const handleProgressUpdate = async (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newProgress = Math.round((x / rect.width) * 100);
    
    try {
      await updateGoal(id, { progress: newProgress ,
        status: newProgress === 100 ? 'completed' : 'inProgress' 
      });
    } catch (error) {
      //showError('Failed to update goal progress: ' + error);
    }
  };

  const renderGoal = (goal: Goal, isSubGoal = false) => (
    <li key={goal.id} >
      <div className={`hover:bg-gray-100 transition-colors duration-200 pl-2 py-1 ${
        selectedGoal?.id === goal.id ? 'bg-gray-200' : ''
        } }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            
            <StatusIcon status={goal.status} onClick={() => toggleStatus(goal.id)} />
            <Link
              href={`/${lang}/demo/${goal.id}`}
              className={`ml-2 font-semibold line-clamp-2 cursor-pointer ${
                isOverdue(goal.deadline) && goal.status !== 'completed' ? 'text-red-500' : ''
              } ${
                goal.status === 'completed' ? 'line-through text-gray-400' : ''
              }`}
            >
              {goal.title}
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical className="h-4 w-4 text-gray-500 hover:text-gray-700" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => handleDeleteGoal(goal.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className={`text-xs ml-6 flex items-center text-gray-400 ${
          isOverdue(goal.deadline) && goal.status !== 'completed' ? 'text-red-500' : 'text-gray-500'
        }`}>
          <span className={`mr-2 font-semibold ${
            goal.priority === 'high' ? 'text-red-500' :
            goal.priority === 'medium' ? 'text-yellow-500' :
            'text-green-500'
          }`}>
            {goal.priority.charAt(0).toUpperCase()}
          </span>
          {formatDeadline(goal.deadline)}
          <div className="w-12 bg-gray-200 rounded-full h-1.5 mt-0 ml-2 cursor-pointer"
            onClick={(e) => handleProgressUpdate(e, goal.id)}>
            <div 
              className="bg-blue-500 h-1.5 rounded-full" 
              style={{ width: `${goal.progress}%` }}
            ></div>
          </div>
          <span className="ml-1 text-xs">{goal.progress}%</span>
          {goal.subGoals && goal.subGoals.length > 0 && (
            <span className="ml-2 text-gray-500" onClick={() => toggleSubGoals(goal.id)}>
              <span className="flex items-center cursor-pointer">
                {goal.subGoals.length} subgoals
                <ChevronDown className="h-3 w-3 mr-1" />
              </span>
            </span>
          )}
        </div>
      </div>
      {goal.subGoals && expandedGoals.has(goal.id) && (
        <ul className="mt-0 ml-4">
          {goal.subGoals.map(subGoal => renderGoal(subGoal, true))}
        </ul>
      )}
    </li>
  );

  return (
    <>
      {showadd && <div className="mt-0 px-2 text-sm">
        <input
          type="text"
          placeholder="Fast add new ..."
          className="w-full px-3 py-1 mb-2 rounded-full border focus:outline-none focus:ring-0 focus:ring-gray-300"
          onKeyPress={async (e) => {
            if (e.key === 'Enter') {
              const input = e.target as HTMLInputElement;
              const newGoal = input.value.trim();
              if (newGoal) {
                await addNewSubGoal(newGoal);
                input.value = '';
              }
            }
          }}
        />
      </div>}
      <ul className="">
        {filteredGoals && filteredGoals.map(goal => renderGoal(goal))}
      </ul>
    </>
  );
}

export default SubGoalList;

