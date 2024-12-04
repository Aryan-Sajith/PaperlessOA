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
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in progress':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
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
        <div className="mb-4">
            <div
                className="bg-white rounded-lg shadow-sm border border-blue-200"
            >
                {/* Main Card Content */}
                <div className="p-4">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                {/* Task Status: */}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                                    {status}
                                </span>
                                {/* Task Type: */}
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {type}
                                </span>
                            </div>
                            <p className="text-gray-900 font-medium">{description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Edit Task: */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditing(!isEditing);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <Edit3 className="w-4 h-4 text-gray-500" />
                            </button>

                            {/* Delete Task: */}
                            <button
                                onClick={handleDelete}
                                className="p-2 hover:bg-red-50 rounded-full transition-colors"
                            >
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            {/* Due Date: */}
                            <CalendarDays className="w-4 h-4" />
                            <span>{due_date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {/* Assigned To: */}
                            <User className="w-4 h-4" />
                            <span>{assigned_to}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit View */}
            {isEditing && (
                <div onClick={(event) => event.stopPropagation()} className="mt-2">
                    <EditTaskView
                        task_to_update={{ id, assignee_id, status, description, type, due_date }}
                        setTasks={setTasks}
                        setIsEditing={setIsEditing}
                        refetchTasks={refetchTasks}
                    />
                </div>
            )}
        </div>
    );
}