"use client";

import React, { useState, useEffect } from 'react';
import {API_BASE} from "@/util/path";
import Select, {SingleValue} from "react-select";
import { Employee } from '@/util/ZodTypes';

interface EmployeeDropdownProps {
    onEmployeeSelect: (employee: SingleValue<Employee>) => void;
}
  
// DropDown takes an employee property so that the selected employee json can be accessed where the component is used
const EmployeeDropdown: React.FC<EmployeeDropdownProps> = ({ onEmployeeSelect }) => {
    const [employees, setEmployees] = useState([]);
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
                    value: emp,
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
                onChange={(selectedOption) => onEmployeeSelect(selectedOption)}
                placeholder="Search for an employee"
                isSearchable
            />
    );
};

export default EmployeeDropdown;
