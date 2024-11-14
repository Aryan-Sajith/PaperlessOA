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
        {tasks.map((task) => (<TaskPreview key={task.id} title={task.title} due_date={task.due_date} onClick={() => onTaskPreviewClick(task)}/>))}
    </div>
    );
}