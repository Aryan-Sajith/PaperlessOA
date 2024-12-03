"use client";
import React, {useState, use, useEffect} from 'react';
import { Box, Typography, TextField, Button, Paper} from '@mui/material';
import EmployeeDropdown from "@/components/EmployeeDropDown";
import {API_BASE} from "@/util/path";
import {type} from "node:os";
import {Employee} from "@/util/ZodTypes";
import {SingleValue} from "react-select";
import {useAuth} from "@/hooks/useAuth";

const OnboardingForm = ({params}:{params: Promise<{id: string}>}) => {
  const id = use(params).id
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
    workflow_id: '',
    assignee_id: '',
    manager_name: '',
    manager_id: '',
    password: '',
    subordinates_id: [],
    subordinates_name: [],
  });

  useEffect(() => {
    fetch(`${API_BASE}/workflow/${id}`)
        .then(response =>{
          return response.json()
        })
        .then(data => {
          const JSON5 = require('json5');
          const content = JSON5.parse(data.content)
          setFormData({
            name: content.name || "",
            email: content.email || "",
            salary: content.salary || "",
            level: content.level || "",
            start_date: content.start_date || "",
            birth_date: content.birth_date || "",
            position: content.position || "",
            comments: content.comments || "",
            type: "onboarding",
            workflow_id: id,
            assignee_id: content.assignee_id || "",
            manager_name: content.manager_name || "",
            manager_id: content.manager_id || "",
            subordinates_id: content.subordinates_id || [],
            subordinates_name: content.subordinates_name || [],
            password: content.password || "",
          })
        })
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [nextAssignee, setNextAssignee] = useState<Employee | null>(null)

  const handleNextAssignee = (employee: SingleValue<Employee>) => {
    if (employee) {
      setNextAssignee(employee.value); // This is underlined but its not an error, it is just react-select being weird...
    } else {
      setNextAssignee(null); // Handle case where no employee is selected
    }
  }

  const handleSubmitToNext = async () => {
    try {
      formData['assignee_id'] = nextAssignee.employee_id
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
        Onboarding {id}
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
          <Typography>{JSON.stringify(formData['subordinates_name'])} will be the subordinates of {formData['name']}</Typography>
          <Typography>{formData['manager_name']} will be the manager of {formData['name']}</Typography>
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
