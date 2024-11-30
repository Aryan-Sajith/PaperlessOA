import pytest
from flask import Flask
from ..app import create_app  # Import the Flask app from workflow_routes

@pytest.fixture
def client():
    app = create_app()
    """Fixture to create a test client."""
    app.config['TESTING'] = True
    return app.test_client()

# Example data for testing
mock_workflows = [
    {"id": 1, "type": "Promotion", "status": "Initialized", "start_date": "2024-10-31"},
    {"id": 2, "type": "Onboarding", "status": "Completed", "start_date": "2024-09-20"},
    {"id": 3, "type": "Absence", "status": "Approved", "start_date": "2024-08-10"},
]

@pytest.fixture
def mock_database(monkeypatch):
    """Mock database interactions."""

    def mock_get_workflows():
        return mock_workflows

    monkeypatch.setattr("app.workflow_routes.get_workflows", mock_get_workflows)

# Tests for endpoints

def test_get_workflows(client, mock_database):
    """Test retrieving all workflows."""
    response = client.get('/workflows')
    assert response.status_code == 200
    data = response.json
    assert isinstance(data, list)

def test_get_workflow_by_id(client, mock_database):
    """Test retrieving a workflow by ID."""
    workflow_id = 1
    response = client.get(f'/workflow/{workflow_id}')
    assert response.status_code == 200
    data = response.json
    assert data['id'] == workflow_id

def test_get_workflow_invalid_id(client, mock_database):
    """Test retrieving a workflow with an invalid ID."""
    invalid_id = 999
    response = client.get(f'/workflow/{invalid_id}')
    assert response.status_code == 404
    assert response.json['error'] == "Workflow not found."

def test_create_workflow(client):
    """Test creating a new workflow."""
    new_workflow = {
        "type": "Resignation",
        "status": "Initialized",
        "start_date": "2024-12-01"
    }
    response = client.post('/workflows/create', json=new_workflow)
    assert response.status_code == 201
    data = response.json
    assert data['type'] == new_workflow['type']
    assert data['status'] == new_workflow['status']

def test_create_workflow_missing_field(client):
    """Test creating a workflow with missing fields."""
    incomplete_workflow = {"type": "Resignation"}
    response = client.post('/workflows/create', json=incomplete_workflow)
    assert response.status_code == 400
    assert "error" in response.json

def test_update_workflow(client, mock_database):
    """Test updating a workflow."""
    workflow_id = 1
    updated_data = {"status": "Completed"}
    response = client.put(f'/workflow/{workflow_id}', json=updated_data)
    assert response.status_code == 200
    data = response.json
    assert data['status'] == "Completed"

def test_delete_workflow(client, mock_database):
    """Test deleting a workflow."""
    workflow_id = 1
    response = client.delete(f'/workflow/{workflow_id}')
    assert response.status_code == 200
    assert response.json['message'] == "Workflow deleted successfully."

def test_delete_workflow_invalid_id(client, mock_database):
    """Test deleting a workflow with an invalid ID."""
    invalid_id = 999
    response = client.delete(f'/workflow/{invalid_id}')
    assert response.status_code == 404
    assert response.json['error'] == "Workflow not found."
