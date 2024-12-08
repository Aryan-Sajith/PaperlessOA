import unittest
from unittest.mock import patch, MagicMock
from flask import Flask
from flask_login import login_user, logout_user
from app import create_app
from app.models import Employee

class AuthRoutesTestCase(unittest.TestCase):
    def setUp(self):
        """Set up the test environment."""
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()
        
        
        self.app_context = self.app.app_context()
        self.app_context.push()

    def tearDown(self):
        """Clean up after each test."""
        
        self.app_context.pop()

    def test_get_current_user_success(self):
        """Test retrieving the current user when authenticated."""
        with patch('flask_login.current_user') as mock_current_user:
            mock_user = MagicMock()
            mock_user.is_authenticated = True
            mock_user.to_dict.return_value = {"id": 1, "email": "test@example.com"}
            mock_current_user.__bool__.return_value = True
            mock_current_user.return_value = mock_user

            response = self.client.get('/current_user')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json, {"user": {"id": 1, "email": "test@example.com"}})

    def test_get_current_user_unauthorized(self):
        """Test retrieving the current user without authentication."""
        with patch('flask_login.current_user') as mock_current_user:
            mock_user = MagicMock()
            mock_user.is_authenticated = False
            mock_current_user.__bool__.return_value = False

            response = self.client.get('/current_user')

            self.assertEqual(response.status_code, 401)

    def test_login_invalid_email(self):
        """Test login with invalid email."""
        with patch('app.models.Employee.query') as mock_employee_query:
            mock_employee_query.filter_by.return_value.first.return_value = None

            response = self.client.post('/login', json={
                "email": "invalid@example.com",
                "password": "password123"
            })

            self.assertEqual(response.status_code, 400)
            self.assertEqual(response.json, {"error": "Invalid username"})

    def test_login_invalid_password(self):
        """Test login with invalid password."""
        with patch('app.models.Employee.query') as mock_employee_query, \
             patch('werkzeug.security.check_password_hash', return_value=False):
            mock_user = MagicMock()
            mock_user.password_hash = 'hashed_password'
            mock_employee_query.filter_by.return_value.first.return_value = mock_user

            response = self.client.post('/login', json={
                "email": "test@example.com",
                "password": "wrongpassword"
            })

            self.assertEqual(response.status_code, 400)
            self.assertEqual(response.json, {"error": "Invalid password"})

    def test_login_success(self):
        """Test successful login."""
        with patch('app.models.Employee.query') as mock_employee_query, \
             patch('werkzeug.security.check_password_hash', return_value=True), \
             patch('flask_login.login_user') as mock_login_user:
            mock_user = MagicMock()
            mock_user.to_dict.return_value = {"id": 1, "email": "test@example.com"}
            mock_user.password_hash = 'scrypt:32768:8:1$S4CkRUehkgocgKxc$640ec806d3be9ff7c8d78219f453d71778c3e73551da3acb8c955a4eb91fdd87805e6fd1199c8d69c1ce91f5d4d5be42a43470fdd7b5737d96e0eb6c2be2d4db'
            mock_employee_query.filter_by.return_value.first.return_value = mock_user

            response = self.client.post('/login', json={
                "email": "test@example.com",
                "password": "password123"
            })

            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json, {
                "success": True,
                "user": {"id": 1, "email": "test@example.com"}
            })
            mock_login_user.assert_called_once_with(mock_user)

    def test_logout_success(self):
        """Test successful logout."""
        with patch('flask_login.logout_user') as mock_logout_user, \
             patch('flask_login.current_user') as mock_current_user:
            mock_user = MagicMock()
            mock_user.is_authenticated = True
            mock_current_user.__bool__.return_value = True
            mock_current_user.return_value = mock_user

            response = self.client.post('/logout')

            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json, {"success": True})
            mock_logout_user.assert_called_once()
