from flask import Flask, request, Response
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv
from flask_cors import CORS
from flask_login import LoginManager

# Load environment variables
load_dotenv()

# Initialize SQLAlchemy
db = SQLAlchemy()
login_manager = LoginManager()

@login_manager.user_loader
def load_user(user_id):
    from .models import Employee
    return Employee.query.get(user_id)

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)

    # Secret key used to secure session management
    app.secret_key = os.getenv('SECRET_KEY')

    # Setup for session cookies
    app.config.update(
        SESSION_COOKIE_SECURE=False,  # Required for HTTP in dev
        SESSION_COOKIE_DOMAIN="localhost",  # Required for domain matching
        SESSION_COOKIE_SAMESITE='Lax'  # CSRF protection
    )

    # Database configuration
    username = os.getenv("DB_USERNAME")
    password = os.getenv("DB_PASSWORD")
    host = os.getenv("DB_HOST")
    port = os.getenv("DB_PORT", "5432")
    dbname = os.getenv("DB_NAME")
    app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql+psycopg2://{username}:{password}@{host}:{port}/{dbname}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize Flask-Login with app
    login_manager.init_app(app)
   
    # Initialize SQLAlchemy with app
    db.init_app(app)

    # Register Blueprints (routes)
    from .employee_routes import employee_bp
    from .task_routes import task_bp
    from .workflow_routes import workflow_bp
    from .auth_routes import auth_bp
    app.register_blueprint(employee_bp)
    app.register_blueprint(task_bp)
    app.register_blueprint(workflow_bp)
    app.register_blueprint(auth_bp)

    return app
