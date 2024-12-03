import React, { useState } from "react";
import EmployeeDropdown from '@/components/EmployeeDropDown';
import { SingleValue } from 'react-select';
import { Employee, TaskStatus } from '@/util/ZodTypes';
import { Task } from "@/app/tasks/page";
import { API_BASE } from "@/util/path";
import TaskStatusDropdown from "./TaskStatusDropdown";
import { CalendarDays, FileText, Save, Type } from "lucide-react";

type editTaskViewProps = {
    task_to_update: Task;
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditTaskView({ task_to_update, setTasks, setIsEditing }: editTaskViewProps) {
    const [selectedAssignee, setSelectedAssignee] = useState<Employee | null>(null);
    const [taskData, setTaskData] = useState<Omit<Task, "id">>({
        status: task_to_update.status,
        due_date: task_to_update.due_date,
        description: task_to_update.description,
        type: task_to_update.type,
        assignee_id: task_to_update.assignee_id,
    }); // Task form state

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setTaskData((prev) => ({
            ...prev,
            [name]: name === "assignee_id" ? parseInt(value, 10) : value, // Ensure assignee_id is a number
        }));
    };

    const handleEditTask = () => {
        fetch(`${API_BASE}/update_task/${task_to_update.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
        })
            .then((response) => response.json())
            .then((newTask: Task) => {
                setTasks(prevTasks => prevTasks.map(task => task.id === task_to_update.id ? newTask : task));
                setTaskData({
                    status: "",
                    due_date: new Date().toISOString().split("T")[0], // Default to today's date
                    description: "",
                    type: "",
                    assignee_id: 0,
                }); // Reset form
                setIsEditing(false); // Close the view
            })
            .catch((error) => {
                console.error("Error updating task:", error);
            });
    };

    const handleSelectAssignee = (assignee: SingleValue<Employee>) => {
        if (assignee) {
            setSelectedAssignee(assignee);
            // Update assignee_id since valid employee has been selected
            setTaskData((prev) => ({
                ...prev,
                assignee_id: assignee.employee_id,
            }));
        } else { // Reset assignee_id if no employee is selected
            setSelectedAssignee(null);
            setTaskData((prev) => ({
                ...prev,
                assignee_id: 0, // Reset to a neutral state
            }));
        }
    };

    return (
        // Modern card container with consistent shadow and rounded corners
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            {/* Status dropdown wrapper with improved spacing */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <TaskStatusDropdown
                    onStatusSelect={(status) =>
                        setTaskData((prev) => ({ ...prev, status }))
                    }
                    currentStatus={taskData.status as TaskStatus}
                />
            </div>

            {/* Date input group with icon */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarDays className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="date"
                        name="due_date"
                        value={taskData.due_date}
                        onChange={handleInputChange}
                        className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm h-10"
                    />
                </div>
            </div>

            {/* Description input group with icon */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        name="description"
                        value={taskData.description}
                        onChange={handleInputChange}
                        className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm h-10"
                        placeholder="Enter task description"
                    />
                </div>
            </div>

            {/* Type input group with icon */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Type className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        name="type"
                        value={taskData.type}
                        onChange={handleInputChange}
                        className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm h-10"
                        placeholder="Enter task type"
                    />
                </div>
            </div>

            {/* Employee dropdown wrapper */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Assignee</label>
                <EmployeeDropdown
                    onEmployeeSelect={handleSelectAssignee}
                    assignee_id={task_to_update.assignee_id}
                />
            </div>

            {/* Update button with icon and hover effect */}
            <button
                onClick={handleEditTask}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
                <Save className="h-5 w-5" />
                Update Task
            </button>
        </div>
    );
}
