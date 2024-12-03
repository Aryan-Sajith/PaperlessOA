"use client";

import React, { useState, useEffect } from 'react';
import { API_BASE } from "@/util/path";
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
    assignee_id?: number;
    employees?: Employee[];
}

// DropDown takes an employee property so that the selected employee json can be accessed where the component is used
const EmployeeDropdown: React.FC<EmployeeDropdownProps> = ({
    onEmployeeSelect,
    assignee_id,
    employees: providedEmployees
}) => {
    const [employees, setEmployees] = useState<Array<{
        value: Employee;
        label: string;
    }>>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<{
        value: Employee;
        label: string;
    } | null>(null);
    const [isClient, setIsClient] = useState(false);


    useEffect(() => {
        setIsClient(true);

        if (providedEmployees) { // Use provided employees if provided
            const employeeOptions = providedEmployees.map(emp => ({
                value: emp,
                label: emp.name
            }));
            setEmployees(employeeOptions); // Set employees if provided
            // Ensures that the selected employee is displayed as the default option when editing tasks
            if (assignee_id) {
                const foundEmployee = employeeOptions.find(emp =>
                    emp.value.employee_id === assignee_id
                );
                setSelectedEmployee(foundEmployee || null);
            }
        }
        else {
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
                    setEmployees(employeeOptions); // Set all employees if not provided
                    // Ensures that the selected employee is displayed as the default option when editing tasks
                    if (assignee_id) {
                        const foundEmployee = employeeOptions.find(emp =>
                            emp.value.employee_id === assignee_id
                        );
                        setSelectedEmployee(foundEmployee || null);
                    }
                })
                .catch(error => {
                    console.error('Error fetching employees:', error);
                });
        }
    }, []);
    if (!isClient) return null

    return (
        <Select
            options={employees}
            value={selectedEmployee}
            onChange={(selectedOption) => {
                onEmployeeSelect(selectedOption ? selectedOption.value : null)
                setSelectedEmployee(selectedOption)
            }}
            placeholder="Search for an employee"
            isSearchable
            styles={customStyles}
        />
    );
};

export default EmployeeDropdown;
