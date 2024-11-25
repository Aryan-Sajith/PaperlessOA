"use client";
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, List, ListItem, IconButton } from '@mui/material';
import Link from "next/link";
import {Simulate} from "react-dom/test-utils";

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
      <Paper
        elevation={3}
        sx={{ display: 'flex', alignItems: 'left', p: 2, mb: 2 }}>
        <Typography sx={{ flex: 1, textAlign: 'left' }} variant={"h5"}>Workflow Type</Typography>
        <Typography sx={{ flex: 1, textAlign: 'left' }} variant={"h5"}>Status</Typography>
        <Typography sx={{ flex: 1, textAlign: 'left' }} variant={"h5"}>Start Date</Typography>
        <Box flex={1} textAlign={'left'}>
          <Link href="/workflows/create" style={{ textDecoration: 'none' }}>
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
              <Link href={`/workflows/${workflow.type.toLowerCase()}/${workflow.id}`} passHref>
                <Button variant={"outlined"} color={"primary"}>
                  Details
                </Button>
              </Link>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default WorkflowList;
