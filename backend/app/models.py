from . import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from flask_login import UserMixin

# Define the Employee model
class Employee(UserMixin, db.Model):
    __tablename__ = 'employee'
    employee_id = db.Column(db.Integer, primary_key=True)
    position = db.Column(db.String(255))
    is_manager = db.Column(db.Boolean)
    start_date = db.Column(db.Date)
    status = db.Column(db.String(50))
    birth_date = db.Column(db.Date)
    name = db.Column(db.String(255))
    salary = db.Column(db.BigInteger)
    level = db.Column(db.String(50))
    email = db.Column(db.String(255))
    password_hash = db.Column(db.String(255))

    # Relationships
    managed_employees = relationship('EmployeeManager', foreign_keys='EmployeeManager.manager_id', back_populates='manager')
    managed_by = relationship('EmployeeManager', foreign_keys='EmployeeManager.employee_id', back_populates='employee')
    workflows = relationship('Workflow', back_populates='assignee')
    tasks = relationship('Task', back_populates='assignee')

    def to_dict(self):
        return {
            "employee_id": self.employee_id,
            "position": self.position,
            "is_manager": self.is_manager,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "status": self.status,
            "birth_date": self.birth_date.isoformat() if self.birth_date else None,
            "name": self.name,
            "salary": self.salary,
            "level": self.level,
            "email": self.email,
        }
        
    def get_id(self):
        """Return the employee_id to satisfy Flask-Login's requirements."""
        return str(self.employee_id)


# Define the EmployeeManager model
class EmployeeManager(db.Model):
    __tablename__ = 'employee_manager'
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, ForeignKey('employee.employee_id'))
    manager_id = db.Column(db.Integer, ForeignKey('employee.employee_id'))

    # Relationships
    employee = relationship('Employee', foreign_keys=[employee_id], back_populates='managed_by')
    manager = relationship('Employee', foreign_keys=[manager_id], back_populates='managed_employees')

    def to_dict(self):
        return {
            "id": self.id,
            "employee_id": self.employee_id,
            "manager_id": self.manager_id
        }


# Define the Workflow model
class Workflow(db.Model):
    __tablename__ = 'workflow'
    id = db.Column(db.Integer, primary_key=True)
    assignee_id = db.Column(db.Integer, ForeignKey('employee.employee_id'))
    status = db.Column(db.String(50))
    content = db.Column(db.Text)
    type = db.Column(db.String(50))
    workflow_id = db.Column(db.Integer, ForeignKey('workflow.id'))
    timestamp = db.Column(db.DateTime)

    # Relationships
    assignee = relationship('Employee', back_populates='workflows')
    parent_workflow = relationship('Workflow', remote_side=[id])

    def to_dict(self):
        return {
            "id": self.id,
            "assignee_id": self.assignee_id,
            "status": self.status,
            "content": self.content,
            "type": self.type,
            "workflow_id": self.workflow_id,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
        }


# Define the Task model
class Task(db.Model):
    __tablename__ = 'task'
    id = db.Column(db.Integer, primary_key=True)
    assignee_id = db.Column(db.Integer, ForeignKey('employee.employee_id'))
    status = db.Column(db.String(50))
    description = db.Column(db.Text)
    type = db.Column(db.String(50))
    due_date = db.Column(db.Date)

    # Relationships
    assignee = relationship('Employee', back_populates='tasks')

    def to_dict(self):
        return {
            "id": self.id,
            "assignee_id": self.assignee_id,
            "status": self.status,
            "description": self.description,
            "type": self.type,
            "due_date": self.due_date.isoformat() if self.due_date else None
        }
