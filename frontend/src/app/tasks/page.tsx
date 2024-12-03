"use client";
import React, { useState, useEffect } from "react";
import TaskList from "@/components/TaskList";
import AddTaskView from "@/components/AddTaskView";
import { API_BASE } from "@/util/path";
import { useAuth } from "@/hooks/useAuth";
import TasksToggle from "@/components/TasksToggle";

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
  const { user, loading } = useAuth();

  const fetchTasks = async (view: string) => {
    if (!loading && user) {
      const url = view === "My"
        ? `${API_BASE}/tasks/employee/${user.employee_id}`
        : `${API_BASE}/tasks`;

      try {
        const response = await fetch(url);
        const returnedTasks = await response.json();
        setTasks(returnedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    }
  };

  useEffect(() => {
    fetchTasks("My"); // Load personal tasks by default
  }, [user, loading]);

  if (loading) return <div>Loading user data...</div>;
  if (error) return <div>Tasks Failed to Load. Ran into error: {error}</div>;

  return (
    <div>
      <TasksToggle onToggle={view => fetchTasks(view)} />
      {tasks.length > 0 ? (
        <TaskList tasks={tasks} setTasks={setTasks} />
      ) : (
        <p>Loading tasks...</p>
      )}
      <AddTaskView setTasks={setTasks} />
    </div>
  );
}