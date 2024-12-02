from flask import Blueprint, request, jsonify 
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash
from .models import Employee

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Check if email and password are provided
    if not email or not password:
        return jsonify({'error': 'User email or password is invalid!'}), 400

    # Check if user exists via email
    user = Employee.query.filter_by(email=email).first()
    if not user: # If user does not exist return error
        return jsonify({'error': 'Invalid username'}), 400 

    if check_password_hash(user.password_hash, password): # If password is valid login the user
        login_user(user)
        return jsonify({"success": True, "user": user.to_dict()}), 200
    
    # If password is invalid return error
    return jsonify({'error': 'Invalid password'}), 400

@auth_bp.route('/logout', methods=['POST'])
@login_required # Only logged in users can logout
def logout():
    logout_user()
    return jsonify({"success": True}), 200

@auth_bp.route('/current_user', methods=['GET'])
@login_required # Only logged in users can retrieve their information
def get_current_user():
    return jsonify(user=current_user.to_dict()), 200