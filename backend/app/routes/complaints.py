import os
import random
from datetime import datetime, date
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from ..models import db, Complaint, ComplaintTimeline, Department, User

complaints_bp = Blueprint('complaints', __name__, url_prefix='/api/complaints')

CATEGORY_DEPARTMENT_MAP = {
    'Road Damage': 'Roads & Infrastructure',
    'Streetlight': 'Electrical Department',
    'Water Leakage': 'Water Supply Department',
    'Drainage': 'Sanitation Department',
    'Garbage Collection': 'Sanitation Department',
    'Traffic Signal': 'Traffic Control Department',
}

def generate_tracking_id():
    year = datetime.utcnow().year
    num = random.randint(1000, 9999)
    return f"CIV-{year}-{num}"

@complaints_bp.route('', methods=['GET'])
def get_complaints():
    status = request.args.get('status')
    department = request.args.get('department')
    priority = request.args.get('priority')
    search = request.args.get('search')
    citizen_email = request.args.get('citizen_email')

    query = Complaint.query

    if citizen_email:
        query = query.filter_by(submitted_by=citizen_email)

    if status and status != 'all':
        query = query.filter_by(status=status)

    if department and department != 'all':
        query = query.join(Department).filter(Department.name == department)

    if priority and priority != 'all':
        query = query.filter_by(priority=priority)

    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (Complaint.tracking_id.ilike(search_fmt)) |
            (Complaint.title.ilike(search_fmt)) |
            (Complaint.location.ilike(search_fmt)) |
            (Complaint.submitted_by.ilike(search_fmt))
        )

    complaints_list = query.order_by(Complaint.created_at.desc()).all()
    return jsonify({
        'success': True,
        'count': len(complaints_list),
        'complaints': [c.to_dict() for c in complaints_list]
    }), 200

@complaints_bp.route('/<identifier>', methods=['GET'])
def get_complaint_by_id(identifier):
    complaint = (
        Complaint.query.filter_by(tracking_id=identifier).first()
        or Complaint.query.get(identifier if identifier.isdigit() else 0)
    )

    if not complaint:
        return jsonify({'success': False, 'message': 'Complaint not found.'}), 404

    return jsonify({
        'success': True,
        'complaint': complaint.to_dict()
    }), 200

@complaints_bp.route('', methods=['POST'])
def create_complaint():
    # Supports JSON body or multipart form data (with image)
    if request.is_json:
        data = request.get_json() or {}
        image_url = data.get('image_url')
    else:
        data = request.form.to_dict()
        image_file = request.files.get('image')
        image_url = None
        if image_file and image_file.filename:
            filename = secure_filename(f"{int(datetime.utcnow().timestamp())}_{image_file.filename}")
            os.makedirs(current_app.config['UPLOAD_FOLDER'], exist_ok=True)
            image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            image_file.save(image_path)
            image_url = f"/api/complaints/uploads/{filename}"

    title = data.get('title', '').strip()
    category = data.get('category', 'Road Damage')
    description = data.get('description', '').strip()
    location = data.get('location', '').strip()
    priority = data.get('priority', 'medium')
    submitted_by = data.get('submittedBy') or data.get('submitted_by', 'citizen@example.com')
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    if not title or not description or not location:
        return jsonify({'success': False, 'message': 'Title, description, and location are required.'}), 400

    # Auto-resolve department
    target_dept_name = CATEGORY_DEPARTMENT_MAP.get(category, 'General Services')
    dept = Department.query.filter_by(name=target_dept_name).first()

    # Link citizen if registered
    citizen = User.query.filter_by(email=submitted_by).first()

    tracking_id = generate_tracking_id()
    while Complaint.query.filter_by(tracking_id=tracking_id).first():
        tracking_id = generate_tracking_id()

    today_date = date.today()

    new_complaint = Complaint(
        tracking_id=tracking_id,
        title=title,
        category=category,
        description=description,
        location=location,
        latitude=latitude if latitude else None,
        longitude=longitude if longitude else None,
        image_url=image_url,
        status='pending',
        priority=priority,
        submitted_by=submitted_by,
        citizen_id=citizen.id if citizen else None,
        department_id=dept.id if dept else None
    )

    db.session.add(new_complaint)
    db.session.flush()

    # Initialize default 4-stage civic timeline
    timelines = [
        ComplaintTimeline(complaint_id=new_complaint.id, stage='Submitted', note='Complaint registered successfully in CivicTrack portal', is_completed=True, action_date=today_date),
        ComplaintTimeline(complaint_id=new_complaint.id, stage='Assigned', note=f'Pending review by {target_dept_name}', is_completed=False, action_date=None),
        ComplaintTimeline(complaint_id=new_complaint.id, stage='In Progress', note='Field inspection not yet commenced', is_completed=False, action_date=None),
        ComplaintTimeline(complaint_id=new_complaint.id, stage='Resolved', note='Pending final verification and repair signoff', is_completed=False, action_date=None),
    ]

    db.session.add_all(timelines)
    db.session.commit()

    return jsonify({
        'success': True,
        'tracking_id': tracking_id,
        'id': tracking_id,
        'complaint': new_complaint.to_dict(),
        'message': 'Grievance submitted successfully.'
    }), 201

@complaints_bp.route('/<identifier>', methods=['PUT'])
def update_complaint(identifier):
    complaint = (
        Complaint.query.filter_by(tracking_id=identifier).first()
        or Complaint.query.get(identifier if identifier.isdigit() else 0)
    )

    if not complaint:
        return jsonify({'success': False, 'message': 'Complaint not found.'}), 404

    data = request.get_json() or {}
    new_status = data.get('status')
    department_name = data.get('department')
    assigned_officer = data.get('assignedOfficer')
    priority = data.get('priority')
    note = data.get('note') or data.get('adminRemarks')

    today_date = date.today()

    if department_name:
        dept = Department.query.filter_by(name=department_name).first()
        if dept:
            complaint.department_id = dept.id

    if assigned_officer is not None:
        complaint.assigned_officer = assigned_officer

    if priority:
        complaint.priority = priority

    if note:
        complaint.admin_remarks = note

    if new_status and new_status != complaint.status:
        complaint.status = new_status

        # Synchronize timeline
        if new_status == 'in-progress':
            for t in complaint.timeline:
                if t.stage in ['Submitted', 'Assigned']:
                    t.is_completed = True
                    if not t.action_date:
                        t.action_date = today_date
                if t.stage == 'In Progress':
                    t.is_completed = True
                    t.action_date = today_date
                    t.note = note or 'Field inspection and repair operation initiated'

        elif new_status == 'resolved':
            complaint.resolved_at = datetime.utcnow()
            for t in complaint.timeline:
                t.is_completed = True
                if not t.action_date:
                    t.action_date = today_date
                if t.stage == 'Resolved':
                    t.note = note or 'Grievance verified and completed by municipal crew'

        elif new_status == 'rejected':
            # Add or update Rejected stage
            rej = next((t for t in complaint.timeline if t.stage == 'Rejected'), None)
            if not rej:
                rej = ComplaintTimeline(complaint_id=complaint.id, stage='Rejected', note=note or 'Grievance rejected upon administrative review', is_completed=True, action_date=today_date)
                db.session.add(rej)
            else:
                rej.is_completed = True
                rej.action_date = today_date
                rej.note = note or rej.note

    db.session.commit()

    return jsonify({
        'success': True,
        'message': f'Complaint {complaint.tracking_id} updated successfully.',
        'complaint': complaint.to_dict()
    }), 200

@complaints_bp.route('/uploads/<filename>', methods=['GET'])
def uploaded_file(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)
