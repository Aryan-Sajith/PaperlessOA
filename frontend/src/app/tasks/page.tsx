// This is the /tasks page
"use client"; // Ensures that we treat the tasks page as client-side
import React, { useState } from "react";
import TaskList from "@/components/TaskList";
import TaskCard from "@/components/TaskCard";

export type Task = {
  id: string;
  title: string;
  status: string;
  due_date: string;
  description: string;
  type: string;
  assignee: string;
}

export default function tasks() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const onTaskPreviewClick = (task: Task) => {
    setSelectedTask(task);
  }

  // Hard-coded tasks for testing purposes
  const tasks: Task[] = [
    { id: "1", title: "Task 1", due_date: "2024-11-15", description: "Details about Task 1", assignee: "Aryan", status: "incomplete", type: "High priority" },
    { id: "2", title: "Task 2", due_date: "2024-11-16", description: "Details about Task 2", assignee: "William", status: "complete", type: "Low priority" },
  ];

  return (
    <div>
      <h1>Tasks</h1>
      <TaskList tasks={tasks} onTaskPreviewClick={onTaskPreviewClick} />
      {selectedTask && (
        <TaskCard
          id={selectedTask.id}
          title={selectedTask.title}
          due_date={selectedTask.due_date}
          description={selectedTask.description}
          type={selectedTask.type}
          status={selectedTask.status}
          assignee={selectedTask.assignee}
        />
      )}
    </div>
  );
}
