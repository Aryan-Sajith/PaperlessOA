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
        } else if (!loading) { // Only fetch tasks main user data is loaded
            const fetchEmployees = async () => {
                try {
                    let url = API_BASE + '/employees';
                    if (showSubordinatesOnly && user?.employee_id) {
                        url = `${API_BASE}/manager/${user.employee_id}/subordinates`;
                    }

                    const response = await fetch(url);
                    const data = await response.json();

                    // Handle case where no subordinates exist
                    const employeeList = Array.isArray(data) ? data : [];

                    const employeeOptions = employeeList.map(emp => ({
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
                } catch (error) {
                    console.error('Error fetching employees:', error);
                }
            };

            fetchEmployees();
        }
    }, [showSubordinatesOnly, loading]);


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
            styles={customStyles}
        />
    );
};

export default EmployeeDropdown;