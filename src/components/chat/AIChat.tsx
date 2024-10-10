"use client"
import { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import { getOrCreateConversations, getMessagesByConversationId, deleteChatMessage, createNewConversation } from "@/actions/chat"
import { useUser } from "@clerk/nextjs"
import { useGoalStore } from '@/store/goalStore';
import { Message, ToolInvocation } from 'ai';
import { Button } from '../ui/button';
import { saveChatMessage } from '@/actions/chat';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatContent from '@/components/chat/ChatContent';
import { Square } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { useUserStore } from '@/store/userStore';
import toast from 'react-hot-toast';
import { usePathname } from 'next/navigation';

// 添加可选参数的接口
interface AIChatProps {
  goalId?: string;
}

// 更新组件定义，接受可选参数
export default function AIChat({ goalId }: AIChatProps) {
  const user = useUser();
  const [conversationId, setConversationId] = useState<string>('');
  const { selectedGoal, reloadCurrentGoal } = useGoalStore();
  const { currentProject } = useProjectStore();
  const { currentUser, reloadCurrentUser, isAIUsageLimitExceeded } = useUserStore();
  const pathname = usePathname();

  const { append, messages, setMessages, input, 
    handleInputChange, isLoading, error, stop, reload, addToolResult, setInput } = useChat({
    api: '/api/demo/chat',
    keepLastMessageOnError: true,
    headers: {
      'x-conversation-id': conversationId,
      'x-user-id': user.user?.id || '',
      'x-goal-id': goalId || '',
      'x-project-id': currentProject?.id || '',
    },
    onToolCall: async (toolCall) => {
      
    },
    onFinish: async (completion) => {
      await saveChatMessage({
        id: completion.id,
        role: 'assistant',
        content: completion.content,
        conversationId: conversationId,
        creatorId: user.user?.id || '',
      });
      if(goalId || pathname.includes('goal')) {
        await reloadCurrentGoal();
      }
    },
    generateId: () => {
      return Math.random().toString(36).substring(2, 15);
    },
  });

  // 自定义 handleSubmit 函数
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    await handleGenAI(input);
    setInput('');
  };

  // 添加删除消息的处理函数
  const handleDeleteMessage = (messageId: string) => {
    console.log("handleDeleteMessage", messageId);
    deleteChatMessage(messageId);
    setMessages(prevMessages => prevMessages.filter(m => m.id !== messageId));
  };

  // 添加一个 ref 来引用消息容器
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 添加一个函数来滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 在消息更新时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    async function fetchInitialData() {
      const conversations = await getOrCreateConversations(user.user?.id || '', goalId);
      if (conversations.length > 0) {
        setConversationId(conversations[0].id);
        console.log("setConversationId: ", conversations[0].id);
        const msg = await getMessagesByConversationId(conversations[0].id);
        setMessages(msg as Message[]);
      }
    }
    fetchInitialData();
  }, [goalId, user.user?.id]);

  const handleGenAI = async (msg: string) => {
    if (isAIUsageLimitExceeded()) {  //todo server side check
      toast.error('AI usage limit exceeded this month.');
      return;
    }
    const newMessage = {
      id: Math.random().toString(36).substring(2, 15),
      role: 'user' as const,
      content: msg
    };
    append(newMessage);
    await saveChatMessage({
      id: newMessage.id,
      role: newMessage.role,
      content: newMessage.content,
      conversationId: conversationId,
      creatorId: user.user?.id || '',
    });
    reloadCurrentUser();
  };

  const handleNewChat = async (): Promise<string> => {
    const newConversation = await createNewConversation({
      title: 'New Chat',
      goalId: goalId,
      creatorId: user.user?.id || '',
    });
    setConversationId(newConversation.id);
    const msg = await getMessagesByConversationId(newConversation.id);
    setMessages(msg as Message[]);
    return newConversation.id;
  };

  const handleSelectChat = async (chatId: string) => {
    setConversationId(chatId);
    const msg = await getMessagesByConversationId(chatId);
    setMessages(msg as Message[]);
  };

  return (
    <div className="flex flex-col h-full w-full min-w-96 py-0 mx-auto overflow-y-auto">
      <ChatHeader
        handleGenAI={handleGenAI}
        selectedGoal={goalId ? selectedGoal : null}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />
      
      <div className="flex-grow overflow-y-auto mb-4 pr-2">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
            {m.role !== 'user' && (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            )}
            <div className={`rounded-lg max-w-[80%] ${m.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <div className="p-2 rounded-lg">
                {/* {m.id} */}
                {/* <ReactMarkdown className="rich-text-content">{m.content}</ReactMarkdown> */}
                <ChatContent content={m.content} onButtonClick={handleGenAI} />
                <div className='rich-text-content'>
                  {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
                  const toolCallId = toolInvocation.toolCallId;
                  const addResult = (result: string) =>
                    addToolResult({ toolCallId, result });

                  // render confirmation tool (client-side tool with user interaction)
                  if (toolInvocation.toolName === 'askForConfirmation') {
                    return (
                      <div key={toolCallId} >
                        <ReactMarkdown className="rich-text-content">{toolInvocation.args.message}</ReactMarkdown>
                        <div>
                          {'result' in toolInvocation ? (
                            <ReactMarkdown className="rich-text-content">{toolInvocation.result}</ReactMarkdown>
                          ) : (
                            <>
                              <Button className='mr-2' onClick={() => addResult('Yes')}>Yes</Button>
                              <Button className='mr-2' onClick={() => addResult('No')}>No</Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // other tools:
                  return 'result' in toolInvocation ? (
                    <div key={toolCallId}>
                      Tool call {`${toolInvocation.toolName}: `}
                      {toolInvocation.result}
                    </div>
                  ) : (
                    <div key={toolCallId}>Calling {toolInvocation.toolName}...</div>
                  );
                })}
                </div>
              </div>
              {(m.role != 'tool') && (
                <div className="flex mt-0 ml-2 items-center">
                  {m.createdAt && m.role === 'assistant' && <span className="text-xs text-gray-500 mr-2">
                    {new Date(m.createdAt).toLocaleString()}
                  </span>}
                  <button
                    onClick={() => handleDeleteMessage(m.id)}
                    className="text-gray-500 hover:text-red-500 transition duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
        {/* 添加一个空的 div 作为滚动目标 */}
        <div ref={messagesEndRef} />
        
        {isLoading && (
          <div className="flex justify-center items-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <button type="button" onClick={() => stop()} className="ml-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300">
              <Square className="h-3 w-3" />
            </button>
          </div>
        )}
        {error && (
          <>
            <div>An error occurred: {error.message}</div>
            <Button onClick={() => reload()}>
              Retry
            </Button>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative bottom-0 left-0 right-0 p-2 bg-white">
        <input
          className="text-sm w-full p-2 pr-20 border border-gray-300 rounded-full shadow-xl focus:outline-none focus:ring-0 focus:ring-gray-300"
          value={input}
          placeholder="Enter your message..."
          onChange={handleInputChange}
          disabled={isLoading}
        />
        {isLoading ? (
          <button
            type="button"
            onClick={stop}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-500 text-white rounded-full p-2"
          >
            <Square className="h-3 w-3" />
          </button>
        ) : (
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white rounded-full p-2"
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </form>
    </div>
  );
}
