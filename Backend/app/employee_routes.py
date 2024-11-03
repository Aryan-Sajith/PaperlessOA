from flask import Blueprint, jsonify
from .models import Employee

employee_bp = Blueprint('employee_bp', __name__)

# Route to get all employees
@employee_bp.route('/employees', methods=['GET'])
def get_employees():
    employees = Employee.query.all()
    employees_list = [emp.to_dict() for emp in employees]
    return jsonify(employees_list)

# Route to get an employee by name
@employee_bp.route('/employee/<name>', methods=['GET'])
def get_employee_by_name(name):
    employee = Employee.query.filter_by(name=name).first()
    if employee:
        return jsonify(employee.to_dict())
    else:
        return jsonify({"error": "Employee not found"}), 404
