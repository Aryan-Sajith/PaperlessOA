import React, { useState } from "react";
import AddNEditTaskEmployeeDropDown from '@/components/AddNEditTaskEmployeeDropDown';
import { SingleValue } from 'react-select';
import { Employee, TaskStatus, TaskType } from '@/util/ZodTypes';
import { Task } from "@/app/tasks/page";
import { API_BASE } from "@/util/path";
import TaskStatusDropdown from "./TaskStatusDropdown";
import { CalendarDays, FileText, Save, Type } from "lucide-react";
import TaskTypeDropdown from "./TaskTypeDropdown";

type editTaskViewProps = {
    task_to_update: Task; // Specifies the task to update
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>; // Function to update tasks state
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>; // Function to toggle edit view
    refetchTasks: () => void; // Function to refetch tasks so that the UI updates after editing
};

export default function EditTaskView({ task_to_update, setTasks, setIsEditing, refetchTasks }: editTaskViewProps) {
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
                refetchTasks(); // Refetch tasks to update UI
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
        // Edit task view UI container
        <div className="bg-gray-100 mt-2">
            {/* Task form UI container */}
            <div className="space-y-3">
                {/* Task status dropdown */}
                <TaskStatusDropdown
                    onStatusSelect={status => setTaskData(prev => ({ ...prev, status }))}
                    currentStatus={taskData.status as TaskStatus}
                />

                {/* Task due date input */}
                <div className="relative">
                    <CalendarDays className="absolute top-2 left-3 text-gray-600" />
                    <input
                        type="date"
                        name="due_date"
                        value={taskData.due_date}
                        onChange={handleInputChange}
                        className="w-full pl-10 h-10 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Task description input */}
                <div className="relative">
                    <FileText className="absolute top-2 left-3 text-gray-600" />
                    <input
                        type="text"
                        name="description"
                        value={taskData.description}
                        onChange={handleInputChange}
                        placeholder="Enter task description"
                        className="w-full pl-10 h-10 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Task type dropdown */}
                <TaskTypeDropdown
                    onTypeSelect={type => setTaskData(prev => ({ ...prev, type }))}
                    currentType={taskData.type as TaskType}
                />

                {/* Task assignee dropdown */}
                <AddNEditTaskEmployeeDropDown
                    onEmployeeSelect={handleSelectAssignee}
                    assignee_id={task_to_update.assignee_id}
                    showSubordinatesAndUser={true}
                />

                {/* Update task button */}
                <button
                    onClick={handleEditTask}
                    className="w-full flex items-center justify-center rounded-md p-2 bg-green-400 hover:bg-green-500"
                >
                    <Save className="h-4.5 w-5 mr-1" />
                    Update Task
                </button>
            </div>
        </div>
    );
}