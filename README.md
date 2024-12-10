# PaperlessOA

Fall 2024 - CS520

## Introduction

The goal of this project is to make it easy for companies to perform daily routines with an Office Automation(OA) system.
PaperlessOA will efficiently automate and systematically handle employee management, absence management, and task management.
There are not many free and open source(FOSS) OA systems which startups can affordably rely on, so we hope to provide a solution for this space of users.

## Installation

Follow README.md instructions in frontend and backend.

## Testing

Backend test is in backend/test follow instruction to run the test.
For Frontend testing run the battery by cding in the frontend directory
and using $ npx cypress run
for non headless mode use $ npx cypress open
make sure both the frontend and backend are running

## Technology Stack

Frontend: React + Next.js, Backend: Python Flask, DB: AWS RDS postgresql

## Features

### Workflow

#### Backend:

Workflow API routes here: `backend/app/workflow_routes.py`

#### Frontend:

Workflow files located in `frontend/src/app/workflows`

### Absence Management

#### Backend:

Absence management primarily utilizes the Employee API routes here: `backend/app/employee_routes.py`

#### Frontend:

Workflow files located in `frontend/src/app/workflows/absence`

### Tasks

#### Backend:

Task API routes here: `backend/app/task_routes.py`

#### Frontend:

Main tasks page in `frontend/src/app/tasks` and primary components utilized in `frontend/src/components/tasks`

### Analytics

#### Backend:

Analytics utilizes the Task API routes here: `backend/app/task_routes.py`

#### Frontend:

Main analytics page in `frontend/src/app/analytics` and primary components utilized in `frontend/src/components/analytics`

### Hierarchy

#### Backend:

Hierarchy primarily utilizes the Employee API routes here: `backend/app/employee_routes.py`

#### Frontend:

Main hierarchy page in `frontend/src/app/hierarchy`
