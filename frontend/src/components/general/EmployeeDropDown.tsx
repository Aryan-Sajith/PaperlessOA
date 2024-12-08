"use client";

import React, { useState, useEffect } from 'react';
import { API_BASE } from "@/util/api-path";
import Select, { SingleValue } from "react-select";
import { Employee } from '@/util/ZodTypes';

const customStyles = {
    menu: (provided) => ({
        ...provided,
        zIndex: 1050, // Ensure dropdown is on top
    }),
};

interface EmployeeDropdownProps {
    onEmployeeSelect: (employee: SingleValue<Employee>) => void;
}

// DropDown takes an employee property so that the selected employee json can be accessed where the component is used
const EmployeeDropdown: React.FC<EmployeeDropdownProps> = ({ onEmployeeSelect }) => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isClient, setIsClient] = useState(false);


    useEffect(() => {
        setIsClient(true);
        // Fetch employee data from the Flask backend API
        fetch(API_BASE + '/employees')
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
            value={selectedEmployee}
            onChange={(selectedOption) => {
                onEmployeeSelect(selectedOption)
                setSelectedEmployee(selectedOption)
            }}
            placeholder="Search for an employee"
            isSearchable
            styles={customStyles}
        />
    );
};

export default EmployeeDropdown;
