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

# Route to get tasks associated with a specific employee id
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

# Route to get tasks associated with a specific employee id, task type, and time frame
@task_bp.route('/tasks/employee/<int:employee_id>/<string:task_type>/<string:time_frame>', methods=['GET'])
def get_tasks_by_id_from_type_and_time_frame(employee_id, task_type, time_frame):
    """
    Helper Function for selecting date range of tasks.
    """
    today = datetime.now().date()

    # Mapping of time_frame to timedelta ranges
    time_frame_mapping = {
        "Past Day": (-1, 0),
        "Past Week": (-7, 0),
        "Past Month": (-30, 0),
        "Next Day": (1, 1),
        "Next Week": (1, 7),
        "Next Month": (1, 30)
    }

    # Calculate start_date and end_date
    if time_frame not in time_frame_mapping:
        return jsonify({"message": "Invalid time frame provided"}), 400

    delta_start, delta_end = time_frame_mapping[time_frame]
    start_date = today + timedelta(days=delta_start)
    end_date = today + timedelta(days=delta_end)

    # Query tasks for the employee
    tasks = Task.query.filter(Task.assignee_id == employee_id).all()

    if tasks:
        # Filter tasks by date range and type (if not "All")
        filtered_tasks = [
            task.to_dict() for task in tasks
            if 'due_date' in task.to_dict() and
               start_date <= datetime.strptime(task.to_dict()['due_date'], "%Y-%m-%d").date() <= end_date and
               (task_type == "All" or task.type == task_type)
        ]

        if filtered_tasks:
            return jsonify(filtered_tasks)
        else:
            return jsonify({"message": "No tasks found within the specified time frame"}), 404
    else:
        return jsonify({"message": "No tasks found for this employee"}), 404
    
# Route to get tasks associated with a specific manager id
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

# Route to get tasks associated with a specific manager id, task type, and time frame
@task_bp.route('/tasks/manager/<int:manager_id>/<string:task_type>/<string:time_frame>', methods=['GET'])
def get_subordinate_tasks_by_id_from_type_and_time_frame(manager_id, task_type, time_frame):
    today = datetime.now().date()

    # Mapping of time_frame to timedelta ranges
    time_frame_mapping = {
        "Past Day": (-1, 0),
        "Past Week": (-7, 0),
        "Past Month": (-30, 0),
        "Next Day": (1, 1),
        "Next Week": (1, 7),
        "Next Month": (1, 30)
    }

    # Calculate start_date and end_date
    if time_frame not in time_frame_mapping:
        return jsonify({"message": "Invalid time frame provided"}), 400

    delta_start, delta_end = time_frame_mapping[time_frame]
    start_date = today + timedelta(days=delta_start)
    end_date = today + timedelta(days=delta_end)
    # Query Task table for tasks assigned to employees managed by the given manager_id
    subordinate_tasks = (Task.query
        .join(Employee, Task.assignee_id == Employee.employee_id)
        .join(EmployeeManager, Employee.employee_id == EmployeeManager.employee_id)
        .filter(EmployeeManager.manager_id == manager_id)
        .all())
    
    if subordinate_tasks:
        # Filter tasks by date range and type (if not "All")
        filtered_tasks = [
            task.to_dict() for task in subordinate_tasks
            if 'due_date' in task.to_dict() and
               start_date <= datetime.strptime(task.to_dict()['due_date'], "%Y-%m-%d").date() <= end_date and
               (task_type == "All" or task.type == task_type)
        ]

        if filtered_tasks:
            return jsonify(filtered_tasks)
        else:
            return jsonify({"message": "No tasks found within the specified time frame"}), 404
    else:
        return jsonify({"message": "No tasks found for this employee"}), 404

# Route to create a new task
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

# Route to update an existing task        
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
    
# Route to delete an existing task    
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

