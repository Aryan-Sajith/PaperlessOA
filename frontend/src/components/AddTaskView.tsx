"use client";

import React, { useState } from "react";
import AddNEditTaskEmployeeDropDown from '@/components/AddNEditTaskEmployeeDropDown';
import { SingleValue } from 'react-select';
import { Employee, TaskStatus, TaskType } from '@/util/ZodTypes';
import { Task } from "@/app/tasks/page";
import { API_BASE } from "@/util/path";
import TaskStatusDropdown from "./TaskStatusDropdown";
import { CalendarDays, FileText, Plus, Type, X } from "lucide-react";
import TaskTypeDropdown from "./TaskTypeDropdown";

type AddTaskViewProps = {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  refetchTasks: () => void;
};

export default function AddTaskView({ setTasks, refetchTasks }: AddTaskViewProps) {
  const [isViewOpen, setIsViewOpen] = useState(false); // Toggle Add Task view
  const [selectedAssignee, setSelectedAssignee] = useState<Employee | null>(null);
  const DEFAULT_ADD_TASK_VALUES = { // Ensures default add task values so that adding a task doesn't fail if no fields are filled
    description: "Task not described!",
    type: "Task type not specified!",
    status: "In Progress",
    assignee_id: 1,
  } as const;
  const [taskData, setTaskData] = useState<Omit<Task, "id">>({
    status: "",
    due_date: new Date().toISOString().split("T")[0], // Default to today's date
    description: "",
    type: "",
    assignee_id: 1, // Default assignee(for now), we can update this later when login is setup 
  }); // Task form state

  const toggleView = () => setIsViewOpen((prev) => !prev); // Open/close view

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: name === "assignee_id" ? parseInt(value, 10) : value, // Ensure assignee_id is a number
    }));
  };

  const handleAddTask = () => {
    const finalTaskData = { // Ensures default add task values are utilized for API request if no fields are filled
      ...taskData,
      description: taskData.description || DEFAULT_ADD_TASK_VALUES.description,
      type: taskData.type || DEFAULT_ADD_TASK_VALUES.type,
      status: taskData.status || DEFAULT_ADD_TASK_VALUES.status,
      assignee_id: taskData.assignee_id || DEFAULT_ADD_TASK_VALUES.assignee_id,
    }

    fetch(`${API_BASE}/create_task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalTaskData),
    })
      .then((response) => response.json())
      .then((newTask: Task) => {
        setTasks((prevTasks) => Array.isArray(prevTasks) ? [...prevTasks, newTask] : [newTask]);
        setTaskData({
          status: "",
          due_date: new Date().toISOString().split("T")[0], // Default to today's date
          description: "",
          type: "Other", // Default to "Other" task type
          assignee_id: 0,
        }); // Reset form
        setIsViewOpen(false); // Close the view
        refetchTasks(); // Refetch tasks to ensure the new task is displayed in the correct view
      })
      .catch((error) => {
        console.error("Error creating task:", error);
      });
  };

  const handleSelectAssignee = (assignee: SingleValue<Employee>) => {
    if (assignee) {
      setSelectedAssignee(assignee);
      setTaskData((prev) => ({
        ...prev,
        assignee_id: assignee.employee_id,
      }));
    } else {
      setSelectedAssignee(null);
      setTaskData((prev) => ({
        ...prev,
        assignee_id: 0, // Reset to a neutral state
      }));
    }
  };

  return (
    <div>
      {/* Enhanced Floating Action Button (FAB) with smooth transitions */}
      <button
        onClick={toggleView}
        className={`
                fixed bottom-5 right-5 
                w-14 h-14 
                rounded-full 
                shadow-lg 
                flex items-center justify-center 
                transition-all duration-300 ease-in-out
                hover:scale-105
                ${isViewOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}
            `}
        aria-label={isViewOpen ? "Close add task form" : "Open add task form"}
      >
        {/* Dynamic icon transition */}
        <div className="text-white">
          {isViewOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
        </div>
      </button>

      {/* Modal/Popup with enhanced styling and animations */}
      {isViewOpen && (
        <div className="fixed bottom-24 right-5 w-80 animate-slide-up">
          <div className="bg-white rounded-lg shadow-xl p-6 space-y-4 border border-gray-100">
            {/* Form Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Task
            </h3>

            {/* Status Dropdown Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <TaskStatusDropdown
                onStatusSelect={(status) =>
                  setTaskData((prev) => ({ ...prev, status }))
                }
                currentStatus={taskData.status as TaskStatus}
              />
            </div>

            {/* Date Input Group */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarDays className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="due_date"
                  value={taskData.due_date}
                  onChange={handleInputChange}
                  className="py-2 pl-10 block w-full rounded-md border-gray-300 shadow-sm 
                                         focus:ring-blue-500 focus:border-blue-500 
                                         transition-colors duration-200
                                         sm:text-sm h-10"
                />
              </div>
            </div>

            {/* Description Input Group */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="description"
                  value={taskData.description}
                  onChange={handleInputChange}
                  placeholder="Enter task description"
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm 
                                         focus:ring-blue-500 focus:border-blue-500 
                                         transition-colors duration-200
                                         sm:text-sm h-10"
                />
              </div>
            </div>

            {/* Task type dropdown wrapper with improved spacing */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <TaskTypeDropdown
                onTypeSelect={type =>
                  setTaskData((prev) => ({ ...prev, type }))
                }
                currentType={taskData.type as TaskType}
              />
            </div>

            {/* Employee Dropdown Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Assign To
              </label>
              <div className="relative">
                <AddNEditTaskEmployeeDropDown
                  onEmployeeSelect={handleSelectAssignee}
                  showSubordinatesAndUser={true}
                />
              </div>
            </div>

            {/* Add Task Button */}
            <button
              onClick={handleAddTask}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md
                                 hover:bg-blue-700 
                                 transition-colors duration-200
                                 flex items-center justify-center gap-2
                                 mt-6"
            >
              <Plus className="h-5 w-5" />
              Create Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
}