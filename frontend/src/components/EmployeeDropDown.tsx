"use client";

import React, { useState, useEffect } from 'react';
import {API_BASE} from "@/util/path";

const EmployeeDropdown = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);


    useEffect(() => {
        // Fetch employee data from the Flask backend API
        fetch(API_BASE + 'employees')
            .then(async response => {
                response = await response.json()
                setEmployees(response);
                setFilteredEmployees(response);
            })
    }, []);

    // Update the filtered employee list when the search term changes
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredEmployees(employees);
        } else {
            const filtered = employees.filter(emp =>
                emp.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredEmployees(filtered);
        }
    }, [searchTerm, employees]);

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <input
                type="text"
                placeholder="Search for an employee"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
            />
            <select
                style={{ width: '100%', padding: '8px', cursor: 'pointer' }}
                onChange={(e) => setSearchTerm(e.target.selectedOptions[0].text)}
            >
                <option value="">Select an employee</option>
                {filteredEmployees.map((employee) => (
                    <option key={employee.employee_id} value={employee.employee_id}>
                        {employee.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default EmployeeDropdown;
