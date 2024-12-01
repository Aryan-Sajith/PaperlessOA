from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, login_manager
from werkzeug.security import check_password_hash
from .models import Employee

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Server error: User email or password cannot be retrieved'}), 400

    user = Employee.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'Invalid username'}), 400

    if check_password_hash(user.password_hash, password):
        login_user(user)
        return jsonify({"success": True, "user": user.to_dict()}), 200
    
    return jsonify({'error': 'Invalid password'}), 400

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"success": True}), 200

@auth_bp.route('/current_user', methods=['GET'])
@login_required
def get_current_user():
    return jsonify(user=current_user.to_dict()), 200