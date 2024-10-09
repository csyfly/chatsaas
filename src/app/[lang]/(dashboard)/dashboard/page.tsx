import { UserButton } from '@clerk/nextjs';
import { Menu, X, Home, BarChart2, Users, Settings, Bell, Calendar, FileText, MessageSquare, Goal } from 'lucide-react';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import SelectTime from '@/components/SelectTime';
import GoalStatistics from '@/components/demo/GoalStatistics';
import GoalStatisticsAI from '@/components/demo/GoalStatisticsAI';
import HomeGuide from '@/components/HomeGuide';
// export const runtime = 'edge';


export default async function DashboardPage() {
  
  // 注意：这里我们不需要手动更新goals变量，因为在下面的代码中会重新查询所有目标
  const goals = await prisma.goal.findMany();

  return (
    <div className='h-full flex'>
        {/* 主要内容 */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-4">
            <h3 className="text-3xl font-medium text-gray-700">Welcome</h3>
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
              {/* 数据卡片示例 */}
              <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
                <div className="bg-indigo-500 rounded-full p-3">
                  <Goal className="text-white" size={24} />
                </div>
                <div className='w-full'>
                  <GoalStatistics />
                  <hr className="my-4 border-gray-200" />
                  <GoalStatisticsAI />
                </div>
              </div>
              
              {/* 可以添加更多数据卡片 */}
              
            </div>
          </div>
          <HomeGuide />
        </main>
      </div>
  );
}
