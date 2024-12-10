"use client";

import React, { useState } from "react";
import AddNEditTaskEmployeeDropDown from '@/components/tasks/AddNEditTaskEmployeeDropDown';
import { SingleValue } from 'react-select';
import { Employee, TaskStatus, TaskType } from '@/util/ZodTypes';
import { Task } from "@/app/tasks/page";
import { API_BASE } from "@/util/api-path";
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
    // Add Task view UI container
    <div className="fixed bottom-5 right-5">
      {/* Add task button */}
      <button data-testid="make-task"
        onClick={() => setIsViewOpen(!isViewOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center duration-200 
          ${isViewOpen ?
            'bg-red-500 hover:bg-red-600' :
            'bg-blue-500 hover:bg-blue-600'}`}
      >
        {/* Button Icon Variation */}
        {isViewOpen ? <X className="h-6 w-6 text-white" /> : <Plus className="h-6 w-6 text-white" />}
      </button>

      {/* Add task view */}
      {isViewOpen && (
        // Add task form UI container
        <div className="absolute bottom-20 right-5 w-80 bg-white rounded-lg p-5 space-y-2 animate-slide-up">
          {/* Add task form header */}
          <h3 className="text-lg font-semibold">Add New Task</h3>

          {/* Add task form fields */}
          <div className="space-y-4">
            {/* Task status */}
            <div>
              <label className="block font-medium text-sm mb-1">Status</label>
              <TaskStatusDropdown
                onStatusSelect={status => setTaskData(prev => ({ ...prev, status }))}
                currentStatus={taskData.status as TaskStatus}
              />
            </div>

            {/* Task due date UI container*/}
            <div>
              {/* Task due date label */}
              <label className="block font-medium text-sm mb-1">Due Date</label>
              {/* Task due date input */}
              <div className="relative">
                <CalendarDays className="absolute h-5 w-5 left-3 top-2.5 text-gray-600" />
                <input
                  type="date"
                  value={taskData.due_date}
                  onChange={e => setTaskData(prev => ({ ...prev, due_date: e.target.value }))}
                  className="pl-8 w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Task description UI container*/}
            <div>
              {/* Task description label */}
              <label className="block font-medium text-sm mb-1">Description</label>
              {/* Task description input */}
              <div className="relative">
                <FileText className="absolute h-5 w-5 left-3 top-2.5 text-gray-600" />
                <input
                  type="text"
                  value={taskData.description}
                  onChange={e => setTaskData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter task description"
                  className="pl-9 w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Task type dropdown */}
            <div>
              <label className="block font-medium text-sm mb-1">Type</label>
              <TaskTypeDropdown
                onTypeSelect={type => setTaskData(prev => ({ ...prev, type }))}
                currentType={taskData.type as TaskType}
              />
            </div>

            {/* Task assignee dropdown */}
            <div>
              <label className="block font-medium text-sm mb-1">Assign To</label>
              <AddNEditTaskEmployeeDropDown
                onEmployeeSelect={assignee => {
                  if (assignee) {
                    setSelectedAssignee(assignee);
                    setTaskData(prev => ({ ...prev, assignee_id: assignee.employee_id }));
                  }
                }}
                showSubordinatesAndUser={true}
              />
            </div>

            {/* Task add button */}
            <button
              onClick={handleAddTask}
              className="w-full p-2 bg-blue-500 hover:bg-blue-600 flex justify-center items-center rounded-md text-white"
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