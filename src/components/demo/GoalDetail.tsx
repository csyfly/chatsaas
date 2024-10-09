import React, { useState, useEffect } from 'react';
import { Save, Goal, ArrowUpCircle } from 'lucide-react';
import { Plan } from '@/lib/prisma';
import { Progress } from '@/components/ui/progress';
import StatusIcon from '@/components/StatusIcon';
import { updateGoalStatus } from '@/actions/demo'; // 导入 action
//import { useError } from '@/components/ErrorContext';
import { useGoalStore } from '@/store/goalStore';
// 导入 shadcn 日期选择器组件
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDate, simpleHash } from '@/lib/utils';
import RichTextEditor from '@/components/RichTextEditor';
import SubGoalList from '@/components/demo/SubGoalList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProjectStore } from '@/store/projectStore';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { isOverdue } from '@/lib/utils';  

interface GoalDetailProps {
    
}

const GoalDetail: React.FC<GoalDetailProps> = ({  }) => {
  //const { showError } = useError();
  const { selectedGoal, setSelectedGoal, fetchGoals, updateGoal } = useGoalStore();
  const { currentProject } = useProjectStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(selectedGoal?.title || '');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  // 移除 editedDescription 状态，因为 RichTextEditor 会内部管理内容

  const [isEditingDeadline, setIsEditingDeadline] = useState(false);
  const [editedDeadline, setEditedDeadline] = useState<Date | undefined>(selectedGoal?.deadline);
  const [selectPlans, setSelectPlans] = useState<Plan[]>([]);
  const { lang } = useParams();


  useEffect(() => {
    setEditedTitle(selectedGoal?.title || '');
  }, [selectedGoal]);

  if (!selectedGoal) {
    return (
      <div className="m-2 p-0 ">
      </div>
    );
  }
  //console.log("selectedGoal", selectedGoal);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const onStatusClick = async (id: string, value?: string) => {
    try {
      const updatedGoal = await updateGoalStatus(id, value);
      console.log('Goal status updated:', updatedGoal);
      setSelectedGoal(updatedGoal);
      fetchGoals(currentProject?.id || '');
    } catch (error) {
      console.error('Failed to update goal status:', error);
      //showError('Failed to update goal status:', error);
    }
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
    setEditedTitle(selectedGoal?.title || '');
  };

  const handleTitleSave = async () => {
    if (selectedGoal && editedTitle !== selectedGoal.title) {
      await updateGoal(selectedGoal.id, { title: editedTitle });
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    }
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    setEditedTitle(selectedGoal?.title || '');
  };

  const handleDescriptionSave = async (newDescription: string) => {
    if (selectedGoal && newDescription !== selectedGoal.description) {
       await updateGoal(selectedGoal.id, { description: newDescription });
    }
    setIsEditingDescription(false);
  };

  const handleDeadlineEdit = () => {
    setIsEditingDeadline(true);
  };

  const handleDeadlineSave = async (date: Date | undefined) => {
    if (selectedGoal && date !== selectedGoal.deadline) {
      await updateGoal(selectedGoal.id, { deadline: date });
    }
    setIsEditingDeadline(false);
    setEditedDeadline(date);
  };

  const handleResultSave = async (newResult: string) => {
    if (selectedGoal && newResult !== selectedGoal.result) {
       await updateGoal(selectedGoal.id, { result: newResult });
    }
  };

  const handleProgressUpdate = async (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newProgress = Math.round((x / rect.width) * 100);
    
    if (selectedGoal && newProgress !== selectedGoal.progress) {
      try {
        await updateGoal(selectedGoal.id, 
            { progress: newProgress, 
            status: newProgress === 100 ? 'completed' : 'inProgress' 
        });
      } catch (error) {
        console.error('Failed to update goal progress:', error);
        //showError('Failed to update goal progress:', error);
      }
    }
  };

  return (
    <div className="m-2 p-0 ">
      {selectedGoal?.parentGoalId && (
        <div className="flex items-center mb-0">
          <ArrowUpCircle className="w-4 h-4 text-blue-500 mr-1" />
          <Link href={`/${lang}/demo/${selectedGoal.parentGoalId}`} className="text-xs text-gray-500 hover:text-blue-500">
            Parent: {selectedGoal.parentGoal?.title}
          </Link>
        </div>
      )}
      {/* 新的标题布局 */}
      <div className="flex items-center mb-1">
        <div className="mr-2">
          <Goal className="w-8 h-8 text-blue-500" />
        </div>
        <div className="flex-grow">
          <h2 className="text-xl font-semibold flex items-center">
            {isEditingTitle ? (
              <>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={handleTitleKeyDown}
                  onBlur={handleTitleBlur}
                  className="flex-grow mr-2 px-2 py-1 border rounded"
                  autoFocus
                />
                <Save
                  className="w-6 h-6 text-blue-500 cursor-pointer"
                  onClick={handleTitleSave}
                />
              </>
            ) : (
              <span 
                onClick={handleTitleEdit} 
                className={`cursor-pointer ${isOverdue(selectedGoal.deadline) ? 'text-red-500' : ''}`}
              >
                {selectedGoal?.title}
              </span>
            )}
          </h2>
          <div className="text-xs text-gray-400 mt-0 flex items-center">
            <span className="mr-4 flex items-center">
              Due: 
              <Popover open={isEditingDeadline} onOpenChange={setIsEditingDeadline}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={`ml-1 h-6 p-0 justify-start text-xs text-left font-bold ${
                      isOverdue(selectedGoal.deadline) ? 'text-red-500' : 'text-gray-600'
                    }`}
                  >
                    {/* <Calendar className="mr-2 h-4 w-4" /> */}
                    {formatDate(selectedGoal.deadline)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={editedDeadline}
                    onSelect={(date) => handleDeadlineSave(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </span>
            <span>
              Tags: {selectedGoal.tags}
              {/* {selectedGoal.tags && selectedGoal.tags.map((tag) => (
                <span key={tag} className="inline-block bg-blue-500 text-blue-800 text-xs font-semibold ml-2 mr-2 px-2.5 py-0.5 rounded-full items-center">
                  {tag}
                </span>
              ))} */}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center mt-1">
        <span className="text-sm mr-2 w-16 min-w-16 text-gray-400 self-start">KRs:</span>
        <div className="flex-grow">
          <RichTextEditor
            key={selectedGoal.id + simpleHash(selectedGoal.description || '')}
            initialValue={selectedGoal.description || ''} 
            onSave={handleDescriptionSave} 
          />
        </div>
      </div>
      
      
      <div className="mt-1 flex flex-col md:flex-row md:space-x-2">
        <div className="flex items-center mb-2 w-full md:w-1/2 text-gray-400">
          <span className="text-sm mr-2 w-16">Status:</span>
          <StatusIcon status={selectedGoal.status} onClick={() => onStatusClick(selectedGoal.id)}  />
          <Select value={selectedGoal.status} onValueChange={(value) => onStatusClick(selectedGoal.id, value)}>
            <SelectTrigger className="outline-none w-32 border-none">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="notStarted">Not Started</SelectItem>
              <SelectItem value="inProgress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center w-full md:w-1/2 text-gray-400">
          <span className="text-sm mr-2 w-16">Progress:</span>
          
          <div className="w-24 bg-gray-200 rounded-full h-2 mt-0 ml-2 cursor-pointer"
            onClick={handleProgressUpdate}>
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${selectedGoal.progress}%` }}
            ></div>
          </div>
          <span className="ml-2 text-xs text-gray-500">{selectedGoal.progress}%</span>
        </div>
      </div>

      <div className="flex items-center mt-1">
        <span className="text-sm mr-2 w-16 min-w-16 text-gray-400 self-start">Result:</span>
        <div className="flex-grow">
          <RichTextEditor
            key={selectedGoal.id+simpleHash(selectedGoal.result || '')} // 添加key以确保组件在目标变更时重新渲染
            initialValue={selectedGoal.result || ''}
            onSave={handleResultSave}
          />
        </div>
      </div>
    
      <Tabs defaultValue="subgoals" className="mt-4">
        <TabsList>
          <TabsTrigger value="subgoals">SubXXX</TabsTrigger>
          <TabsTrigger value="plans">Others</TabsTrigger>
        </TabsList>
        <TabsContent value="subgoals">
          <SubGoalList filteredGoals={selectedGoal.subGoals ?? []} showadd={true} key={selectedGoal.id}/>
        </TabsContent>
        <TabsContent value="plans">
            <div>
                <h2>Others</h2>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoalDetail;