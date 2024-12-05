import React from "react";
import { useState } from "react";
import EditTaskView from "./EditTaskView";
import { Task } from "@/app/tasks/page";
import { API_BASE } from "@/util/path";
import { CalendarDays, Edit3, Trash2, User } from "lucide-react";

type TaskCardProps = {
    id: string | undefined;
    assigned_to: string;
    assignee_id: number;
    status: string;
    description: string;
    type: string;
    due_date: string;
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>; // Function to update tasks state
    refetchTasks: () => void; // Function to refetch tasks so that the UI updates after editing
};

export default function TaskCard({
    id,
    assigned_to,
    assignee_id,
    status,
    description,
    type,
    due_date,
    setTasks,
    refetchTasks
}: Readonly<TaskCardProps>) {
    const [isEditing, setIsEditing] = useState(false);

    // Function to map status string to color
    const statusColors: { [key: string]: string } = {
        completed: 'bg-green-100 text-green-800',
        'in progress': 'bg-blue-100 text-blue-800',
        default: 'bg-gray-100 text-gray-800'
    };

    // Function to handle task deletion
    const handleDelete = async (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent card expansion on delete
        try {
            const response = await fetch(`${API_BASE}/delete_task/${id}`, {
                method: "DELETE"
            });
            const data = await response.json();
            alert(`Successfully deleted the following task: \n${description}`);
            // Update tasks state by removing the deleted task
            setTasks((prevTasks) => prevTasks.filter(task => task.id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        // Task card UI container
        <div className="p-4 mb-4 border rounded bg-gray-100 shadow-lg shadow-black-300">
            {/* Task preview UI container */}
            <div className="flex justify-between">
                <div>
                    {/* Task status */}
                    <span className={`px-5 py-1 rounded text-xs font-semibold ${statusColors[status.toLowerCase()] || statusColors.default}`}>
                        {`Status: ${status}`}
                    </span>
                    {/* Task type */}
                    <span className="px-5 py-1 ml-3 rounded text-xs font-semibold text-gray-600 bg-gray-300">
                        {`Type: ${type}`}
                    </span>
                    {/* Task description */}
                    <p className="font-medium mt-2 ml-1">{description}</p>
                    {/* Task metadata UI container */}
                    <div className="flex gap-4 mt-3 text-sm text-gray-500">
                        {/* Task due date */}
                        <span className="flex items-center gap-1">
                            <CalendarDays className="w-4 h-4 text-gray-700" />
                            {due_date}
                        </span>
                        {/* Task assignee */}
                        <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {assigned_to}
                        </span>
                    </div>
                </div>
                {/* Task modification buttons container*/}
                <div className="flex items-center gap-6">
                    {/* Edit task button */}
                    <button onClick={(e) => {
                        e.stopPropagation(); // Prevent card expansion on edit
                        setIsEditing(!isEditing); // Toggle edit view
                    }} className="hover:p-2 hover:bg-gray-300 rounded">
                        <Edit3 className="w-4 h-4 text-black-500" />
                    </button>
                    {/* Delete task button */}
                    <button onClick={handleDelete} className="hover:p-2 hover:bg-red-200 rounded">
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                </div>
            </div>
            
            {/* Edit task view */}
            {isEditing && (
                <EditTaskView
                    task_to_update={{ id, assignee_id, status, description, type, due_date }}
                    setTasks={setTasks}
                    setIsEditing={setIsEditing}
                    refetchTasks={refetchTasks}
                />
            )}
        </div>
    );
}