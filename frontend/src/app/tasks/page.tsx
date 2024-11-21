// This is the tasks page
"use client";
import React, { useState, useEffect } from "react";
import TaskList from "@/components/TaskList";
import TaskCard from "@/components/TaskCard";
import { API_BASE } from "@/util/path";

export type Task = {
  id?: string;
  // title: string; TODO: Add Later
  status: string;
  due_date: string;
  description: string;
  type: string;
  assignee_id: number;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]); // State to store tasks
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // State for selected task
  const [error, setError] = useState<string | null>(null); // State for error handling

  useEffect(() => {
    // Fetch tasks from the backend
    fetch(`${API_BASE}/tasks`) 
      .then((response) => {
        return response.json();
      })
      .then((returnedTasks) => {
        setTasks(returnedTasks); // Update the tasks state
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setError(error.message); // Set the error state
      });
  }, []); // Empty dependency array ensures this runs once on mount

  const onTaskPreviewClick = (task: Task) => {
    setSelectedTask(task); // Update selected task state
  };

  if (error) {
    return <div>Tasks Failed to Load. Ran into error: {error}</div>; // Display error if fetch fails
  }

  return (
    <div>
      <h1>Tasks</h1>
      {tasks.length > 0 ? (
        <TaskList tasks={tasks} onTaskPreviewClick={onTaskPreviewClick} />
      ) : (
        <p>Loading tasks...</p> // Display a loading message while fetching
      )}
      {selectedTask && (
        <TaskCard
          id={selectedTask.id || "Task has no ID!"}
          // title={selectedTask.title} TODO: Add later
          due_date={selectedTask.due_date}
          description={selectedTask.description}
          type={selectedTask.type}
          status={selectedTask.status}
          assignee_id={selectedTask.assignee_id}
        />
      )}
    </div>
  );
}
