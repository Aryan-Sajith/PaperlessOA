"use client";
import React, { useState, useEffect, use } from "react";
import TaskList from "@/components/TaskList";
import AddTaskView from "@/components/AddTaskView";
import { API_BASE } from "@/util/path";
import { useAuth } from "@/hooks/useAuth";
import TasksToggle, { taskViewType } from "@/components/TasksToggle";
import { sortTasks } from "@/util/sort";

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
        setTasks(returnedTasks['message'] ? [] : sortTasks(returnedTasks)); // Sort tasks by status and due date if any tasks are returned
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
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>
      {/* Tasks Toggle Slider: */}
      {user?.is_manager && (
        <TasksToggle onToggle={view => {
          fetchTasks(view);
          setCurrentView(view);
        }} />
      )}
      {/* Task List: */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length > 0 ? (
        <TaskList tasks={tasks} setTasks={setTasks} refetchTasks={() => fetchTasks(currentView)} />
      ) : ( // If no tasks exist, display a UX friendly message
        <div style={{
          textAlign: 'center',
          margin: '2rem',
          color: '#666'
        }}>
          <p>No tasks yet, feel free to assign!</p>
        </div>
      )}

      {/* Add Task View: */}
      <AddTaskView
        setTasks={setTasks}
        refetchTasks={() => fetchTasks(currentView)}
      />
    </div>
  );
}