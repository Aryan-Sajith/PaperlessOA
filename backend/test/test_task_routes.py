from datetime import datetime, timedelta
import pytest
from ..app import create_app  # Import the Flask app from workflow_routes

@pytest.fixture
def client():
    app = create_app()
    """Fixture to create a test client."""
    app.config['TESTING'] = True
    return app.test_client()

@pytest.fixture
def mock_database(monkeypatch):
    """Mock database interactions."""

    def mock_get_tasks():
        return mock_tasks

    monkeypatch.setattr("app.workflow_routes.get_tasks", mock_get_tasks)

# Tests for endpoints
def test_get_tasks(client):
    """Test retrieving all tasks."""
    # Send a GET request to retrieve all tasks
    response = client.get('/tasks', json={})
    # Check that the response status code is 200 (OK)
    assert response.status_code == 200
    # Check that the response data is a list
    data = response.json
    assert isinstance(data, list)

def test_create_task(client):
    """Test creating a new task."""
    # Define a mock task to create
    new_task = {
        "assignee_id": 1,
        "status": "In Progress",
        "description": "Create task test",
        "type": "Other",
        "due_date": (datetime.now() - timedelta(days=3)).strftime('%Y-%m-%d') # Due date is 3 days ago
    }
    # Send a POST request to create the task
    response = client.post('/create_task', json=new_task)
    # Check that the response status code is 201 (created)
    assert response.status_code == 201
    # Check that the response data matches the mock task data
    data = response.json
    assert all(data[key] == new_task[key] for key in ['type', 'status', 'description', 'assignee_id'])
    # Delete the task created for testing
    task_id = data['id']
    response = client.delete(f'/delete_task/{task_id}') # Delete task route already tested

def test_create_task_failed(client):
    """Test creating a new task with missing fields."""
    # Define a mock task with missing fields
    incomplete_task = {
        "assignee_id": 1,
        "status": "In Progress",
        "description": "Task with missing fields"
    }
    # Send a POST request to create the task
    response = client.post('/create_task', json=incomplete_task)
    # Check that the response status code is 400 (Bad Request)
    assert response.status_code == 400
    # Check that the response message indicates missing required task fields
    data = response.get_json()
    assert data['error'] == 'Missing required task fields'

def test_get_tasks_by_employee_id(client):
    """Test retrieving tasks by employee ID."""
    # Define a mock task to create
    new_task = {
        "assignee_id": 1,
        "status": "In Progress",
        "description": "Task for employee ID retrieval route testing",
        "type": "Other",
        "due_date": (datetime.now() - timedelta(days=3)).strftime('%Y-%m-%d') # Due date is 3 days ago
    }
    # Send a POST request to create the task
    response = client.post('/create_task', json=new_task) # Create task route already tested
    # Send a GET request to retrieve tasks by employee ID
    response = client.get('/tasks/employee/1', json={})
    # Check that the response status code is 200 (OK)
    assert response.status_code == 200
    # Check that the response data is a list
    data = response.json
    assert isinstance(data, list)
    # Delete the task created for testing
    task_id = next(task['id'] for task in response.json if task['description'] == "Task for employee ID retrieval route testing")
    response = client.delete(f'/delete_task/{task_id}') # Delete task route already tested

def test_get_tasks_by_employee_id_not_found(client):
    """Test retrieving tasks by employee ID that does not exist."""
    # Send a GET request to retrieve tasks by an employee ID that does not exist
    response = client.get('/tasks/employee/1000', json={})
    # Check that the response status code is 404 (Not Found)
    assert response.status_code == 404
    # Check that the response message indicates no tasks were found for the employee
    data = response.get_json()
    assert data['message'] == 'No tasks found for this employee'

def test_delete_task(client):
    """Test deleting a task."""
    # Define a mock task to delete
    new_task = {
        "assignee_id": 1,
        "status": "In Progress",
        "description": "Task for deletion",
        "type": "Other",
        "due_date": (datetime.now() - timedelta(days=3)).strftime('%Y-%m-%d') # Due date is 3 days ago
    }
    # Send a POST request to create the task
    response = client.post('/create_task', json=new_task) # Create task route already tested
    # Get the task ID from the response data
    task_id = response.json['id']
    # Send a DELETE request to delete the task
    response = client.delete(f'/delete_task/{task_id}')
    # Check that the response status code is 200 (OK)
    assert response.status_code == 200
    # Check that the response message indicates the task was deleted
    data = response.get_json()
    assert data['message'] == 'Task successfully deleted'

def test_delete_task_not_found(client):
    """Test deleting a task that does not exist."""
    # Send a DELETE request to delete a task that does not exist
    response = client.delete('/delete_task/1000')
    # Check that the response status code is 404 (Not Found)
    assert response.status_code == 404
    # Check that the response message indicates the task was not found
    data = response.get_json()
    assert data['message'] == 'Task to delete not found!'

