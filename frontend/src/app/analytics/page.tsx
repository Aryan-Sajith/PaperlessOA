"use client";

import React, { useState, useEffect} from "react";
import DropdownMenu from "@/components/Analytics_Dropdown";
import TaskBar from "@/components/Analytics_TaskBar";
import PieChart from "@/components/PieChart";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE } from "@/util/path";

export default function Analytics() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [timeFrame, setTimeFrame] = useState("past_day");
  const { user, loading } = useAuth(); // Add loading from useAuth

  useEffect(() => {
    if (!loading && user) {
      fetchTasks(timeFrame);
    }
  }, [user, loading, timeFrame]);

  const fetchTasks = (selectedTimeFrame: string) => {
    fetch(`${API_BASE}/tasks/employee/${user.employee_id}/${selectedTimeFrame}`)
      .then((response) => {
        if (response.status === 404) {
          return [];
        } else if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setTasks(data);
        const completed = data.filter((task: any) => task.status === "Completed").length;
        const inProgress = data.filter((task: any) => task.status === "In Progress").length;
        setCompletedCount(completed);
        setInProgressCount(inProgress);
      })
      .catch((error) => console.error("Fetch error:", error));
  };

  const handleTimeFrameChange = (newTimeFrame: string) => {
    // Map human-readable options to backend API parameters
    const timeFrameMapping: Record<string, string> = {
      "Past Day": "past_day",
      "Past Week": "past_week",
      "Past Month": "past_month",
      "Next Day": "next_day",
      "Next Week": "next_week",
      "Next Month": "next_month",
    };
    setTimeFrame(timeFrameMapping[newTimeFrame]);
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Analytics Dashboard</h1>
      <p style={descriptionStyle}>
        Explore tasks to gain insights into project performance.
      </p>

      <div style={cardStyle}>
        {/* Inline DropdownMenu and text */}
        <div style={inlineContainerStyle}>
          <DropdownMenu type="task" />
          <span style={textStyle}>Tasks due in</span>
          <DropdownMenu
            type="time"
            onChange={handleTimeFrameChange} // Handle dropdown change
          />
        </div>

        {/* TaskBar aligned below */}
        <div style={taskbarWrapperStyle}>
          <TaskBar completedTasks={completedCount} pendingTasks={inProgressCount} />
        </div>

        {/* Pie Chart */}
        <div style={chartWrapperStyle}>
          <PieChart completedTasks={completedCount} pendingTasks={inProgressCount} />
        </div>

        {/* Display Tasks */}
        <div style={workflowListStyle}>
          <h2 style={subTitleStyle}>Tasks</h2>
          {tasks.length > 0 ? (
            <ul style={listStyle}>
              {tasks.map((task) => (
                <li key={task.id} style={listItemStyle}>
                  {task.description}
                </li>
              ))}
            </ul>
          ) : (
            <p style={textStyle}>
              {loading ? "Loading tasks..." : "No tasks found."}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

// Styles
const pageStyle: React.CSSProperties = {
  fontFamily: "'Arial', sans-serif",
  backgroundColor: "#f8f9fa",
  padding: "20px",
  minHeight: "100vh",
};

const titleStyle: React.CSSProperties = {
  fontSize: "24px",
  color: "#343a40",
  marginBottom: "10px",
};

const descriptionStyle: React.CSSProperties = {
  fontSize: "16px",
  color: "#6c757d",
  marginBottom: "20px",
};

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

const workflowListStyle: React.CSSProperties = {
  marginTop: "20px",
};

const subTitleStyle: React.CSSProperties = {
  fontSize: "18px",
  color: "#495057",
  marginBottom: "10px",
};

const listStyle: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
};

const listItemStyle: React.CSSProperties = {
  backgroundColor: "#f1f3f5",
  padding: "10px",
  borderRadius: "4px",
  marginBottom: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};
