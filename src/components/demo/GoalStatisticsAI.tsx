'use client'
import React, { useState, useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { getAIGeneratedGoalStatistics } from '@/actions/demo';

interface AIStatsProps {
  // Define props here if needed
}

const GoalStatisticsAI: React.FC<AIStatsProps> = () => {
  const [aiStats, setAIStats] = useState({
    total: 0,
    aicount: 0,
    airatio: 0,
    timesaved: 0,
    efficiency: 0,
  });
  const { currentProject } = useProjectStore();

  useEffect(() => {
    const fetchAIStats = async () => {
      if (currentProject) {
        try {
          const stats = await getAIGeneratedGoalStatistics(currentProject.id);
          setAIStats(stats);
        } catch (error) {
          console.error('Failed to fetch AI statistics:', error);
        }
      }
    };

    fetchAIStats();
  }, [currentProject]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center justify-between">
      <div className="text-center">
        <h2 className="text-sm font-semibold">AIGens</h2>
        <p className="text-xl font-bold text-blue-600">{aiStats.aicount}</p>
      </div>
      <div className="text-center">
        <h2 className="text-sm font-semibold">AIGen Ratio</h2>
        <p className="text-xl font-bold text-green-600">{aiStats.airatio}%</p>
      </div>
      <div className="text-center">
        <h2 className="text-sm font-semibold">Time Saved</h2>
        <p className="text-xl font-bold text-purple-600">{aiStats.timesaved}h</p>
      </div>
      <div className="text-center">
        <h2 className="text-sm font-semibold">Efficiency</h2>
        <p className="text-xl font-bold text-orange-600 flex items-center justify-center">
          {aiStats.efficiency}%
          <svg className="w-4 h-4 ml-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </p>
      </div>
    </div>
  );
};

export default GoalStatisticsAI;