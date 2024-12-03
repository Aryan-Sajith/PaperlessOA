"use client";
import React, { useState, useEffect } from "react";
import TaskList from "@/components/TaskList";
import AddTaskView from "@/components/AddTaskView";
import { API_BASE } from "@/util/path";
import { useAuth } from "@/hooks/useAuth";

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user, loading } = useAuth(); // Add loading from useAuth

  useEffect(() => {
    if (!loading && user) { // Only fetch if authentication is completed and user exists
      fetch(`${API_BASE}/tasks/employee/${user.employee_id}`)
        .then((response) => response.json())
        .then((returnedTasks) => {
          setTasks(returnedTasks);
        })
        .catch((error) => {
          console.error("Error fetching tasks:", error);
          setError(error.message);
        });
    }
  }, [user, loading]); // Add user and loading as dependencies

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div>Tasks Failed to Load. Ran into error: {error}</div>;
  }

  return (
    <div>
      <h1>Tasks</h1>
      {tasks.length > 0 ? (
        <TaskList tasks={tasks} setTasks={setTasks} />
      ) : (
        <p>Loading tasks...</p>
      )}
      <AddTaskView setTasks={setTasks} />
    </div>
  );
}
