import React from "react";
import { Task } from "@/app/tasks/page";
import TaskCard from "./TaskCard";

type TaskListProps = {
    tasks: Task[];
}

export default function TaskList({
   tasks,
}: TaskListProps) {
    return (
    <div>
         {/* TODO: Using Task id as title(for now) */}
        {tasks.map((task) => (
            <TaskCard
            key={task.id} 
            id={task.id || "No ID assigned for this task"} 
            assignee_id={task.assignee_id} 
            status={task.status}
            description={task.description}
            type={task.type}
            due_date={task.due_date}
            />))}
    </div>
    );
}