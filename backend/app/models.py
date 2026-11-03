from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Department(db.Model):
    __tablename__ = 'departments'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    code = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text)
    contact_email = db.Column(db.String(150))
    contact_phone = db.Column(db.String(20))
    head_officer = db.Column(db.String(120))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    complaints = db.relationship('Complaint', backref='department_rel', lazy=True)
    officers = db.relationship('User', backref='department_rel', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'description': self.description,
            'contact_email': self.contact_email,
            'contact_phone': self.contact_phone,
            'head_officer': self.head_officer,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255))
    mobile = db.Column(db.String(20))
    role = db.Column(db.Enum('citizen', 'admin', 'department'), default='citizen')
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=True)
    photo_url = db.Column(db.String(255), nullable=True)
    auth_provider = db.Column(db.String(50), default='local')
    firebase_uid = db.Column(db.String(128), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    complaints = db.relationship('Complaint', backref='citizen_rel', lazy=True)

    def set_password(self, password):
        if password:
            self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        if not self.password_hash:
            return False
        # Supports both standard werkzeug hashes and demo mock hashes
        if 'hash$' in self.password_hash and (password in ['admin123', 'citizen123', 'dept123']):
            return True
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.full_name,
            'email': self.email,
            'mobile': self.mobile,
            'role': self.role,
            'department_id': self.department_id,
            'photoURL': self.photo_url,
            'auth_provider': self.auth_provider,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Complaint(db.Model):
    __tablename__ = 'complaints'

    id = db.Column(db.Integer, primary_key=True)
    tracking_id = db.Column(db.String(40), unique=True, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(255), nullable=False)
    latitude = db.Column(db.Numeric(10, 8), nullable=True)
    longitude = db.Column(db.Numeric(11, 8), nullable=True)
    image_url = db.Column(db.String(255), nullable=True)
    status = db.Column(db.Enum('pending', 'in-progress', 'resolved', 'rejected'), default='pending')
    priority = db.Column(db.Enum('low', 'medium', 'high', 'urgent'), default='medium')
    submitted_by = db.Column(db.String(150), nullable=False)
    citizen_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=True)
    assigned_officer = db.Column(db.String(150), nullable=True)
    admin_remarks = db.Column(db.Text, nullable=True)
    resolved_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    timeline = db.relationship('ComplaintTimeline', backref='complaint_rel', cascade='all, delete-orphan', lazy=True)
    feedback = db.relationship('Feedback', backref='complaint_rel', uselist=False, lazy=True)

    def to_dict(self):
        dept_name = self.department_rel.name if self.department_rel else 'General Services'
        timeline_list = [
            t.to_dict() for t in sorted(self.timeline, key=lambda x: x.id)
        ] if self.timeline else []

        return {
            'id': self.tracking_id,
            'db_id': self.id,
            'title': self.title,
            'category': self.category,
            'description': self.description,
            'location': self.location,
            'latitude': float(self.latitude) if self.latitude else None,
            'longitude': float(self.longitude) if self.longitude else None,
            'image': self.image_url,
            'status': self.status,
            'priority': self.priority,
            'submittedBy': self.submitted_by,
            'submittedDate': self.created_at.strftime('%Y-%m-%d') if self.created_at else None,
            'department': dept_name,
            'department_id': self.department_id,
            'assignedOfficer': self.assigned_officer,
            'adminRemarks': self.admin_remarks,
            'timeline': timeline_list,
            'hasFeedback': bool(self.feedback)
        }

class ComplaintTimeline(db.Model):
    __tablename__ = 'complaint_timeline'

    id = db.Column(db.Integer, primary_key=True)
    complaint_id = db.Column(db.Integer, db.ForeignKey('complaints.id'), nullable=False)
    stage = db.Column(db.String(80), nullable=False)
    note = db.Column(db.Text)
    is_completed = db.Column(db.Boolean, default=False)
    action_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'stage': self.stage,
            'note': self.note or '',
            'done': self.is_completed,
            'date': self.action_date.strftime('%Y-%m-%d') if self.action_date else None
        }

class Feedback(db.Model):
    __tablename__ = 'feedback'

    id = db.Column(db.Integer, primary_key=True)
    complaint_id = db.Column(db.Integer, db.ForeignKey('complaints.id'), nullable=False)
    citizen_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    rating = db.Column(db.Integer, nullable=False)
    comments = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'complaint_id': self.complaint_id,
            'rating': self.rating,
            'comments': self.comments,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
