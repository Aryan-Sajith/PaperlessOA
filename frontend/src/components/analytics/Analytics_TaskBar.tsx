"use client";

import React from "react";

type TaskBarProps = {
  completedTasks: number;
  pendingTasks: number;
};

export default function TaskBar({ completedTasks, pendingTasks }: TaskBarProps) {
  const totalTasks = completedTasks + pendingTasks;
  const completedPercentage = (completedTasks / totalTasks) * 100;
  const pendingPercentage = (pendingTasks / totalTasks) * 100;

  return (
    <div className="w-full">
      {/* Labels */}
      <div className="flex justify-between mb-2">
        <span className="text-green-700 font-semibold">Completed</span>
        <span className="text-yellow-700 font-semibold">Pending</span>
      </div>

      {/* Task Bar */}
      <div className="w-full h-12 flex rounded-md overflow-hidden">
        {/* Completed Tasks Section */}
        <div
          style={{ width: `${completedPercentage}%` }}
          className="bg-green-500 flex items-center justify-center"
        >
          <p data-testid="analytics-completed" className="text-sm font-semibold text-white">{completedTasks}</p>
        </div>

        {/* Pending Tasks Section */}
        <div
          style={{ width: `${pendingPercentage}%` }}
          className="bg-yellow-500 flex items-center justify-center"
        >
          <p data-testid="analytics-pending" className="text-sm font-semibold text-white">{pendingTasks}</p>
        </div>
      </div>
    </div>
  );
}
