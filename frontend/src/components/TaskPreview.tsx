import React from "react";

type TaskPreviewProps = {
    title: string;
    due_date: string;
    onClick: () => void;
}

export default function TaskPreview({
    title,
    due_date,
    onClick
}: Readonly<TaskPreviewProps>) {
    return (
        <div
            onClick={onClick}
            className="flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md"
        >
            <p className="text-md font-medium">{title}</p>
            <span className="text-sm text-gray-500">{due_date}</span>
        </div>
    );
}

