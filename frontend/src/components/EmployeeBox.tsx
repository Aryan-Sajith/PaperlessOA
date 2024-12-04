"use client";
import React, { useState } from "react";
import { Employee } from "@/util/ZodTypes";
import { API_BASE } from '@/util/path';

interface EmployeeBoxProps {
    employee: Employee,
    subordinates: Employee[];
}

const joebiden = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Joe_Biden_presidential_portrait.jpg/1200px-Joe_Biden_presidential_portrait.jpg"

const EmployeeBox: React.FC<EmployeeBoxProps> = ({ employee, subordinates }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev)
    };

    return (
        <div className="block p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600 my-4">
            <div className="flex flex-row justify-center items-center space-x-5" onClick={toggleExpand}>
                    
                {/* Circular Photo */}
                <div className="flex-1 flex justify-end"> 
                    <img 
                        src={joebiden} 
                        alt={`${employee.name}'s photo`} 
                        className="w-24 h-24 rounded-full"
                    />
                </div>
                
                <div className="flex-1">
                    {/* Name */}
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {employee.name}
                    </h2>
                    {/* Attributes */}
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        <p className="font-bold">{employee.position}</p>
                        <p>Salary: {employee.salary}</p>
                        <p>Status: {employee.status}</p>
                    </div>
                </div>
                
            </div>

            {/* Subordinates */}
                {isExpanded && subordinates && subordinates.length>0 && (
                    <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                            Subordinates:
                        </h3>
                        <div className="mt-2 space-y-4">
                            {subordinates.map((sub) => (
                                <EmployeeBox key={sub.employee_id} employee={sub} subordinates={[]}/>
                            ))}
                        </div>
                    </div>
                )}
        </div>
    );
};

export default EmployeeBox;
