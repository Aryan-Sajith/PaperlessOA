from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request
from .models import Employee, EmployeeManager, Task, db
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
    
def get_tasks_by_id_from_time_frame(employee_id, start_date, end_date):
    """
    Helper Function for selecting date range of tasks
    """
    # Query tasks for the employee
    tasks = Task.query.filter(Task.assignee_id == employee_id).all()

    if tasks:
        # Filter tasks within the date range
        filtered_tasks = [
            task.to_dict() for task in tasks
            if 'due_date' in task.to_dict() and start_date <= datetime.strptime(task.to_dict()['due_date'], "%Y-%m-%d").date() <= end_date
        ]

        if filtered_tasks:
            return jsonify(filtered_tasks)
        else:
            return jsonify({"message": "No tasks found within the specified time frame"}), 404
    else:
        return jsonify({"message": "No tasks found for this employee"}), 404
    
# Past Day
@task_bp.route('/tasks/employee/<int:employee_id>/past_day', methods=['GET'])
def get_tasks_past_day(employee_id):
    today = datetime.now().date()
    yesterday = today - timedelta(days=1)
    return get_tasks_by_id_from_time_frame(employee_id, yesterday, today)

# Past Week
@task_bp.route('/tasks/employee/<int:employee_id>/past_week', methods=['GET'])
def get_tasks_past_week(employee_id):
    today = datetime.now().date()
    past_week = today - timedelta(days=7)
    return get_tasks_by_id_from_time_frame(employee_id, past_week, today)

# Past Month
@task_bp.route('/tasks/employee/<int:employee_id>/past_month', methods=['GET'])
def get_tasks_past_month(employee_id):
    today = datetime.now().date()
    past_month = today - timedelta(days=30)
    return get_tasks_by_id_from_time_frame(employee_id, past_month, today)

# Next Day
@task_bp.route('/tasks/employee/<int:employee_id>/next_day', methods=['GET'])
def get_tasks_next_day(employee_id):
    today = datetime.now().date()
    tomorrow = today + timedelta(days=1)
    return get_tasks_by_id_from_time_frame(employee_id, today, tomorrow)

# Next Week
@task_bp.route('/tasks/employee/<int:employee_id>/next_week', methods=['GET'])
def get_tasks_next_week(employee_id):
    today = datetime.now().date()
    next_week = today + timedelta(days=7)
    return get_tasks_by_id_from_time_frame(employee_id, today, next_week)

# Next Month
@task_bp.route('/tasks/employee/<int:employee_id>/next_month', methods=['GET'])
def get_tasks_next_month(employee_id):
    today = datetime.now().date()
    next_month = today + timedelta(days=30)
    return get_tasks_by_id_from_time_frame(employee_id, today, next_month)

@task_bp.route('/tasks/manager/<int:manager_id>', methods=['GET'])
def get_subordinate_tasks(manager_id):
    # Query Task table for tasks assigned to employees managed by the given manager_id
    subordinate_tasks = (Task.query
        .join(Employee, Task.assignee_id == Employee.employee_id)
        .join(EmployeeManager, Employee.employee_id == EmployeeManager.employee_id)
        .filter(EmployeeManager.manager_id == manager_id)
        .all())

    # Check if tasks are found
    if subordinate_tasks:
        tasks_list = [task.to_dict() for task in subordinate_tasks]
        return jsonify(tasks_list)
    else:
        return jsonify({"message": "No tasks found for employees managed by this manager"}), 404

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

