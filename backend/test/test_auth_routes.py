import pytest
from unittest.mock import patch, MagicMock
from flask import Flask
from werkzeug.security import generate_password_hash, check_password_hash
from app import create_app

@pytest.fixture
def client():
    """Fixture to create a test client."""
    app = create_app()
    app.config['TESTING'] = True
    app.config['WTF_CSRF_ENABLED'] = False  # Disable CSRF for testing
    with app.app_context():
        yield app.test_client()

# Mock user data with a proper to_dict method
class MockUser:
    def __init__(self, employee_id, name, email, password,is_active):
        self.employee_id = employee_id
        self.name = name
        self.email = email
        self.password_hash = generate_password_hash(password)
        self.is_active = is_active
    
    def to_dict(self):
        return {
            "employee_id": self.employee_id,
            "name": self.name,
            "email": self.email
        }
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


mock_user = MockUser(
    employee_id=1, 
    name="Test User", 
    email="test@example.com", 
    password="correct_password",
    is_active= False
)

def test_login_success(client):
    """Test successful login."""
    with patch("app.models.Employee.query") as mock_query, \
         patch("flask_login.login_user") as mock_login_user:
        
        
        mock_query.filter_by.return_value.first.return_value = mock_user
        
        
        login_data = {
            "email": "test@example.com",
            "password": "correct_password"
        }
        
        
        response = client.post('/login', json=login_data)
        
        # Assertions
        assert response.status_code == 200
        assert response.json["success"] is True
        assert "user" in response.json
        assert response.json["user"]["name"] == "Test User"

def test_login_missing_credentials(client):
    """Test login with missing email or password."""
    # Test missing email
    response = client.post('/login', json={"password": "test"})
    assert response.status_code == 400
    assert "error" in response.json

    # Test missing password
    response = client.post('/login', json={"email": "test@example.com"})
    assert response.status_code == 400
    assert "error" in response.json

def test_login_user_not_found(client):
    """Test login with non-existent user."""
    with patch("app.models.Employee.query") as mock_query:
        
        mock_query.filter_by.return_value.first.return_value = None
        
        login_data = {
            "email": "nonexistent@example.com",
            "password": "password"
        }
        
        response = client.post('/login', json=login_data)
        assert response.status_code == 400
        assert response.json["error"] == "Invalid username"

def test_login_incorrect_password(client):
    """Test login with incorrect password."""
    with patch("app.models.Employee.query") as mock_query:
        # Mock query to return the user
        mock_query.filter_by.return_value.first.return_value = mock_user
        
        login_data = {
            "email": "test@example.com",
            "password": "wrong_password"
        }
        
        response = client.post('/login', json=login_data)
        assert response.status_code == 400
        assert response.json["error"] == "Invalid password"

def test_logout(client):
    """Test logout functionality."""
    with patch("flask_login.current_user", mock_user), \
         patch("flask_login.login_required", lambda f: f), \
         patch("flask_login.logout_user") as mock_logout_user:
        
        response = client.post('/logout')
        assert response.status_code == 200
        assert response.json["success"] is True

def test_get_current_user(client):
    """Test retrieving current user information."""
    with patch("flask_login.current_user", mock_user), \
         patch("flask_login.login_required", lambda f: f):
        mock_user.is_autheticated =True
        response = client.get('/current_user')
        assert response.status_code == 200
        assert "user" in response.json
        assert response.json["user"]["name"] == "Test User"