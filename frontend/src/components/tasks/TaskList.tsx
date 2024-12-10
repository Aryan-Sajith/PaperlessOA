import React, { useEffect, useState } from "react";
import { Task } from "@/app/tasks/page";
import TaskCard from "./TaskCard";
import { API_BASE } from "@/util/api-path";

type TaskListProps = {
    tasks: Task[]; // List of tasks to display
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>; // Function to update tasks state
    refetchTasks: () => void; // Function to refetch tasks so that the UI updates after editing
};

export default function TaskList({
    tasks,
    setTasks,
    refetchTasks
}: TaskListProps) {
    // State to store assignee names instead of utilizing IDs in the UI
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
        console.log(`Tasks Received: ${JSON.stringify(tasks)}`);

        const fetchAllAssigneeNames = async () => {
            console.log(`Fetching Assignee Names for ${tasks.length} tasks`);
            const names: Record<number, string> = { ...assigneeNames }; // Start with the current state

            await Promise.all(
                tasks.map(async (task) => {
                    // Fetch name only if not already fetched
                    if (!names[task.assignee_id]) {
                        console.log(`Fetching Assignee Name for Task: ${task.assignee_id}`);
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
        <div data-testid="task-list">
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    id={task.id}
                    assigned_to={assigneeNames[task.assignee_id] || "Loading..."}
                    assignee_id={task.assignee_id}
                    status={task.status}
                    description={task.description}
                    type={task.type}
                    due_date={task.due_date}
                    setTasks={setTasks}
                    refetchTasks={refetchTasks}
                />
            ))}
        </div>
    );
}