def test_get_tasks_associated_with_employee_type_timeframe(client):
    """Test retrieving tasks associated with an employee within a specified time frame and type"""
    # Define a mock task to create
    new_task = {
        "assignee_id": 1,
        "status": "In Progress",
        "description": "Task for filtered tasks retrieval route testing",
        "type": "Finance",
        "due_date": (datetime.now() - timedelta(days=3)).strftime('%Y-%m-%d') # Due date is 3 days ago
    } 
    # Send a POST request to create the task
    response = client.post('/create_task', json=new_task) # Create task route already tested
    # Send a GET request to retrieve tasks associated with an employee within a specified time frame and type
    response = client.get('/tasks/employee/1/Finance/Past%20Week', json={})
    # Check that the response status code is 200 (OK)
    assert response.status_code == 200
    # Check that the response data is a list
    data = response.json
    assert isinstance(data, list)
    # Check that the response data is of the correct type and within the specified time frame
    # Verify task type is "Finance"
    assert all(task['type'] == "Finance" for task in data)
    # Verify task dates are within last week
    week_ago = datetime.now() - timedelta(days=8) # 8 days to measure a week ago since today is included
    assert all(datetime.strptime(task['due_date'], '%Y-%m-%d') > week_ago for task in data)
    # Delete the task created for testing
    task_id = next(task['id'] for task in response.json if task['description'] == "Task for filtered tasks retrieval route testing")
    response = client.delete(f'/delete_task/{task_id}') # Delete task route already tested

def test_get_tasks_invalid_time_frame(client):
    """Test retrieving tasks with an invalid time frame."""
    # Send a GET request to retrieve tasks with an invalid time frame
    response = client.get('/tasks/employee/1/All/Invalid%20Time%20Frame', json={})
    # Check that the response status code is 400 (Bad Request)
    assert response.status_code == 400
    # Check that the response message indicates an invalid time frame was provided
    data = response.get_json()
    assert data['message'] == 'Invalid time frame provided'

def test_get_tasks_no_tasks_found_within_time_frame(client):
    """Test retrieving tasks within a specified time frame where no tasks are found."""
    # Send a GET request to retrieve tasks within a specified time frame where no tasks are found
    response = client.get('/tasks/employee/1/All/Next%20Month', json={})
    # Check that the response status code is 404 (Not Found)
    assert response.status_code == 404
    # Check that the response message indicates no tasks were found within the specified time frame
    data = response.get_json()
    assert data['message'] == 'No tasks found within the specified time frame'

def test_get_tasks_no_filtered_tasks_found_for_employee(client):
    """Test retrieving tasks within a specified time frame and type where no tasks are found for the employee."""
    # Send a GET request to retrieve tasks within a specified time frame and type where no tasks are found for the employee
    response = client.get('/tasks/employee/1000/Finance/Past%20Week', json={})
    # Check that the response status code is 404 (Not Found)
    assert response.status_code == 404
    # Check that the response message indicates no tasks were found for the employee
    data = response.get_json()
    assert data['message'] == 'No tasks found for this employee'

def test_get_subordinate_tasks(client):
    """Test retrieving tasks associated with employees managed by a specific manager."""
    # Define a mock task to create for a subordinate of manager 1(Employee 2)
    new_task = {
        "assignee_id": 2,
        "status": "In Progress",
        "description": "Task for managerial tasks retrieval route testing",
        "type": "Other",
        "due_date": (datetime.now() - timedelta(days=3)).strftime('%Y-%m-%d') # Due date is 3 days ago
    }
    # Send a POST request to create the task
    response = client.post('/create_task', json=new_task) # Create task route already tested
    # Send a GET request to retrieve tasks associated with employees managed by a specific manager
    response = client.get('/tasks/manager/1', json={})
    # Check that the response status code is 200 (OK)
    assert response.status_code == 200
    # Check that the response data is a list
    data = response.json
    assert isinstance(data, list)
    # Check that the created task associated with subordinate 2 is in the response data
    assert any(task['description'] == "Task for managerial tasks retrieval route testing" for task in data)
    # Delete the task created for testing
    task_id = next(task['id'] for task in response.json if task['description'] == "Task for managerial tasks retrieval route testing")
    response = client.delete(f'/delete_task/{task_id}') # Delete task route already tested

def test_get_subordinate_tasks_no_tasks_found(client):
    """Test retrieving tasks associated with employees managed by a specific manager where no tasks are found."""
    # Send a GET request to retrieve tasks associated with employees managed by a specific manager where no tasks are found
    response = client.get('/tasks/manager/1000', json={})
    # Check that the response status code is 404 (Not Found)
    assert response.status_code == 404
    # Check that the response message indicates no tasks were found for employees managed by this manager
    data = response.get_json()
    assert data['message'] == 'No tasks found for employees managed by this manager'

