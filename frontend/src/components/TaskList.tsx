import React from "react";
import { Task } from "@/app/tasks/page";
import TaskPreview from "./TaskPreview";

type TaskListProps = {
    tasks: Task[];
    onTaskPreviewClick: (task: Task) => void;
}

export default function TaskList({
   tasks,
   onTaskPreviewClick 
}: TaskListProps) {
    return (
    <div>
         {/* TODO: Using Task id as title(for now) */}
        {tasks.map((task) => (<TaskPreview key={task.id} title={task.id} due_date={task.due_date} onClick={() => onTaskPreviewClick(task)}/>))}
    </div>
    );
}