"use client";

import AnalyticsToggle, { analyticsViewType } from "@/components/analytics/AnalyticsToggle";
import DropdownMenu from "@/components/analytics/AnalyticsDropdown";
import PieChart from "@/components/analytics/AnalyticsPieChart";
import SubordinateDropdown from "@/components/analytics/AnalyticsSubordinateDropdown";
import TaskBar from "@/components/analytics/AnalyticsTaskBar";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE } from "@/util/api-path";

export default function Analytics() {
  const [completedCount, setCompletedCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [timeFrame, setTimeFrame] = useState("Past Month");
  const [taskType, setTaskType] = useState("All");
  const [selectedSubordinate, setSelectedSubordinate] = useState<string | number>("All Subordinates");
  const [currentView, setCurrentView] = useState<analyticsViewType>("My");
  const [noTasksFound, setNoTasksFound] = useState(false); // Tracks whether no tasks are found
  const { user, loading } = useAuth(); // Add loading from useAuth

  useEffect(() => {
    fetchTasks(taskType, timeFrame, selectedSubordinate, currentView);
  }, [user, loading, taskType, timeFrame, selectedSubordinate, currentView]);

  const fetchTasks = (selectedTaskType: string, selectedTimeFrame: string, selectedSubordinate: string | number, view: string) => {
    if (!loading && user) {
      const url = view == "My"
        ? `${API_BASE}/tasks/employee/${user.employee_id}/${selectedTaskType}/${selectedTimeFrame}` // Personal analytics
        : selectedSubordinate == "All Subordinates" 
        ? `${API_BASE}/tasks/manager/${user.employee_id}/${selectedTaskType}/${selectedTimeFrame}` // Subordinate analytics
        : `${API_BASE}/tasks/employee/${selectedSubordinate}/${selectedTaskType}/${selectedTimeFrame}`
      fetch(url)
        .then((response) => {
          if (response.status === 404) {
            setNoTasksFound(true);
            return [];
          } else if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
          }
          setNoTasksFound(false);
          return response.json();
        })
        .then((data) => {
          const completed = data.filter((task: any) => task.status === "Completed").length;
          const inProgress = data.filter((task: any) => task.status === "In Progress").length;
          setCompletedCount(completed);
          setInProgressCount(inProgress);
        })
        .catch((error) => console.error("Fetch error:", error));
    }
  };


  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      {user?.is_manager && (
        <AnalyticsToggle
          onToggle={(view) => {
            setCurrentView(view);
          }}
        />
      )}

      <div style={cardStyle}>
        {/* Inline DropdownMenu and text */}
        <div style={inlineContainerStyle}>
          <DropdownMenu
            type="task"
            onChange={setTaskType}
          />
          <span style={textStyle}>Tasks due in the </span>
          <DropdownMenu
            type="time"
            onChange={setTimeFrame} // Handle dropdown change
          />

          {currentView != "My" && user && (
            <span style={textStyle}>for </span>
          )}
          {currentView != "My" && user && (
              <SubordinateDropdown
                managerId={user.employee_id}
                onChange={(subordinate) => setSelectedSubordinate(subordinate?.employee_id || "All Subordinates")}
              />
          )}
        </div>

        {/* Conditional Rendering */}
        {noTasksFound ? (
          <p style={noTasksFoundStyle}>No tasks found.</p>
        ) : (
          <>
            {/* TaskBar aligned below */}
            <div style={taskbarWrapperStyle}>
              <TaskBar completedTasks={completedCount} pendingTasks={inProgressCount} />
            </div>

            {/* Pie Chart */}
            <div style={chartWrapperStyle}>
              <PieChart completedTasks={completedCount} pendingTasks={inProgressCount} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Styles
const cardStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  padding: "20px",
  maxWidth: "800px",
  margin: "0 auto",
};

const inlineContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px",
};

const textStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#343a40",
};

const taskbarWrapperStyle: React.CSSProperties = {
  marginBottom: "20px",
};

const chartWrapperStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "20px",
};

const noTasksFoundStyle: React.CSSProperties = {
  fontSize: "16px",
  color: "#dc3545",
  textAlign: "center",
  marginTop: "20px",
};
