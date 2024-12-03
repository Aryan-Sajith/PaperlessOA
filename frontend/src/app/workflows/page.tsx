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
  // const [currentUser, setCurrentUser] = useState<Employee | null>(null)
  //   useEffect(() => {
  //       fetch(`${API_BASE}/current_user`)
  //           .then(response => {
  //               console.error(response)
  //               return response.json()
  //           })
  //           .then(data => setCurrentUser(data))
  //           .then(data => console.error(currentUser))
  //   }, []);

  // UseEffect to fetch workflows
  useEffect(() => {
      fetch(`${API_BASE}/workflows` ,{
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({"employee_id" : user?.employee_id})
          })
          .then(response => response.json())
          .then(data => setWorkflows(data))
    }, [user, loading]);


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
