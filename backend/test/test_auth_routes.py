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

    def get_id(self):
        """Required Flask-Login method of user class to return a unique identifier."""
        return self.employee_id

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
    with client.application.app_context(): # Required for session handling
        # Mock current_user to return the mock user
        with patch("flask_login.current_user", mock_user), \
             patch("flask_login.login_required", lambda x: x):  # Mock login_required decorator check
            with client.session_transaction() as sess: # Obtain session for modification
                # Set user ID in session to simulate logged in user
                sess['_user_id'] = str(mock_user.get_id()) 
            
            # Hit the protected logout route
            response = client.post('/logout')
            assert response.status_code == 200
            assert response.json["success"] is True

def test_get_current_user(client):
    """Test retrieving current user information."""
    with client.application.app_context(): # Required for session handling
        with patch("app.models.Employee.query") as mock_query, \
             patch("flask_login.login_required", lambda x: x):   # Mock login_required decorator check
            mock_query.get.return_value = mock_user # Mock query to return the user
            mock_user.is_authenticated = True # Sets the mock user as authenticated

            with client.session_transaction() as sess: # Obtain session for modification
                # Set user ID in session to simulate logged in user
                sess['_user_id'] = str(mock_user.get_id()) 

            # Hit the protected current_user route
            response = client.get('/current_user')
            assert response.status_code == 200
            print(f'Response user: {response.json["user"]}')
            assert "user" in response.json
            assert response.json["user"]["name"] == "Test User"
            assert response.json["user"]["email"] == "test@example.com"
            assert response.json["user"]["employee_id"] == 1