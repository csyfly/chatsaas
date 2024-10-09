'use client'
import React, { useState, useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { getGoalStatistics } from '@/actions/demo';
import { useParams } from 'next/navigation';

interface GoalStatsProps {
  
}

const GoalStatistics: React.FC<GoalStatsProps> = ({  }) => {
  // Assume this data will be fetched from an API
  const [goalStats, setGoalStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    expired: 0
  });
  const { currentProject } = useProjectStore();
  const { lang } = useParams();
  useEffect(() => {
    const fetchGoalStats = async () => {
      if (currentProject) {
        try {
          const stats = await getGoalStatistics(currentProject.id);
          setGoalStats(stats);
        } catch (error) {
          console.error('获取目标统计信息失败:', error);
          // 这里可以添加错误处理逻辑，比如显示错误消息
        }
      }
    };

    // 调用获取统计信息的函数
    fetchGoalStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center justify-between">
      <div className="text-center">
        <h2 className="text-sm font-semibold">Total</h2>
        <a href={`/${lang}/goal`} className="text-xl font-bold hover:underline">{goalStats.total}</a>
      </div>
      <div className="text-center">
        <h2 className="text-sm font-semibold">Completed</h2>
        <p className="text-xl font-bold text-green-600">{goalStats.completed}</p>
      </div>
      <div className="text-center">
        <h2 className="text-sm font-semibold">In Progress</h2>
        <p className="text-xl font-bold text-yellow-600">{goalStats.inProgress}</p>
      </div>
      <div className="text-center">
        <h2 className="text-sm font-semibold">Expired</h2>
        <p className="text-xl font-bold text-red-600">{goalStats.expired}</p>
      </div>
    </div>
  );
};

export default GoalStatistics;