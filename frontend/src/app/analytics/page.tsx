"use client";

import React, { useState, useEffect } from "react";
import DropdownMenu from "@/components/Analytics_Dropdown";
import TaskBar from "@/components/TaskBar";
import PieChart from "@/components/PieChart";
import { API_BASE } from "@/util/path";

export default function Analytics() {
  const [workflows, setWorkflows] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/workflows`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => setWorkflows(data))
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Analytics Dashboard</h1>
      <p style={descriptionStyle}>
        Explore tasks and workflows to gain insights into project performance.
      </p>

      <div style={cardStyle}>
        {/* Inline DropdownMenu and text */}
        <div style={inlineContainerStyle}>
          <DropdownMenu type="task" />
          <span style={textStyle}>Tasks completed within the past</span>
          <DropdownMenu type="time"/>
        </div>

        {/* TaskBar aligned below */}
        <div style={taskbarWrapperStyle}>
          <TaskBar completedTasks={10} pendingTasks={5} />
        </div>

        {/* Pie Chart */}
        <div style={chartWrapperStyle}>
          <PieChart completedTasks={10} pendingTasks={5} />
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
