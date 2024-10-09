'use client'
import React, { useState, useEffect } from 'react';
import { getGoalStatistics } from '@/actions/demo';
import { useProjectStore } from '@/store/projectStore';
import GoalStatistics from '@/components/demo/GoalStatistics';
import GoalStatisticsAI from '@/components/demo/GoalStatisticsAI';
import { useGoalStore } from '@/store/goalStore';
// export const runtime = 'edge';

const DemoPage = () => {
  const { selectedGoal, setSelectedGoal } = useGoalStore();
  useEffect(() => {
    setSelectedGoal(null);
  }, []);

  return (
    <div className="m-2 space-y-6">
      <h1 className="text-xl font-bold">Demo Page</h1>
      
      <GoalStatistics />
      <GoalStatisticsAI />

      <hr className="my-6 border-gray-300" />

      {/* Demo Content Section */}
      <div>
        <h3 className="font-semibold mb-2">Demo</h3>
        <p className="mb-4 text-sm text-gray-600">
          This demo page showcases various features of our application, including goal statistics and AI-powered insights.
        </p>
        <h3 className="font-semibold mb-2">Key Components</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
          <li>DMEO: Displays user's goal progress</li>
          <li>DMEO: Provides AI-generated insights</li>
          <li>DMEO: Responsive and user-friendly design</li>
          <li>DMEO: Data refreshes automatically</li>
          <li>DMEO: Tailored to user preferences</li>
        </ul>
      </div>
    </div>
  );
};

export default DemoPage;