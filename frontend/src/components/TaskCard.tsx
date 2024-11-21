import React from "react";

type TaskProps = {
    id: string;  
    title: string;
    status: string;
    due_date: string;
    description: string;
    type: string;
    assignee_id: number;
}

export default function TaskCard({
    id,
    title,
    status,
    due_date,
    description,
    type,
    assignee_id
}: Readonly<TaskProps>) {
    return (
        <div className="bg-white shadow-md rounded-md p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li><strong>Status:</strong> {status}</li>
                <li><strong>Due Date:</strong> {due_date} </li>
                <li><strong>Description:</strong> {description}</li>
                <li><strong>Type:</strong> {type}</li>
                <li><strong>Assignee_ID:</strong> {assignee_id}</li>
            </ul>
        </div>
    );
}