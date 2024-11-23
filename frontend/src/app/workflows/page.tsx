"use client";
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, List, ListItem, IconButton } from '@mui/material';
import workflows from "@/app/workflows/create/page";
import CreateWorkflow from "@/app/workflows/create/page";

// Workflow list page
const WorkflowList = () => {
  const [workflows, setWorkflows] = useState([]);

  // UseEffect to fetch workflows
  useEffect(() => {
    // Simulating an API call
    const fetchWorkflows = async () => {
      const workflowData = [
        { id: 1, type: 'Promotion', status: 'Initialized', startDate: '2024/10/31' },
        { id: 2, type: 'Onboarding', status: 'Completed', startDate: '2024/9/20' },
        { id: 3, type: 'Absence', status: 'Approved', startDate: '2024/8/10' },
        { id: 4, type: 'Resignation', status: 'Initialized', startDate: '2024/10/31' },
      ];
      setWorkflows(workflowData);
    };

    fetchWorkflows();
  }, []);

  return (

    <Box p={4} bgcolor="grey.300" height="100vh">
      {/*<Box display="flex" justifyContent="flex-end" mt={2}>*/}
      {/*  <Link to="/workflows/create" style={{ textDecoration: 'none' }}>*/}
      {/*    <Button variant="contained" color="primary">*/}
      {/*      Create Workflow*/}
      {/*    </Button>*/}
      {/*  </Link>*/}
      {/*</Box>*/}
      <Paper
        elevation={3}
        sx={{ display: 'flex', alignItems: 'left', p: 2, mb: 2 }}>
        <Typography sx={{ flex: 1, textAlign: 'left' }} variant={"h5"}>Workflow Type</Typography>
        <Typography sx={{ flex: 1, textAlign: 'left' }} variant={"h5"}>Status</Typography>
        <Typography sx={{ flex: 1, textAlign: 'left' }} variant={"h5"}>Start Date</Typography>
        <Box flex={1} textAlign={'left'}>
          <Link to="/workflows/create" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">
              Create Workflow
            </Button>
          </Link>
        </Box>
      </Paper>

      <Box>
        {workflows.map((workflow) => (
          <Paper
            key={workflow.id}
            elevation={3}
            sx={{ display: 'flex', alignItems: 'left', p: 2, mb: 2 }}
          >
            <Typography sx={{ flex: 1, textAlign: 'left' }}>{workflow.type}</Typography>
            <Typography sx={{ flex: 1, textAlign: 'left' }}>{workflow.status}</Typography>
            <Typography sx={{ flex: 1, textAlign: 'left' }}>{workflow.startDate}</Typography>
            <Box sx={{ flex: 1, textAlign: 'left' }}>
              <Link to={`/workflow/${workflow.id}`} style={{ textDecoration: 'none', color: 'blue' }}>
                Detail
              </Link>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

// Workflow detail page
const WorkflowDetail = () => {
  const { id } = useParams();
  const [workflow, setWorkflow] = useState(null);

  // UseEffect to fetch individual workflow details
  useEffect(() => {
    // Simulating API call to fetch workflow details
    const fetchWorkflowDetail = async () => {
      const workflowDetail = { id, type: 'Promotion', status: 'Initialized', startDate: '2024/10/31' };
      setWorkflow(workflowDetail);
    };

    fetchWorkflowDetail();
  }, [id]);

  return (
    <Box p={4}>
      <Typography variant="h4">Workflow Details</Typography>
      {workflow ? (
        <Box mt={2}>
          <Typography>ID: {workflow.id}</Typography>
          <Typography>Type: {workflow.type}</Typography>
          <Typography>Status: {workflow.status}</Typography>
          <Typography>Start Date: {workflow.startDate}</Typography>
        </Box>
      ) : (
        <Typography mt={2}>Loading...</Typography>
      )}
    </Box>
  );
};

// Main app component
const App = () => {
  return (
      <div className='w-full'>
      <Router>
        <Routes>
          <Route path="/workflows" element={<WorkflowList />} />
          <Route path="/" element={<WorkflowList />} />
          <Route path="/workflow/:id" element={<WorkflowDetail />} />
          <Route path="/workflows/create" element={<CreateWorkflow />} />
        </Routes>
        </Router>
      </div>
  );
};

export default App;
