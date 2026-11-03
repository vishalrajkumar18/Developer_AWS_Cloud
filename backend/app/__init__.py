import os
from flask import Flask, jsonify
from flask_cors import CORS
from prometheus_flask_exporter import PrometheusMetrics
from .config import Config
from .models import db, Department, User, Complaint, ComplaintTimeline

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Extensions
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)

    # Initialize Prometheus Metrics Exporter (exposes /metrics)
    metrics = PrometheusMetrics(app, group_by='endpoint')
    metrics.info('app_info', 'CivicTrack Backend Application', version='1.0.0')

    # Register Blueprints
    from .routes.auth import auth_bp
    from .routes.complaints import complaints_bp
    from .routes.departments import departments_bp
    from .routes.admin import admin_bp
    from .routes.feedback import feedback_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(complaints_bp)
    app.register_blueprint(departments_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(feedback_bp)

    # System Health Check
    @app.route('/health', methods=['GET'])
    def health_check():
        db_status = 'healthy'
        try:
            db.session.execute(db.text('SELECT 1'))
        except Exception as e:
            db_status = f'degraded: {str(e)}'

        return jsonify({
            'status': 'UP' if 'healthy' in db_status else 'DEGRADED',
            'service': 'civictrack-backend',
            'database': db_status,
            'version': '1.0.0'
        }), 200

    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            'name': 'CivicTrack Public Grievance API',
            'version': '1.0.0',
            'documentation': '/api/complaints',
            'health': '/health',
            'metrics': '/metrics'
        })

    # Auto-initialize database tables and initial seeds on startup
    with app.app_context():
        try:
            db.create_all()
            seed_initial_data()
        except Exception as err:
            app.logger.warning(f"Database auto-migration note: {err}")

    return app

def seed_initial_data():
    """Ensure baseline departments and demo users exist even in SQLite / fresh container environments"""
    if Department.query.count() == 0:
        default_depts = [
            Department(name='Roads & Infrastructure', code='ROADS', description='Potholes, asphalt resurfacing, and sidewalks', contact_email='roads@civictrack.gov.in', head_officer='Rajesh Kumar'),
            Department(name='Electrical Department', code='ELEC', description='Streetlights and power distribution nodes', contact_email='elec@civictrack.gov.in', head_officer='Vikramaditya Rao'),
            Department(name='Water Supply Department', code='WATER', description='Municipal water pipeline leaks and valves', contact_email='water@civictrack.gov.in', head_officer='Priya Sharma'),
            Department(name='Sanitation Department', code='SANIT', description='Garbage collection and solid waste processing', contact_email='sanitation@civictrack.gov.in', head_officer='Suresh Patel'),
            Department(name='Traffic Control Department', code='TRAFFIC', description='Traffic signals and road junction management', contact_email='traffic@civictrack.gov.in', head_officer='Anand Singh'),
            Department(name='General Services', code='GEN', description='General public services and civic inquiries', contact_email='general@civictrack.gov.in', head_officer='Meera Deshmukh'),
        ]
        db.session.add_all(default_depts)
        db.session.commit()

    if User.query.count() == 0:
        admin = User(full_name='System Administrator', email='admin@civictrack.gov.in', mobile='9000000001', role='admin', auth_provider='local')
        admin.set_password('admin123')

        pwd = User(full_name='PWD Field Officer', email='pwd@civictrack.gov.in', mobile='9000000002', role='department', department_id=1, auth_provider='local')
        pwd.set_password('dept123')

        citizen = User(full_name='Rahul Verma', email='citizen@example.com', mobile='9876543210', role='citizen', auth_provider='local')
        citizen.set_password('citizen123')

        google_user = User(full_name='Visahl Rajkumar', email='visahl.rajkumar@gmail.com', mobile='9876543211', role='citizen', auth_provider='google', photo_url='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80')
        google_user.set_password('demo123')

        db.session.add_all([admin, pwd, citizen, google_user])
        db.session.commit()
