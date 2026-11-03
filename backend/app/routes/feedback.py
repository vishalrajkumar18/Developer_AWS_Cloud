from flask import Blueprint, request, jsonify
from ..models import db, Feedback, Complaint, User

feedback_bp = Blueprint('feedback', __name__, url_prefix='/api/feedback')

@feedback_bp.route('', methods=['POST'])
def submit_feedback():
    data = request.get_json() or {}
    tracking_id = data.get('complaint_id')
    rating = data.get('rating')
    comments = data.get('comments', '')
    citizen_email = data.get('email')

    if not tracking_id or not rating:
        return jsonify({'success': False, 'message': 'Complaint ID and rating are required.'}), 400

    complaint = Complaint.query.filter_by(tracking_id=tracking_id).first()
    if not complaint:
        return jsonify({'success': False, 'message': 'Complaint not found.'}), 404

    citizen = User.query.filter_by(email=citizen_email).first() if citizen_email else None

    # Check if already submitted
    existing = Feedback.query.filter_by(complaint_id=complaint.id).first()
    if existing:
        existing.rating = int(rating)
        existing.comments = comments
    else:
        new_feedback = Feedback(
            complaint_id=complaint.id,
            citizen_id=citizen.id if citizen else None,
            rating=int(rating),
            comments=comments
        )
        db.session.add(new_feedback)

    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Citizen feedback recorded successfully. Thank you for making our city better!'
    }), 201
