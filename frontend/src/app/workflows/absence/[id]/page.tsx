"use client";
import React, { use, useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import EmployeeDropdown from "@/components/general/EmployeeDropDown";
import { API_BASE } from "@/util/api-path";
import { Employee } from "@/util/ZodTypes";
import { SingleValue } from "react-select";
import JSON5 from "json5";

const AbsenceForm = ({ params }: { params: Promise<{ id: string }> }) => {
  const id = use(params).id
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    reason: '',
    type: '',
    assignee_id: '',
    name: '',
    workflow_id: '',
  });
  useEffect(() => {
    fetch(`${API_BASE}/workflow/${id}`)
      .then(response => {
        return response.json()
      })
      .then(data => {
        const JSON5 = require('json5');
        const content = JSON5.parse(data.content)
        setFormData({
          start_date: content.start_date || "",
          end_date: content.end_date || "",
          reason: content.reason || "",
          type: "absence",
          assignee_id: data.assignee_id || "",
          name: content.name || "",
          workflow_id: id
        })
      })
  }, []);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  const handleSelectEmployee = (employee: SingleValue<Employee>) => {
    if (employee) {
      setSelectedEmployee(employee.value); // This is underlined but its not an error, it is just react-select being weird...
    } else {
      setSelectedEmployee(null); // Handle case where no employee is selected
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
      formData['type'] = 'absence';
      formData['assignee_id'] = selectedEmployee.employee_id
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
        Absence {id}
      </Typography>
      <Typography>{formData.name} is taking the Absence</Typography>
      <Box display="flex" justifyContent="space-between">
        {/* Left Form Section */}
        <Box flex={1} mr={4}>
          <TextField
            fullWidth
            margin="normal"
            label="Start Date"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            variant="outlined"
            type={"date"}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="End Data"
            name="end_date"
            value={formData.end_date}
            onChange={handleInputChange}
            variant="outlined"
            type={"date"}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Reason For Absence"
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
          <EmployeeDropdown onEmployeeSelect={handleSelectEmployee} />
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

export default AbsenceForm;
