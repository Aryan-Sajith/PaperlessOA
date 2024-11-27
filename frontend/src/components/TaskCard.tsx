import React from "react";
import { useState } from "react";

type TaskCardProps = {
    assigned_to: string;
    status: string;
    description: string;
    type: string;
    due_date: string;
}

export default function TaskCard({
    assigned_to,
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
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li><strong>Status:</strong> {status}</li>
                <li><strong>Due Date:</strong> {due_date} </li>
                <li><strong>Description:</strong> {description}</li>
                <li><strong>Type:</strong> {type}</li>
                <li><strong>Assigned To:</strong> {assigned_to}</li>
            </ul>
        </div>
            }
        </div>
    );
}

