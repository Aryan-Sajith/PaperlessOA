from unittest.mock import patch, MagicMock
import pytest
from flask import Flask
from app import create_app  # Import your app factory

@pytest.fixture
def client():
    """Fixture to create a test client."""
    app = create_app()
    app.config['TESTING'] = True
    with app.app_context():
        yield app.test_client()

# Example data for testing
mock_employees = [
    {"employee_id": 1, "name": "Alice", "role": "Developer"},
    {"employee_id": 2, "name": "Bob", "role": "Manager"},
]

mock_employee_manager = [
    {"manager_id": 2, "employee_id": 1}
]

def test_get_employees(client):
    """Test retrieving all employees."""
    with patch("app.models.Employee.query") as mock_query, client.application.app_context():
        # Mock the .all() method
        mock_query.all.return_value = [MagicMock(to_dict=lambda: emp) for emp in mock_employees]

        response = client.get('/employees')
        assert response.status_code == 200
        data = response.json
        assert isinstance(data, list)
        assert len(data) == len(mock_employees)

def test_get_employee_by_name(client):
    """Test retrieving an employee by name."""
    with patch("app.models.Employee.query") as mock_query, client.application.app_context():
        # Mock the .filter_by().first() chain
        mock_query.filter_by.return_value.first.return_value = MagicMock(
            to_dict=lambda: mock_employees[0]
        )

        response = client.get('/employee/Alice')
        assert response.status_code == 200
        data = response.json
        assert data['name'] == "Alice"

def test_get_employee_by_name_not_found(client):
    """Test retrieving an employee by name when not found."""
    with patch("app.models.Employee.query") as mock_query, client.application.app_context():
        mock_query.filter_by.return_value.first.return_value = None

        response = client.get('/employee/Charlie')
        assert response.status_code == 404
        assert response.json['error'] == "Employee not found"

def test_get_employee_by_id(client):
    """Test retrieving an employee by ID."""
    with patch("app.models.Employee.query") as mock_query, client.application.app_context():
        mock_query.filter_by.return_value.first.return_value = MagicMock(
            to_dict=lambda: mock_employees[0]
        )

        response = client.get('/employee/1')
        assert response.status_code == 200
        data = response.json
        assert data['name'] == "Alice"

def test_get_employee_by_id_not_found(client):
    """Test retrieving an employee by ID when not found."""
    with patch("app.models.Employee.query") as mock_query, client.application.app_context():
        mock_query.filter_by.return_value.first.return_value = None

        response = client.get('/employee/999')
        assert response.status_code == 404
        assert response.json['error'] == "Employee not found"

def test_get_subordinates(client):
    """Test retrieving all subordinates for a manager."""
    with patch("app.models.Employee.query") as mock_employee_query, \
         patch("app.models.EmployeeManager.query") as mock_manager_query, \
         client.application.app_context():
        # Mock join and filter calls
        mock_employee_query.join.return_value.filter.return_value.all.return_value = [
            MagicMock(to_dict=lambda: mock_employees[0])
        ]

        response = client.get('/manager/2/subordinates')
        assert response.status_code == 200
        data = response.json
        assert isinstance(data, list)
        assert len(data) == 1
        assert data[0]['name'] == "Alice"

def test_get_subordinates_not_found(client):
    """Test retrieving subordinates when no subordinates exist."""
    with patch("app.models.Employee.query") as mock_employee_query, \
         client.application.app_context():
        mock_employee_query.join.return_value.filter.return_value.all.return_value = []

        response = client.get('/manager/2/subordinates')
        assert response.status_code == 404
        assert response.json['message'] == "No subordinates found for this manager"
