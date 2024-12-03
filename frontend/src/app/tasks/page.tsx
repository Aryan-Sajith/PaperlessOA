"use client";
import React, { useState, useEffect } from "react";
import TaskList from "@/components/TaskList";
import AddTaskView from "@/components/AddTaskView";
import { API_BASE } from "@/util/path";
import { useAuth } from "@/hooks/useAuth";
import TasksToggle, { taskViewType } from "@/components/TasksToggle";

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
  const [currentView, setCurrentView] = useState<taskViewType>("My");
  const { user, loading } = useAuth();

  const fetchTasks = async (view: string) => {
    if (!loading && user) {
      // Fetch tasks based on view(Personal or Subordinates)
      const url = view === "My"
        ? `${API_BASE}/tasks/employee/${user.employee_id}` // Personal tasks
        : `${API_BASE}/tasks/manager/${user.employee_id}`; // Subordinate tasks
      try {
        // If no error occurs, fetch tasks and set tasks state
        const response = await fetch(url);
        const returnedTasks = await response.json();
        setTasks(returnedTasks);
      } catch (error) { // If an error occurs, log it and set error state
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
  }, [user, loading]); // Fetch tasks when user or loading status changes

  if (loading) return <div>Loading user data...</div>;
  if (error) return <div>Tasks Failed to Load. Ran into error: {error}</div>;

  return (
    <div>
      {/* Tasks Toggle Slider: */}
      <TasksToggle onToggle={view => {
        fetchTasks(view);
        setCurrentView(view);
      }} />

      {/* Task List: */}
      {tasks.length > 0 ? (
        <TaskList tasks={tasks} setTasks={setTasks} />
      ) : (
        <p>Loading tasks...</p>
      )}

      {/* Add Task View: */}
      <AddTaskView
        setTasks={setTasks}
        refetchTasks={() => fetchTasks(currentView)}
      />
    </div>
  );
}