"use client";
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, List, ListItem, IconButton } from '@mui/material';
import Link from "next/link";
import {Simulate} from "react-dom/test-utils";
import {API_BASE} from "@/util/path";
import {Employee} from "@/util/ZodTypes";
import {useAuth} from "@/hooks/useAuth";

// Workflow list page
const WorkflowList = () => {
  const [workflows, setWorkflows] = useState([]);
  const { user, loading } = useAuth(); // Add loading from useAuth

  // UseEffect to fetch workflows
  useEffect(() => {
      fetch(`${API_BASE}/workflows` ,{
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          // we want to only fetch the current user's workflow
          body: JSON.stringify({"employee_id" : user?.employee_id})
          })
          .then(response => response.json())
          .then(data => setWorkflows(data))
    }, [user, loading]);


  return (<div>
    <h1 className="text-2xl font-bold mb-6">Workflows</h1>
    <Box p={4} bgcolor="grey.300" height="100vh">
      <Paper
        elevation={4}
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
            elevation={4}
            sx={{ display: 'flex', alignItems: 'left', p: 2, mb: 2 }}
          >
            <Typography sx={{ flex: 1, textAlign: 'left' }}>{workflow.type}</Typography>
            <Typography sx={{ flex: 1, textAlign: 'left' }}>{workflow.status}</Typography>
            <Typography sx={{ flex: 1, textAlign: 'left' }}>{workflow.timestamp.substring(0, 10)}</Typography>
            <Box sx={{ flex: 0.5, textAlign: 'left' }}>
              <Link href={`/workflows/${workflow.type.toLowerCase()}/${workflow.id}`} passHref>
                <Button variant={"outlined"} color={"primary"}>
                  Details
                </Button>
              </Link>
            </Box>
            <Box sx={{ flex: 0.5, textAlign: 'left' }}>
                <Button variant={"outlined"} color={"primary"} onClick={() => {
                  const workflowId = workflow.id;
                  fetch(`${API_BASE}/archive_workflow/${workflowId}`, {
                    method: 'POST',
                  })
                    .then(response => {
                      if (response.ok) {
                        alert('Workflow archived successfully!');
                        window.location.reload(); // Reload the page
                      } else {
                        alert('Failed to archive workflow.');
                      }
                    })
                    .catch(error => {
                      console.error('Error:', error);
                      alert('Error while archiving workflow.');
                    });
                }}>
                  Archive
                </Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
    </div>);
};

export default WorkflowList;
