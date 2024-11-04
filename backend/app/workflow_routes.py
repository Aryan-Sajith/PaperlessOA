from flask import Blueprint, jsonify, request
from .models import Workflow, db
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
@workflow_bp.route('/workflows', methods=['POST'])
def create_workflow():
    data = request.get_json()

    # Validate required fields
    if not data or not all(field in data for field in ["assignee_id", "status", "content", "type", "workflow_id"]):
        return jsonify({"error": "Missing required workflow fields"}), 400

    try:
        new_workflow = Workflow(
            assignee_id=data['assignee_id'],
            status=data['status'],
            content=data['content'],
            type=data['type'],
            workflow_id=data['workflow_id'],
            time_stamp=datetime.utcnow()
        )

        db.session.add(new_workflow)
        db.session.commit()
        return jsonify(new_workflow.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create workflow", "details": str(e)}), 500


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

        workflow.time_stamp = datetime.utcnow()  # Update timestamp on edit

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
