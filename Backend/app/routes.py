from flask import Blueprint, jsonify
from .models import Employee
from . import db

main = Blueprint('main', __name__)

# Route to get all employees
@main.route('/employees', methods=['GET'])
def get_employees():
    employees = Employee.query.all()
    employees_list = [emp.to_dict() for emp in employees]
    return jsonify(employees_list)
