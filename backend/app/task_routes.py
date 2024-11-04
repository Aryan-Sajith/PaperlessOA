from crypt import methods

from flask import Blueprint, jsonify
from .models import Task, Employee

task_bp = Blueprint('task_bp', __name__)

# Route to get all tasks
@task_bp.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    tasks_list = [task.to_dict() for task in tasks]
    return jsonify(tasks_list)

@task_bp.route('/tasks/employee/<int:employee_id>', methods=['GET'])
def get_tasks_by_id(employee_id):
    # Query Task table for tasks assigned to the given employee_id
    tasks = Task.query.filter(Task.assignee_id == employee_id).all()

    # Check if tasks are found
    if tasks:
        tasks_list = [task.to_dict() for task in tasks]
        return jsonify(tasks_list)
    else:
        return jsonify({"message": "No tasks found for this employee"}), 404