'use client'
import Navbar from "@/components/navbar";
import { Home, BarChart2, Users, Settings, FileText, Calendar, MessageSquare, Folder, Goal, ChevronDown } from 'lucide-react';
import Image from 'next/image';
// export const runtime = 'edge'

//import { ErrorProvider } from "@/components/ErrorContext"; // 新增
//import { ErrorDisplay } from "@/components/ErrorDisplay"; // 新增

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { checkAndResetUserProCounter, createOrGetUser } from "@/actions/user"; 
import { useProjectStore } from "@/store/projectStore";
import Header from "@/components/Header";
import Link from "next/link";
import UpgradePro from "@/components/UpgradePro";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "@/store/userStore";
import { redirect } from 'next/navigation';

const DashboardLayout = ({ children, params: { lang } }: 
  { children: React.ReactNode, params: { lang: string } }) => {
  const { user } = useUser();
  const { projects, currentProject, fetchProjects, setCurrentProject } = useProjectStore();
  const { currentUser, setCurrentUser, reloadCurrentUser } = useUserStore();
  
  useEffect(() => {
    const handleUser = async () => {
      if (user) {
        try {
          const u = await createOrGetUser(user.id, user.username, user.emailAddresses[0].emailAddress);
          fetchProjects(user.id);
          const u1 = await checkAndResetUserProCounter(u);
          setCurrentUser(u1);
        } catch (error) {
          console.error("Error handling user:", error);
          //showError("Error handling user:", error);
        }
      } 
    };

    handleUser();
  }, [user, fetchProjects]);

  useEffect(() => {
    if (projects.length > 0 && currentProject === null) {
      setCurrentProject(projects[0]);
    }
  }, [projects, currentProject, setCurrentProject]);

  
  return (
    // <ErrorProvider>
      <div className="flex h-screen">
        {/* 侧边菜单 */}
      <aside className="bg-indigo-700 text-white w-40 flex-shrink-0 hidden md:flex flex-col">
        <div className="flex-grow">
          <div className="p-2">
            <Link href={`/${lang}`} className="flex items-center">
              <Image
                src="/logo.png"
                alt=""
                width={40}
                height={40}
                className="mr-2 h-10 w-10"
              />
              <div>
                <h2 className="text-lg font-semibold"><span className="text-green-500">Chat</span>SaaS</h2>
                <p className="text-xs text-indigo-300">AI Goal Coach</p>
              </div>
            </Link>
          </div>
          <Navbar />
        </div>
        
        {/* 订阅信息放在这里 */}
        <div className="p-4 mt-auto">
          <div className="mb-2 text-sm text-center">AI Use: {currentUser?.useAICount} / {currentUser?.maxUseAICount}</div>
          <div className="w-full bg-indigo-900 rounded-full h-2.5 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full" 
              style={{ width: `${currentUser?.maxUseAICount ? (currentUser.useAICount / currentUser.maxUseAICount) * 100 : 0}%` }}
            ></div>
          </div>
          <UpgradePro />
        </div>
      </aside>
        <main className="w-full h-screen">
            {/* 顶部导航栏 */}
            <Header />
            <div className="w-full h-[calc(100vh-64px)]">
                {/* <ErrorDisplay /> */}
                <Toaster />
                {children}
            </div>
        </main>
      </div>
    // </ErrorProvider>
  );
};

export default DashboardLayout;