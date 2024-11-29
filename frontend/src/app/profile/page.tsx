"use client";

import React, { useState, useEffect } from "react";
import { Employee } from "@/util/ZodTypes";
import { API_BASE } from "@/util/path";

export default function Profile() {
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // Hardcoded for now-- will be login based later
    const employee_name = "Aryan Sajith";
    const encoded_employee_name = encodeURIComponent(employee_name);

    useEffect(() => {
        fetch(`${API_BASE}/employee/${encoded_employee_name}`)
            .then((response) => response.json())
            .then((employee: Employee) => {
                setSelectedEmployee(employee);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(`Failed to fetch employee: ${employee_name}`, error);
            });
    }, []);

    return (
        <div className="flex items-center justify-center h-screen">
            {isLoading ? (
                <p className="text-lg font-semibold text-gray-600">Loading...</p>
            ) : (
                selectedEmployee && (
                    <div className="dark:bg-gray-800 shadow-md rounded-lg p-24 w-3/5 h-auto max-w-xl">
                        <img
                            src={"https://static.vecteezy.com/system/resources/previews/011/961/865/non_2x/programmer-icon-line-color-illustration-vector.jpg"} // Placeholder if image URL isn't provided
                            alt={`${selectedEmployee.name} profile`}
                            className="w-32 h-32 rounded-full mx-auto mb-4"
                        />
                        <h1 className="text-white text-3xl font-bold text-center text-gray-800">
                            {selectedEmployee.name}
                        </h1>
                        <h2 className="text-2xl text-center text-gray-400 mb-4">
                            {selectedEmployee.position}
                        </h2>
                        <div className="text-xl text-center text-gray-200 font-mono space-y-3">
                            <p>
                                <strong>Level:</strong> {selectedEmployee.level}
                            </p>
                            <p>
                                <strong>Salary:</strong> ${selectedEmployee.salary.toLocaleString()}
                            </p>
                            <p>
                                <strong>Start Date:</strong>{" "}
                                {new Date(selectedEmployee.start_date).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Birth Date:</strong>{" "}
                                {new Date(selectedEmployee.birth_date).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Status:</strong> {selectedEmployee.status}
                            </p>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
