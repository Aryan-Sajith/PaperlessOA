"use client";
import React, { useEffect, useState } from "react"
import { Employee } from "@/util/ZodTypes"
import { API_BASE } from "@/util/path";


/**
 * Table: Displays information of all employees.
 */
export default function EmployeeTable () {

    // Store employees from api
    const [employees, setEmployees] = useState<Employee[]>([]);

    // Fetch employees from API on component mount
    useEffect(() => {
        fetch(API_BASE + '/employees')
            .then(response => {
                return response.json()
            })
            .then(data => {
                setEmployees(data);
            })
            .catch(error => {
                console.error('Error fetching employees:', error);
            });
    }, []); 
        
    return (
        <div className="p-4">
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Employee ID</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Position</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Is Manager</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Start Date</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Birth Date</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Salary</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Level</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((item, index) => (
                        <tr key={item.employee_id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="border border-gray-300 px-4 py-2">{item.employee_id}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.position}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {item.is_manager ? "Yes" : "No"}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {new Date(item.start_date).toLocaleDateString()}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{item.status}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {new Date(item.birth_date).toLocaleDateString()}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{item.salary.toFixed(2)}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.level}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}