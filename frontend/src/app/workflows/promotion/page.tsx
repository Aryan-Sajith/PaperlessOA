"use client";
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import EmployeeDropdown from "@/components/general/EmployeeDropDown";
import { API_BASE } from "@/util/api-path";
import { Employee } from "@/util/ZodTypes";
import { SingleValue } from "react-select";
import { useAuth } from "@/hooks/useAuth";

const PromotionForm = () => {
  const [formData, setFormData] = useState({
    level: '',
    salary: '',
    position: '',
    reason: '',
    type: 'promotion',
    name: '',
    assignee_id: '',
    cur_id: '',
    employee_id: ''
  });

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [nextAssignee, setNextAssignee] = useState<Employee | null>(null)
  const { user, loading } = useAuth();

  const handleSelectEmployee = (employee: SingleValue<Employee>) => {
    if (employee) {
      setSelectedEmployee(employee.value); // This is underlined but its not an error, it is just react-select being weird...
    } else {
      setSelectedEmployee(null); // Handle case where no employee is selected
    }
  }
  const handleNextAssignee = (employee: SingleValue<Employee>) => {
    if (employee) {
      setNextAssignee(employee.value); // This is underlined but its not an error, it is just react-select being weird...
    } else {
      setNextAssignee(null); // Handle case where no employee is selected
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitToNext = async () => {
    try {
      // populate fields for creating workflow
      formData['assignee_id'] = nextAssignee.employee_id
      formData['cur_id'] = user?.employee_id
      formData['name'] = selectedEmployee.name
      formData['employee_id'] = selectedEmployee.employee_id
      formData['type'] = 'promotion'
      const response = await fetch(API_BASE + '/create_workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Workflow submitted to the next assignee successfully!');
      } else {
        alert('Failed to submit workflow to the next assignee.');
      }
    } catch (error) {
      console.error('Error submitting workflow:', error);
    }
  };

  const handleApprove = async () => {
    try {
      const response = await fetch(API_BASE + '/approve_workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Workflow approved successfully!');
      } else {
        alert('Failed to approve workflow.');
      }
    } catch (error) {
      console.error('Error approving workflow:', error);
    }
  };

  return (
    <Box p={4} bgcolor="grey.200" height="100vh">
      <Typography variant="h4" mb={4}>
        Promotion
      </Typography>

      <Box display="flex" justifyContent="space-between">
        {/* Left Form Section */}
        <Box flex={1} mr={4}>
          <Typography>Who is being promoted</Typography>
          <EmployeeDropdown onEmployeeSelect={handleSelectEmployee} />
          <TextField
            fullWidth
            margin="normal"
            label="New Salary"
            name="salary"
            value={formData.salary}
            onChange={handleInputChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            margin="normal"
            label="New Level"
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            margin="normal"
            label="New Position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Reason For Promotion"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            variant="outlined"
            multiline
            rows={4}
          />
        </Box>

        {/* Right Workflow Steps */}
        <Box flex={1}>
          <Typography>select the next assignee if neccessary</Typography>
          <EmployeeDropdown onEmployeeSelect={handleNextAssignee} />
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitToNext}
          sx={{ mr: 2 }}
        >
          Submit to next assignee
        </Button>
        <Button variant="contained" color="secondary" onClick={handleApprove}>
          Approve
        </Button>
      </Box>
    </Box>
  );
};

export default PromotionForm;
