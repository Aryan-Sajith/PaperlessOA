from flask import Blueprint, jsonify, request, current_app
from .models import Workflow, db, Employee
from datetime import datetime

workflow_bp = Blueprint('workflow_bp', __name__)


# Route to get all workflows
@workflow_bp.route('/workflows', methods=['GET'])
def get_workflows():
    workflows = Workflow.query.all()
    workflows_list = [workflow.to_dict() for workflow in workflows]
    return jsonify(workflows_list)

# Route to get workflows by employee ID (assignee_id)
@workflow_bp.route('/workflows/employee/<int:employee_id>', methods=['GET'])
def get_workflow_by_employee_id(employee_id):
    workflows = Workflow.query.filter_by(assignee_id=employee_id).all()
    if workflows:
        workflows_list = [workflow.to_dict() for workflow in workflows]
        return jsonify(workflows_list)
    else:
        return jsonify({"message": "No workflows found for this employee"}), 404


# Route to create a new workflow
@workflow_bp.route('/create_workflow', methods=['POST'])
def create_workflow():
    data = request.get_json()
    current_app.logger.info(data)

    # Validate required fields
    # if not data or not all(field in data for field in ["assignee_id", "status", "content", "type", "workflow_id"]):
    #     return jsonify({"error": "Missing required workflow fields"}), 400

    try:
        new_workflow = Workflow(
            assignee_id=data['assignee_id'] if "assignee_id" in data else 1,
            status=data['status'] if "status" in data else "None",
            content=str(data),
            type=data['type'],
            workflow_id=data['workflow_id'] if "workflow_id" in data else 2,
            timestamp=datetime.utcnow()
        )
        db.session.add(new_workflow)
        db.session.commit()
        return jsonify(new_workflow.to_dict()), 201

    except Exception as e:
        current_app.logger.error(e)
        db.session.rollback()
        return jsonify({"error": "Failed to create workflow", "details": str(e)}), 500

@workflow_bp.route('/workflow/<int:workflow_id>', methods=['GET'])
def get_workflow_by_id(workflow_id):
    current_app.logger.info(f"workflow_id: {workflow_id}")
    workflow = Workflow.query.filter_by(id=workflow_id).first()
    if workflow:
        return jsonify(workflow.to_dict())

# Route to update a workflow by ID
@workflow_bp.route('/workflows/<int:workflow_id>', methods=['PUT'])
def update_workflow(workflow_id):
    data = request.get_json()
    workflow = Workflow.query.get(workflow_id)

    if not workflow:
        return jsonify({"error": "Workflow not found"}), 404

    try:
        # Update fields if provided in the request data
        if 'status' in data:
            workflow.status = data['status']
        if 'content' in data:
            workflow.content = data['content']
        if 'type' in data:
            workflow.type = data['type']

        workflow.timestamp = datetime.utcnow()  # Update timestamp on edit

        db.session.commit()
        return jsonify(workflow.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update workflow", "details": str(e)}), 500


# Route to delete a workflow by ID
@workflow_bp.route('/workflows/<int:workflow_id>', methods=['DELETE'])
def delete_workflow(workflow_id):
    workflow = Workflow.query.get(workflow_id)

    if not workflow:
        return jsonify({"error": "Workflow not found"}), 404

    try:
        db.session.delete(workflow)
        db.session.commit()
        return jsonify({"message": "Workflow deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete workflow", "details": str(e)}), 500

@workflow_bp.route('/approve_workflow', methods=['POST'])
def approve_workflow():
    data = request.json

    workflow_type = data.get('type')
    workflow_id = data.get('workflow_id')
    details = data.get('details')  # Contains additional data for the workflow

    if not workflow_type or not workflow_id:
        return jsonify({"error": "Missing required fields: 'type' or 'workflow_id'"}), 400

    # Handle workflow types
    if workflow_type == "onboarding":
        return handle_onboarding(details)
    elif workflow_type == "removal":
        return handle_removal(details)
    elif workflow_type == "promotion":
        return handle_promotion(details)
    else:
        return jsonify({"error": f"Unsupported workflow type: {workflow_type}"}), 400


def handle_onboarding(details):
    """Handles the onboarding workflow."""
    try:
        new_employee = Employee(
            position=details['position'],
            is_manager=details['is_manager'],
            start_date=details['start_date'],
            status=details['status'],
            birth_date=details['birth_date'],
            name=details['name'],
            salary=details['salary'],
            level=details['level']
        )
        db.session.add(new_employee)
        db.session.commit()
        return jsonify({"message": "Employee onboarded successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to onboard employee: {str(e)}"}), 500


def handle_removal(details):
    """Handles the removal workflow."""
    try:
        employee_id = details['employee_id']
        employee = Employee.query.get(employee_id)
        if not employee:
            return jsonify({"error": "Employee not found"}), 404
        db.session.delete(employee)
        db.session.commit()
        return jsonify({"message": "Employee removed successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to remove employee: {str(e)}"}), 500


def handle_promotion(details):
    """Handles the promotion workflow."""
    try:
        employee_id = details['employee_id']
        employee = Employee.query.get(employee_id)
        if not employee:
            return jsonify({"error": "Employee not found"}), 404

        # Update employee details
        employee.position = details.get('position', employee.position)
        employee.salary = details.get('salary', employee.salary)
        employee.level = details.get('level', employee.level)

        db.session.commit()
        return jsonify({"message": "Employee promoted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to promote employee: {str(e)}"}), 500
