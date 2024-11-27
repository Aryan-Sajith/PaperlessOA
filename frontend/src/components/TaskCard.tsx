import React from "react";
import { useState } from "react";

// TODO: Using Task ID as title(for now)
type TaskCardProps = {
    id: string;  
    assignee_id: number;
    // title: string; TODO: Add later
    status: string;
    description: string;
    type: string;
    due_date: string;
}

export default function TaskCard({
    id,
    assignee_id,
    status,
    description,
    type,
    due_date,
}: Readonly<TaskCardProps>) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            onClick={() => {setIsExpanded(!isExpanded)}}
            className="flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md"
        >
            <p className="text-md font-medium">{description}</p>
            <span className="text-sm text-gray-500">{due_date}</span>

            {isExpanded && 
            <div className="bg-white shadow-md rounded-md p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">{`Title(ID For now): ${id}`}</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li><strong>Status:</strong> {status}</li>
                <li><strong>Due Date:</strong> {due_date} </li>
                <li><strong>Description:</strong> {description}</li>
                <li><strong>Type:</strong> {type}</li>
                <li><strong>Assignee_ID:</strong> {assignee_id}</li>
            </ul>
        </div>
            }
        </div>
    );
}

