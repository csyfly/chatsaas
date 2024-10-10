/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react';
import { Goal } from '@prisma/client';
import { PlusCircle, History } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getOrCreateConversations } from '@/actions/chat';
import { Conversation } from '@prisma/client';
import { useUserStore } from '@/store/userStore';

interface ChatHeaderProps {
  handleGenAI: (msg: string) => void;
  selectedGoal: Goal | null;
  onNewChat: () => Promise<string>;
  onSelectChat: (chatId: string) => void; // 新增选择聊天的回调
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  handleGenAI,
  selectedGoal,
  onNewChat,
  onSelectChat
}) => {
  const [chatHistory, setChatHistory] = useState<Conversation[]>([]);
  const { currentUser } = useUserStore();

  useEffect(() => {
    //从数据库加载聊天历史
    const loadChatHistory = async () => {
      const history = await getOrCreateConversations(currentUser?.id || '');
      setChatHistory(history);
    };
    loadChatHistory();
  }, [selectedGoal, currentUser]);

  const handleNewChat = async () => {
    const id = await onNewChat();
    const history = await getOrCreateConversations(currentUser?.id || '');
    setChatHistory(history);
  };

  return (
    <div className="flex flex-col mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">AI Assistant</h2>
            <p className="text-sm text-gray-500">Your intelligent assistant</p>
          </div>
        </div>
        
        {/* 新增会话和历史会话按钮 */}
        <div className="flex space-x-0">
          <Button variant="ghost" size="icon" onClick={onNewChat}>
            <PlusCircle className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <History className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {chatHistory.map((chat) => (
                <DropdownMenuItem key={chat.id} onSelect={() => onSelectChat(chat.id)}>
                  <div className="flex justify-between items-center w-full">
                    <span>{chat.title}</span>
                    <span className="text-xs pl-2 text-gray-500">
                      {new Date(chat.createdAt).toLocaleString()}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* 添加AI私教说明 */}
      <p className="text-xs text-gray-500 mt-2 mb-1">
         Hi, I&apos;m your AI personal assistant. I can help you with many things like, Don&apos;t hesitate to ask me questions anytime. Let&apos;s move forward together!
      </p>
      
      {selectedGoal && (
      <div className="flex justify-center space-x-2 mt-1">
        <button onClick={()=>handleGenAI('Generate Detail based on current goal')} className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition duration-300 flex items-center">
          Generate Detail
        </button>
        
        <button onClick={()=>handleGenAI('Break down short-term subgoals')} className="flex px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition duration-300">
          Break subgoals
        </button>
        
        {/* <button onClick={()=>handleGenAI('拆解举措计划')} className="flex px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition duration-300">
          拆解举措计划
        </button> */}
        
        <button onClick={()=>handleGenAI('Generate results')} className="flex px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition duration-300">
          {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg> */}
          Generate results
        </button>
      </div>
      )}
        
      
    </div>
  );
};

export default ChatHeader;
