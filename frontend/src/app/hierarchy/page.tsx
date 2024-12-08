"use client";

import React, { useState } from 'react'
import EmployeeBox from "../../components/general/EmployeeBox";
import EmployeeDropdown from '@/components/general/EmployeeDropDown';
import { SingleValue } from 'react-select';
import { Employee } from '@/util/ZodTypes';
import { API_BASE } from "@/util/api-path";
import { set } from 'zod';


/**
 * Hierarchy page: 
 * - The OA system should provide some kind of tree level of management relationship
 * - Human Resources should be able to easily see the hierarchy structure of the company. 
 * - Each employee details page should contain the groups each employee is in
 */

export default function hierarchy() {
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [subordinates, setSubordinates] = useState<Employee[] | null>(null);


    const handleSelect = (employee: SingleValue<Employee>) => {
        if (employee) {
            // Employee is selected
            setSelectedEmployee(employee.value); // This is underlined but its not an error, it is just react-select being weird...

            // Fetch subordinates
            fetch(API_BASE + '/manager/' + employee.value.employee_id + '/subordinates')
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        setSubordinates(null)
                    } else {
                        setSubordinates(data)
                    }
                })
                .catch(error => {
                    console.error('Error fetching subordinates:', error);
                });
        }
    }


    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Hierarchy</h1>
            <EmployeeDropdown onEmployeeSelect={handleSelect} />
            {selectedEmployee && <EmployeeBox employee={selectedEmployee} subordinates={subordinates ?? []} />}
        </div>
    );
}
