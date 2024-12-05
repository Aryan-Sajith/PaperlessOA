# How to start

## install dependency
run `pip3 install -r requirements.txt`

## install postgresql and psycopg2
python package `psycopg2` require postgresql to be installed locally
run `brew install postgresql` to install postgresql
run `pip3 install psycopg2` to install psycopg2

## connect to db and run flask login
create a `.env` file in the Backend directory with the following setting
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
`app` contains the main application code. 

The `models` file is a mapping of the db (postgreSQL) field to the 
object field in python

The `*_routes.py` define the API that the backend is going to expose to the
outside world as well as the business logic and push changes to the db

The `__init__.py` initialized the app with connection with the db

The `db_file` contains the creation of the tables of the db

## Workflow logic
### Retrieve Workflow
Due to the various types of workflows we have, we store just the type and some metadata for the 
workflow, and leave the content as a json in the db. 
### Create Workflow
each workflow should be attached with a type field. If the workflow doesn't have a
parent id attached to it (meaning the frontend just create it instead of assigning them to the next assignee).
It will automatically create a workflow as a parent workflow, and another workflow assigned to the assignee
### Approve Workflow
approving a workflow will take a workflow id, and its content. Then mark all the parent workflow is complete
and handle the workflow according to its type. For onboarding, It will create employee. Resignation, it will remove
employee. Promotion, it will change the salary and level of the employee. And absence will keep the record in the db.