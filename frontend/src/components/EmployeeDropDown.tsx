"use client";

import React, { useState, useEffect } from 'react';
import { API_BASE } from "@/util/path";
import Select, { SingleValue } from "react-select";
import { Employee } from '@/util/ZodTypes';
import { useAuth } from '@/hooks/useAuth';

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
    showSubordinatesOnly?: boolean; // New prop
}

const EmployeeDropdown: React.FC<EmployeeDropdownProps> = ({
    onEmployeeSelect,
    assignee_id,
    employees: providedEmployees,
    showSubordinatesOnly = false
}) => {
    const [employees, setEmployees] = useState<Array<{
        value: Employee;
        label: string;
    }>>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<{
        value: Employee;
        label: string;
    } | null>(null);
    const { user, loading } = useAuth();

    useEffect(() => {
        if (providedEmployees) {
            const employeeOptions = providedEmployees.map(emp => ({
                value: emp,
                label: emp.name
            }));
            setEmployees(employeeOptions);
            if (assignee_id) {
                const foundEmployee = employeeOptions.find(emp =>
                    emp.value.employee_id === assignee_id
                );
                setSelectedEmployee(foundEmployee || null);
            }
        } else {
            const fetchEmployees = async () => {
                try {
                    // Default to fetching all employees
                    let url = `${API_BASE}/employees`;

                    // Only fetch subordinates if explicitly requested and user is loaded
                    if (showSubordinatesOnly && !loading && user) {
                        url = `${API_BASE}/manager/${user.employee_id}/subordinates`;
                    }

                    const response = await fetch(url);
                    const data = await response.json();

                    let employeeList = [];

                    // Always include current user if authenticated
                    if (!loading && user) {
                        employeeList.push({ value: user, label: user.name });
                    }

                    // Add fetched employees
                    if (Array.isArray(data)) {
                        employeeList = [
                            ...employeeList,
                            ...data.map(emp => ({
                                value: emp,
                                label: emp.name
                            }))
                        ];
                    }

                    setEmployees(employeeList);

                    // Set selected employee if assignee_id provided
                    if (assignee_id) {
                        const foundEmployee = employeeList.find(emp =>
                            emp.value.employee_id === assignee_id
                        );
                        setSelectedEmployee(foundEmployee || null);
                    }
                } catch (error) {
                    console.error('Error fetching employees:', error);
                }
            };

            fetchEmployees();
        }
    }, [loading, user, providedEmployees, assignee_id, showSubordinatesOnly]);

    return (
        <Select
            options={employees}
            value={selectedEmployee}
            onChange={(selectedOption) => {
                onEmployeeSelect(selectedOption ? selectedOption.value : null);
                setSelectedEmployee(selectedOption);
            }}
            placeholder="Search for an employee"
            isSearchable
        />
    );
};

export default EmployeeDropdown;