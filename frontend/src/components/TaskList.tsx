import React, { useEffect, useState } from "react";
import { Task } from "@/app/tasks/page";
import TaskCard from "./TaskCard";
import { API_BASE } from "@/util/path";

type TaskListProps = {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

export default function TaskList({
    tasks,
    setTasks
}: TaskListProps) {
    const [assigneeNames, setAssigneeNames] = useState<Record<number, string>>({});

    // Function to fetch assignee names
    const fetchAssigneeName = async (assignee_id: number) => {
        try {
            const response = await fetch(`${API_BASE}/employee/${assignee_id}`);

            if (!response.ok) {
                return "Unassigned(Assignee could not be retrieved from database)";
            }
            
            const data = await response.json();
            return data.name || "Unassigned(Assignee could not be retrieved from database)";
        } catch (error) {
            console.error(error);
            return "Unassigned";
        }
    };

    // Fetch all assignee names
    useEffect(() => {
        const fetchAllAssigneeNames = async () => {
            const names: Record<number, string> = { ...assigneeNames }; // Start with the current state

            await Promise.all(
                tasks.map(async (task) => {
                    // Fetch name only if not already fetched
                    if (!names[task.assignee_id]) {
                        const name = await fetchAssigneeName(task.assignee_id);
                        names[task.assignee_id] = name;
                    }
                })
            );
            
            setAssigneeNames(names); // Update state after all names are fetched
        };

        if (tasks.length > 0) { // Only fetch Assignee names if some tasks exist
            fetchAllAssigneeNames();
        }
    }, [tasks]);

    return (
        <div>
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    id={task.id} 
                    assigned_to={assigneeNames[task.assignee_id] || "Loading..."}
                    status={task.status}
                    description={task.description}
                    type={task.type}
                    due_date={task.due_date}
                    setTasks={setTasks}
                />
            ))}
        </div>
    );
}
