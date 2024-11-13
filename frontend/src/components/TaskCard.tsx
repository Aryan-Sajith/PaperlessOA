import React from "react";

type TaskProps = {
    title: string;
    status: string;
    due_date: string;
    description: string;
    type: string;
    assignee: string;
}

export default function TaskCard({
    title,
    status,
    due_date,
    description,
    type,
    assignee
}: Readonly<TaskProps>) {
    return (
        <div className="bg-white shadow-md rounded-md p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li><strong>Status:</strong> {status}</li>
                <li><strong>Due Date:</strong> {due_date} </li>
                <li><strong>Description:</strong> {description}</li>
                <li><strong>Type:</strong> {type}</li>
                <li><strong>Assignee:</strong> {assignee}</li>
            </ul>
        </div>
    );
}