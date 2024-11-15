"use client";

import React, { useState, useEffect } from 'react';
import {API_BASE} from "@/util/path";
import Select from "react-select";

const EmployeeDropdown = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isClient, setIsClient] = useState(false);


    useEffect(() => {
        setIsClient(true);
        // Fetch employee data from the Flask backend API
        fetch(API_BASE + 'employees')
            .then(response => {
                return response.json()
            })
            .then(data => {
                // Transform data to match react-select's expected format
                const employeeOptions = data.map(emp => ({
                    value: emp.employee_id,
                    label: emp.name
                }));
                setEmployees(employeeOptions);
            })
            .catch(error => {
                console.error('Error fetching employees:', error);
            });
    }, []);
    if (!isClient) return null

    return (
            <Select
                options={employees}
                value={selectedEmployee}
                onChange={(selectedOption) => setSelectedEmployee(selectedOption)}
                placeholder="Search for an employee"
                isSearchable
            />
    );
};

export default EmployeeDropdown;
