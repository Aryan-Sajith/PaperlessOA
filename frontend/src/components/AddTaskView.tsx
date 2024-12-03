"use client";

import React, { useEffect, useState } from "react";
import EmployeeDropdown from '@/components/EmployeeDropDown';
import { SingleValue } from 'react-select';
import { Employee, TaskStatus } from '@/util/ZodTypes';
import { Task } from "@/app/tasks/page";
import { API_BASE } from "@/util/path";
import TaskStatusDropdown from "./TaskStatusDropdown";
import { taskViewType } from "./TasksToggle";

type AddTaskViewProps = {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  refetchTasks: () => void;
};

export default function AddTaskView({ setTasks, refetchTasks }: AddTaskViewProps) {
  const [isViewOpen, setIsViewOpen] = useState(false); // Toggle Add Task view
  const [selectedAssignee, setSelectedAssignee] = useState<Employee | null>(null);
  const DEFAULT_ADD_TASK_VALUES = { // Ensures default add task values so that adding a task doesn't fail if no fields are filled
    description: "Task not described!",
    type: "Task type not specified!",
    status: "In Progress",
    assignee_id: 1,
  } as const;
  const [taskData, setTaskData] = useState<Omit<Task, "id">>({
    status: "",
    due_date: new Date().toISOString().split("T")[0], // Default to today's date
    description: "",
    type: "",
    assignee_id: 1, // Default assignee(for now), we can update this later when login is setup 
  }); // Task form state

  const toggleView = () => setIsViewOpen((prev) => !prev); // Open/close view

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: name === "assignee_id" ? parseInt(value, 10) : value, // Ensure assignee_id is a number
    }));
  };

  const handleAddTask = () => {
    const finalTaskData = { // Ensures default add task values are utilized for API request if no fields are filled
      ...taskData,
      description: taskData.description || DEFAULT_ADD_TASK_VALUES.description,
      type: taskData.type || DEFAULT_ADD_TASK_VALUES.type,
      status: taskData.status || DEFAULT_ADD_TASK_VALUES.status,
      assignee_id: taskData.assignee_id || DEFAULT_ADD_TASK_VALUES.assignee_id,
    }

    fetch(`${API_BASE}/create_task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalTaskData),
    })
      .then((response) => response.json())
      .then((newTask: Task) => {
        setTasks((prevTasks) => [...prevTasks, newTask]); // Add new task
        setTaskData({
          status: "",
          due_date: new Date().toISOString().split("T")[0], // Default to today's date
          description: "",
          type: "",
          assignee_id: 0,
        }); // Reset form
        setIsViewOpen(false); // Close the view
        refetchTasks(); // Refetch tasks to ensure the new task is displayed in the correct view
      })
      .catch((error) => {
        console.error("Error creating task:", error);
      });
  };

  const handleSelectAssignee = (assignee: SingleValue<Employee>) => {
    if (assignee) {
      setSelectedAssignee(assignee);
      setTaskData((prev) => ({
        ...prev,
        assignee_id: assignee.employee_id,
      }));
    } else {
      setSelectedAssignee(null);
      setTaskData((prev) => ({
        ...prev,
        assignee_id: 0, // Reset to a neutral state
      }));
    }
  };

  return (
    <div>
      {/* Floating Add/Close Button */}
      <button
        onClick={toggleView}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: isViewOpen ? "#e74c3c" : "#2596be", // Red when open, blue otherwise
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
        }}
      >
        {isViewOpen ? "×" : "+"} {/* Close (×) if open, Add (+) if closed */}
      </button>

      {/* Add Task View */}
      {isViewOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "20px",
            width: "300px",
            padding: "15px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div>
            <TaskStatusDropdown
              onStatusSelect={(status) =>
                setTaskData((prev) => ({ ...prev, status }))
              }
              currentStatus={taskData.status as TaskStatus}
            />
          </div>
          <input
            type="date"
            name="due_date"
            placeholder="Due Date"
            value={taskData.due_date}
            onChange={handleInputChange}
            style={{
              padding: "8px",
              fontSize: "14px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={taskData.description}
            onChange={handleInputChange}
            style={{
              padding: "8px",
              fontSize: "14px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <input
            type="text"
            name="type"
            placeholder="Type"
            value={taskData.type}
            onChange={handleInputChange}
            style={{
              padding: "8px",
              fontSize: "14px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <div>
            <EmployeeDropdown
              onEmployeeSelect={handleSelectAssignee}
              showSubordinatesOnly={true}
            />
          </div>
          <button
            onClick={handleAddTask}
            style={{
              backgroundColor: "#2ecc71",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "10px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            ✓ Add Task
          </button>
        </div>
      )}
    </div>
  );
}