def test_get_subordinate_tasks_type_timeframe(client):
    """Test retrieving tasks associated with employees managed by a specific manager within a specified time frame and type."""
    # Define a mock task to create
    new_task = {
        "assignee_id": 2, # Employee 2 is a subordinate of manager 1
        "status": "In Progress",
        "description": "Task for managerial filtered tasks retrieval route testing",
        "type": "Finance",
        "due_date": (datetime.now() - timedelta(days=3)).strftime('%Y-%m-%d') # Due date is 3 days ago
    } 
    # Send a POST request to create the task
    response = client.post('/create_task', json=new_task) # Create task route already tested
    # Send a GET request to retrieve tasks associated with employees managed by a specific manager within a specified time frame and type
    response = client.get('/tasks/manager/1/Finance/Past%20Week', json={}) # Manager 1, Finance tasks, Past Week
    # Check that the response status code is 200 (OK)
    assert response.status_code == 200
    # Check that the response data is a list
    data = response.json
    assert isinstance(data, list)
    # Check that the response data is of the correct type and within the specified time frame
    # Verify task type is "Finance"
    assert all(task['type'] == "Finance" for task in data)
    # Verify task dates are within last week
    week_ago = datetime.now() - timedelta(days=8) # 8 days to measure a week ago since today is included
    assert all(datetime.strptime(task['due_date'], '%Y-%m-%d') > week_ago for task in data)
    # Delete the task created for testing
    task_id = next(task['id'] for task in response.json if task['description'] == "Task for managerial filtered tasks retrieval route testing")
    response = client.delete(f'/delete_task/{task_id}') # Delete task route already tested

def test_get_subordinate_tasks_invalid_time_frame(client):
    """Test retrieving tasks associated with employees managed by a specific manager with an invalid time frame."""
    # Send a GET request to retrieve tasks associated with employees managed by a specific manager with an invalid time frame
    response = client.get('/tasks/manager/1/All/Invalid%20Time%20Frame', json={})
    # Check that the response status code is 400 (Bad Request)
    assert response.status_code == 400
    # Check that the response message indicates an invalid time frame was provided
    data = response.get_json()
    assert data['message'] == 'Invalid time frame provided'

def test_get_subordinate_tasks_no_tasks_found_within_time_frame(client):
    """Test retrieving tasks associated with employees managed by a specific manager within a specified time frame where no tasks are found."""
    # Send a GET request to retrieve tasks associated with employees managed by a specific manager within a specified time frame where no tasks are found
    response = client.get('/tasks/manager/1/All/Next%20Month', json={})
    # Check that the response status code is 404 (Not Found)
    assert response.status_code == 404
    # Check that the response message indicates no tasks were found within the specified time frame
    data = response.get_json()
    assert data['message'] == 'No tasks found within the specified time frame'

def test_get_subordinate_tasks_no_subordinate_tasks_found_for_manager(client):
    """Test retrieving tasks associated with employees managed by a specific manager where no tasks are found for the manager."""
    # Send a GET request to retrieve tasks associated with employees managed by a specific manager where no tasks are found for the manager
    response = client.get('/tasks/manager/1000', json={})
    # Check that the response status code is 404 (Not Found)
    assert response.status_code == 404
    # Check that the response message indicates no tasks were found for employees managed by this manager
    data = response.get_json()
    assert data['message'] == 'No tasks found for employees managed by this manager'

def test_update_task(client):
    """Test updating a task."""
    # Define a mock task to create
    new_task = {
        "assignee_id": 1,
        "status": "In Progress",
        "description": "Task for updating",
        "type": "Other",
        "due_date": (datetime.now() - timedelta(days=3)).strftime('%Y-%m-%d') # Due date is 3 days ago
    }
    # Send a POST request to create the task
    response = client.post('/create_task', json=new_task) # Create task route already tested
    # Get the task ID from the response data
    task_id = response.json['id']
    # Define updated task data
    updated_data = {
        "assignee_id": 1,
        "status": "Completed", # Update status to "Completed"
        "description": "Task for updating",
        "type": "Other",
        "due_date": (datetime.now() - timedelta(days=3)).strftime('%Y-%m-%d') # Due date is 3 days ago
    }
    # Send a PUT request to update the task
    response = client.put(f'/update_task/{task_id}', json=updated_data)
    # Check that the response status code is 200 (OK)
    assert response.status_code == 200
    # Check that the response data matches the updated task data
    data = response.json
    assert data['status'] == "Completed"
    # Delete the task created for testing
    response = client.delete(f'/delete_task/{task_id}') # Delete task route already tested

def test_update_task_not_found(client):
    """Test updating a task that does not exist."""
    # Define updated task data
    updated_data = {
       "assignee_id": 1,
        "status": "Completed", # Update status to "Completed"
        "description": "Task for updating",
        "type": "Other",
        "due_date": (datetime.now() - timedelta(days=3)).strftime('%Y-%m-%d') # Due date is 3 days ago
    }
    # Send a PUT request to update a task that does not exist
    response = client.put('/update_task/1000', json=updated_data)
    # Check that the response status code is 404 (Not Found)
    assert response.status_code == 404
    # Check that the response message indicates the task was not found
    data = response.get_json()
    assert data['message'] == 'Task not found'