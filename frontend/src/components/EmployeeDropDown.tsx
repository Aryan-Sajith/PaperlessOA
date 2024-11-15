"use client";

import React, { useState, useEffect } from 'react';
import {API_BASE} from "@/util/path";
import Select from "react-select";

const EmployeeDropdown = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);


    useEffect(() => {
        // Fetch employee data from the Flask backend API
        fetch(API_BASE + 'employees')
            .then(async response => {
                response = await response.json()
                return response
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

    // Update the filtered employee list when the search term changes
    const handleSelectChange = (selectedOption) => {
        setSelectedEmployee(selectedOption);
        console.log('Selected employee:', selectedOption);
    };

    return (
        <div>
            <Select
                options={employees}
                value={selectedEmployee}
                onChange={handleSelectChange}
                placeholder="Search for an employee"
                isSearchable
            />
        </div>
    );
};

export default EmployeeDropdown;
