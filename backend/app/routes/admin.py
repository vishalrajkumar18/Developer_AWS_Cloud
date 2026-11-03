from flask import Blueprint, jsonify
from sqlalchemy import func
from ..models import db, Complaint, User, Department

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/overview', methods=['GET'])
def get_admin_overview():
    total_complaints = Complaint.query.count()
    pending = Complaint.query.filter_by(status='pending').count()
    in_progress = Complaint.query.filter_by(status='in-progress').count()
    resolved = Complaint.query.filter_by(status='resolved').count()
    rejected = Complaint.query.filter_by(status='rejected').count()
    total_users = User.query.count()

    # Category distribution
    categories = db.session.query(
        Complaint.category, func.count(Complaint.id)
    ).group_by(Complaint.category).all()

    category_data = [
        {'name': cat, 'value': count} for cat, count in categories
    ]

    return jsonify({
        'success': True,
        'stats': {
            'totalComplaints': total_complaints,
            'pending': pending,
            'inProgress': in_progress,
            'resolved': resolved,
            'rejected': rejected,
            'totalUsers': total_users,
            'resolutionRate': round((resolved / total_complaints * 100)) if total_complaints > 0 else 0
        },
        'categoryDistribution': category_data
    }), 200

@admin_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify({
        'success': True,
        'users': [u.to_dict() for u in users]
    }), 200
