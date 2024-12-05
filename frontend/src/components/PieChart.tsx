"use client";

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

type PieChartProps = {
  completedTasks: number;
  pendingTasks: number;
};

export default function PieChart({ completedTasks, pendingTasks }: PieChartProps) {
  // Data for the pie chart
  const data = {
    labels: ['Pending', 'Completed'],
    datasets: [
      {
        data: [pendingTasks, completedTasks], // Values for each segment
        backgroundColor: ['#ffeb3b', '#4caf50'], // Colors for each segment
        borderColor: ['#ffffff', '#ffffff'], // Border colors for each segment
        borderWidth: 2,
      },
    ],
  };

  // Options for customizing the pie chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const, // Position of the legend
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const value = tooltipItem.raw;
            return `${tooltipItem.label}: ${value} tasks`;
          },
        },
      },
    },
  };

  return (
    <div className="w-64 h-64">
      <Pie data={data} options={options} />
    </div>
  );
}
