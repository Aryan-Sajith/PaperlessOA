# How to start

## install dependency
run `pip3 install -r requirements.txt`

## install postgresql and psycopg2
python package `psycopg2` require postgresql to be installed locally
run `brew install postgresql` to install postgresql
run `pip3 install psycopg2` to install psycopg2

## connect to db and run flask login
create a `.env` file in the Backend directory with the following setting.
The DB is hosted on AWS RDS.
````
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_HOST=your_host
DB_PORT=5432
DB_NAME=your_database_name
SECRET_KEY=your_secret_key
````

## Run the app
run the app using `python3 run.py`

## Run the test
in the `backend` directory, run `python3 -m pytest test`

## File structure
This folder is for the backend of the paperless OA. It's
written in python using flask.
### APP
`app` contains the main application code. 

The `models.py` file is a mapping of the db (postgreSQL) field to the 
object field in python

The `*_routes.py` define the API that the backend is going to expose to the
outside world as well as the business logic and push changes to the db.
For example, `workflow_routes.py` handle all the workflow APIs exposed, as well as
some handling logic such as creating employee after onboarding

The `__init__.py` initialized the app with connection with the db

### db_file
The `create_tables.sql` contains the creation of the tables of the db. 
Employee table stored the information about employees\
Employee_manager stores the relation of 
a manager and its subordinates.\
Task stores task and has assignee_id to refer to
the employee being assigned. \
Workflow stores four different types of workflow, and its content as json. 

### test
`test_*_routes.py` uses pytest to mock API and test the business logic 
as well as the reliability of the API.

## Login logic
### Library
[Flask-login](https://flask-login.readthedocs.io/en/latest/) is utilized for managing user login/authentication via a cookie-based system. User passwords are stored in the AWS RDS database utilizing the [Werkzeug security](https://pydoc.dev/werkzeug/latest/werkzeug.security.html) module in python to encrypt the stored passwords. 

### Authenticate User
Validates user credentials against stored employee records in the database.
Session management handled through Flask session cookies.

### Current User
Returns the logged-in user's details including role and permissions.
Protected routes require valid session authentication.

## Workflow logic
### Retrieve Workflow
Due to the various types of workflows we have, we store just the type and some metadata for the 
workflow, and leave the content as a json in the db. 
### Create Workflow
Each workflow should be attached with a type field. If the workflow doesn't have a
parent id attached to it (meaning the frontend just create it instead of assigning them to the next assignee).
It will automatically create a workflow as a parent workflow, and another workflow assigned to the assignee
### Approve Workflow
Approving a workflow will take a workflow id, and its content. Then mark all the parent workflow is complete
and handle the workflow according to its type. For onboarding, It will create employee. Resignation, it will remove
employee. Promotion, it will change the salary and level of the employee. And absence will keep the record in the db.
### Delete and update Workflow
They are supported, and can be called by giving `workflow_id` and body of the updated workflow

## Tasks logic
### Create Task
Tasks require an assignee_id and content. Managers can assign to subordinates.
Task metadata includes status, due date, and type.

### Retrieve Tasks
Returns tasks filtered by:
- Personal tasks assigned to user
- Team tasks (for managers)
- Status (complete/incomplete)
- Due date ranges

### Update Task
Supports modifying task content, status, and assignee.
Task completion automatically tracked for analytics.

### Delete Task
Tasks can be deleted assuming they exist in the database. This is determined based on the 
task id which is implicitly returned to the backend via the frontend UI.

## Employee logic 
### Employee Management
CRUD operations for employee records including:
- Personal details
- Role/position
- Salary information
- Reporting structure

## Hierarchy & Analytics
Utilizes primarily employee and tasks logic to retrieve, filter and display useful company information like:
- Hierarchical employee relationships(manager/subordinate, role, etc.)
- Tasks analytics for oneself and subordinates(filtered by completion status, time frame, etc.)
