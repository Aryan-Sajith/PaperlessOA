"use client";

import React from 'react';

type TaskBarProps = {
  completedTasks: number;
  pendingTasks: number;
};

export default function TaskBar({ completedTasks, pendingTasks }: TaskBarProps) {
  const totalTasks = completedTasks + pendingTasks;
  const completedPercentage = (completedTasks / totalTasks) * 100;
  const pendingPercentage = (pendingTasks / totalTasks) * 100;

  return (
    <div className="w-full h-12 flex rounded-md overflow-hidden text-white">
      {/* Completed Tasks Section */}
      <div
        style={{ width: `${completedPercentage}%` }}
        className="bg-green-500 flex items-center justify-center"
      >
        <p className="text-sm font-semibold">
          Completed: {completedTasks}
        </p>
      </div>

      {/* Pending Tasks Section */}
      <div
        style={{ width: `${pendingPercentage}%` }}
        className="bg-yellow-500 flex items-center justify-center"
      >
        <p className="text-sm font-semibold">
          Pending: {pendingTasks}
        </p>
      </div>
    </div>
  );
}
