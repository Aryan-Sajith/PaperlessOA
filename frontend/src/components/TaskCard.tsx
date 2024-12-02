import React from "react";
import { useState } from "react";
import EditTaskView from "./EditTaskView"
import { Task } from "@/app/tasks/page";
import { API_BASE } from "@/util/path";

type TaskCardProps = {
    id: string | undefined;  
    assigned_to: string;
    assignee_id: number;
    status: string;
    description: string;
    type: string;
    due_date: string;
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function TaskCard({
    id,
    assigned_to,
    assignee_id,
    status,
    description,
    type,
    due_date,
    setTasks
}: Readonly<TaskCardProps>) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div
            onClick={() => {
                setIsExpanded(!isExpanded); 
            }}
            className="flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md"
        >
            <p className="text-md font-medium">{description}</p>
            <span className="text-sm text-gray-500">{due_date}</span>

            {/* Expanded Description Task Card here: */}
            {isExpanded && !isEditing &&  
                <div className="bg-white shadow-md rounded-md p-4 border border-gray-200">
                    <div className ="flex justify-between items-center mb-2">
                    <img src="/icons/task-edit.svg" alt="task edit icon" className="w-10 h-10"
                    onClick={event => {
                        event.stopPropagation(); // Ensures that we don't un-expand the card if we click on the edit icon
                        // alert("Edit task clicked for task: " + description);
                        setIsEditing(!isEditing);
                    }}
                    ></img>

                    {/* Delete task here: */}
                    <img src="/icons/task-delete.svg" alt="task delete icon" className="w-8 h-7"
                    onClick={event => {
                        event.stopPropagation(); // Ensures that we don't un-expand the card if we click on the delete icon
                        fetch(`${API_BASE}/delete_task/${id}`, {method: "DELETE"})
                        .then(response => response.json())
                        .then(_ => { // Update tasks so that deleted task is removed from the list
                            alert(`Successfully deleted the following task: \n${description}`);
                            setTasks((prevTasks) => prevTasks.filter(task => task.id !== id));
                        })
                        .catch(error => console.error("Error deleting task:", error));
                    }}
                    ></img>
                    </div>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                        <li><strong>Status:</strong> {status}</li>
                        <li><strong>Due Date:</strong> {due_date} </li>
                        <li><strong>Description:</strong> {description}</li>
                        <li><strong>Type:</strong> {type}</li>
                        <li><strong>Assigned To:</strong> {assigned_to}</li>
                    </ul>
                </div>
            }

            {/* Expanded Editing Task Card here: */}
            {isExpanded && isEditing &&
                <div onClick={(event) => event.stopPropagation()}> {/* Critical to ensuring card doesn't un-expand while editing*/}
                    <EditTaskView task_to_update={
                        { id, assignee_id, status, description, type, due_date }} 
                        setTasks={setTasks} 
                        setIsEditing={setIsEditing}/>
                </div>
            }
        </div>
    );
}

