"use client";
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper} from '@mui/material';
import EmployeeDropdown from "@/components/EmployeeDropDown";
import {API_BASE} from "@/util/path";
import {useParams} from "react-router-dom";
import {useRouter} from "next/router";
import {Employee} from "@/util/ZodTypes";
import {MultiValue, SingleValue} from "react-select";
import MultiEmployeeDropdown from "@/components/MultiEmployeeDropDown";
import {any} from "prop-types";
import JSON5 from "json5";

const OnboardingForm = () => {
  const [subordinates, setSubordinates] = useState<Employee[] | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    salary: '',
    level: '',
    position: '',
    start_date: '',
    birth_date: '',
    comments: '',
    type: '',
    manager_name: '',
    manager_id: '',
    assignee_id: '',
    subordinates_id: []
  });
  const [nextAssignee, setNextAssignee] = useState<Employee | null>(null)
  const [manager, setManager] = useState<Employee | null>(null)

  const handleNextAssignee = (employee: SingleValue<Employee>) => {
      if (employee) {
        setNextAssignee(employee.value); // This is underlined but its not an error, it is just react-select being weird...
      } else {
        setNextAssignee(null); // Handle case where no employee is selected
      }
  }

  const handleManager = (employee: SingleValue<Employee>) => {
      if (employee) {
        setManager(employee.value); // This is underlined but its not an error, it is just react-select being weird...
      } else {
        setManager(null); // Handle case where no employee is selected
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
      formData['subordinates_id'] = subordinates?.map((emp) => emp.value.employee_id)
      formData['type'] = 'onboarding'
      formData['manager_name'] = manager.name
      formData['manager_id'] = manager.employee_id
      formData['assignee_id'] = nextAssignee.employee_id
      const response = await fetch(API_BASE + 'create_workflow', {
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
      const response = await fetch('/api/approve_workflow', {
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
        Onboarding
      </Typography>
      <Box display="flex" justifyContent="space-between">
        {/* Left Form Section */}
        <Box flex={1} mr={4}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            variant="outlined"
          />
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
            label="Birth Date"
            name="birth_date"
            value={formData.birth_date}
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
            label="Your Comments"
            name="comments"
            value={formData.comments}
            onChange={handleInputChange}
            variant="outlined"
            multiline
            rows={4}
          />
        </Box>

        {/* Right Workflow Steps */}
        <Box flex={1}>
          <TextField
            fullWidth
            margin="normal"
            label="Salary"
            name="salary"
            value={formData.salary}
            onChange={handleInputChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Level"
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            variant="outlined"
          />
          <Typography>select the the subordinates (if any) for this employee</Typography>
          <MultiEmployeeDropdown onEmployeeSelect={setSubordinates} />
          <Typography>select the the manager for this employee</Typography>
          <EmployeeDropdown onEmployeeSelect={handleManager}/>
          <Typography>select the next assignee if neccessary</Typography>
          <EmployeeDropdown onEmployeeSelect={handleNextAssignee}/>
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

export default OnboardingForm;
