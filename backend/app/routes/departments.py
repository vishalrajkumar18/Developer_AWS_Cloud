from flask import Blueprint, jsonify
from ..models import db, Department, Complaint

departments_bp = Blueprint('departments', __name__, url_prefix='/api/departments')

@departments_bp.route('', methods=['GET'])
def get_departments():
    depts = Department.query.all()
    results = []

    for d in depts:
        total = Complaint.query.filter_by(department_id=d.id).count()
        resolved = Complaint.query.filter_by(department_id=d.id, status='resolved').count()
        pending = Complaint.query.filter_by(department_id=d.id, status='pending').count()
        in_progress = Complaint.query.filter_by(department_id=d.id, status='in-progress').count()
        rate = round((resolved / total * 100)) if total > 0 else 100

        item = d.to_dict()
        item['stats'] = {
            'assigned': total,
            'resolved': resolved,
            'pending': pending,
            'inProgress': in_progress,
            'resolutionRate': rate
        }
        results.append(item)

    return jsonify({
        'success': True,
        'departments': results
    }), 200
