"use client";
import React, { useState } from "react";
import { Employee } from "@/util/ZodTypes";

interface EmployeeBoxProps {
    employee: Employee;
}

const joebiden = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Joe_Biden_presidential_portrait.jpg/1200px-Joe_Biden_presidential_portrait.jpg"

const EmployeeBox: React.FC<EmployeeBoxProps> = ({ employee }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };

    return (
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 my-4">
            <div 
                className="flex flex-col items-center cursor-pointer"
                onClick={toggleExpand}
            >
                {/* Circular Photo */}
                <img 
                    src={joebiden} 
                    alt={`${employee.name}'s photo`} 
                    className="w-24 h-24 rounded-full mb-4"
                />
                {/* Name */}
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {employee.name}
                </h2>
                {/* Attributes */}
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p>{employee.position}</p>
                    <p>{employee.salary}</p>
                    <p>{employee.status}</p>
                </div>
            </div>

            {/* Subordinates */}
            {/* {isExpanded && employee.subordinates && (
                <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                        Subordinates:
                    </h3>
                    <div className="mt-2 space-y-4">
                        {employee.subordinates.map((sub) => (
                            <EmployeeBox key={sub.id} employee={sub} />
                        ))}
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default EmployeeBox;
