import React, { useState } from "react";
import EmployeeDropdown from '@/components/EmployeeDropDown';
import { SingleValue } from 'react-select';
import { Employee } from '@/util/ZodTypes';
import { Task } from "@/app/tasks/page";
import { API_BASE } from "@/util/path";

type editTaskViewProps = {
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditTaskView({ setTasks, setIsEditing }: editTaskViewProps) {
    const [selectedAssignee, setSelectedAssignee] = useState<Employee | null>(null);
    const [taskData, setTaskData] = useState<Omit<Task, "id">>({
        status: "",
        due_date: "",
        description: "",
        type: "",
        assignee_id: 1, // Default assignee(for now), we can update this later when login is setup 
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

    const handleAddTask = () => {
        fetch(`${API_BASE}/create_task`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
        })
            .then((response) => response.json())
            .then((newTask: Task) => {
                setTasks((prevTasks) => [...prevTasks, newTask]); // Add new task
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
                console.error("Error creating task:", error);
            });
    };

    const handleSelectAssignee = (assignee: SingleValue<Employee>) => {
        if (assignee) {
            setSelectedAssignee(assignee.value);

            // Update assignee_id since valid employee has been selected
            setTaskData((prev) => ({
                ...prev,
                assignee_id: assignee.value.employee_id,
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
            {/* Edit Task View */}
            <div
                style={{
                    position: "fixed",
                    bottom: "100px",
                    right: "20px",
                    width: "300px",
                    padding: "15px",
                    backgroundColor: "white",
                    borderRadius: "10px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}
            >
                <input
                    type="text"
                    name="status"
                    placeholder="Status"
                    value={taskData.status}
                    onChange={handleInputChange}
                    style={{
                        padding: "8px",
                        fontSize: "14px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                    }}
                />
                <input
                    type="date"
                    name="due_date"
                    placeholder="Due Date"
                    value={taskData.due_date}
                    onChange={handleInputChange}
                    style={{
                        padding: "8px",
                        fontSize: "14px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                    }}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={taskData.description}
                    onChange={handleInputChange}
                    style={{
                        padding: "8px",
                        fontSize: "14px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                    }}
                />
                <input
                    type="text"
                    name="type"
                    placeholder="Type"
                    value={taskData.type}
                    onChange={handleInputChange}
                    style={{
                        padding: "8px",
                        fontSize: "14px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                    }}
                />
                <div>
                    <EmployeeDropdown onEmployeeSelect={handleSelectAssignee} />
                </div>
                <button
                    onClick={handleAddTask}
                    style={{
                        backgroundColor: "#2ecc71",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "10px",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                >
                    ✓ Add Task
                </button>
            </div>
        </div>
    );
}
