"use client";

import React, { useState } from 'react'
import EmployeeBox from "../../components/EmployeeBox";
import EmployeeDropdown from '@/components/EmployeeDropDown';
import { SingleValue } from 'react-select';
import { Employee } from '@/util/ZodTypes';


/**
 * Hierarchy page: 
 * - The OA system should provide some kind of tree level of management relationship
 * - Human Resources should be able to easily see the hierarchy structure of the company. 
 * - Each employee details page should contain the groups each employee is in
 */

export default function hierarchy() {
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

    const handleSelect = (employee: SingleValue<Employee>) => {
        if (employee) {
            setSelectedEmployee(employee.value); // This is underlined but its not an error, it is just react-select being weird...
        } else {
            setSelectedEmployee(null); // Handle case where no employee is selected
        }
    }


    return (
        <div>
            <EmployeeDropdown onEmployeeSelect={handleSelect} />
            {selectedEmployee && <EmployeeBox employee={selectedEmployee} />}
        </div>
    );
}
