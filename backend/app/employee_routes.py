from flask import Blueprint, jsonify
from .models import Employee, EmployeeManager

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

# Route to get all subordinates under a specific manager
@employee_bp.route('/manager/<int:manager_id>/subordinates', methods=['GET'])
def get_subordinate(manager_id):
    # Query EmployeeManager table for records where manager_id matches the given manager_id
    subordinates = Employee.query.join(EmployeeManager, Employee.employee_id == EmployeeManager.employee_id) \
                                  .filter(EmployeeManager.manager_id == manager_id) \
                                  .all()

    # Check if the manager has subordinates
    if subordinates:
        subordinates_list = [emp.to_dict() for emp in subordinates]
        return jsonify(subordinates_list)
    else:
        return jsonify({"message": "No subordinates found for this manager"}), 404