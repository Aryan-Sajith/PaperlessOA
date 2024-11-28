from crypt import methods

from flask import Blueprint, jsonify, request
from .models import Task, db
from datetime import datetime


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

@task_bp.route('/create_task', methods=['POST'])
def create_task():
    data = request.get_json()

    # Validate the required fields
    if not data or not all(field in data for field in ["assignee_id", "status", "description", "type", "due_date"]):
        return jsonify({"error": "Missing required task fields"}), 400

    try:
        # Create a new Task instance
        new_task = Task(
            assignee_id=data['assignee_id'],
            status=data['status'],
            description=data['description'],
            type=data['type'],
            due_date=datetime.strptime(data['due_date'], '%Y-%m-%d')
        )

        # Add and commit the new task to the database
        db.session.add(new_task)
        db.session.commit()

        return jsonify(new_task.to_dict()), 201  # Return the new task as a JSON response with a 201 status code

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create task", "details": str(e)}), 500
        
@task_bp.route('/update_task/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()

    # Validate the required fields
    if not data or not all(field in data for field in ["assignee_id", "status", "description", "type", "due_date"]):
        return jsonify({"error": "Missing required task fields"}), 400

    try:
        task = Task.query.get(task_id)

        if task: 
            # Update the task fields
            task.assignee_id = data['assignee_id']
            task.status = data['status']
            task.description = data['description']
            task.type = data['type']
            task.due_date = datetime.strptime(data['due_date'], '%Y-%m-%d')

            # Commit database changes to ensure the task is updated
            db.session.commit()

            return jsonify(task.to_dict()), 200  # Return the updated task as a JSON response with a 200 status code
        else:
            return jsonify({"message": "Task not found"}), 404

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update task", "details": str(e)}), 500
    
@task_bp.route('/delete_task/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get(task_id)

    try:
        if task:
            db.session.delete(task)
            db.session.commit() # Commit database changes to ensure the task is deleted
            return jsonify({"message": "Task successfully deleted"}), 200
        else:
            return jsonify({"message": "Task to delete not found!"}), 404
    except Exception as e:
        db.session.rollback() # Rollback the database session to prevent invalid changes
        return jsonify({"error": "Failed to delete task", "details": str(e)}), 500

