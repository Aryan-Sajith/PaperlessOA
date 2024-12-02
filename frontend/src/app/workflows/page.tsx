"use client";
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, List, ListItem, IconButton } from '@mui/material';
import Link from "next/link";
import {Simulate} from "react-dom/test-utils";
import {API_BASE} from "@/util/path";

// Workflow list page
const WorkflowList = () => {
  const [workflows, setWorkflows] = useState([]);

  // UseEffect to fetch workflows
  useEffect(() => {
      fetch(`${API_BASE}/workflows`)
          .then(response => response.json())
          .then(data => setWorkflows(data))
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
            <Typography sx={{ flex: 1, textAlign: 'left' }}>{workflow.timestamp.substring(0, 10)}</Typography>
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
