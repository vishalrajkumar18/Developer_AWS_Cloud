import jwt
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, current_app
from ..models import db, User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def generate_token(user):
    payload = {
        'user_id': user.id,
        'email': user.email,
        'role': user.role,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    mobile = data.get('mobile', '').strip()

    if not name or not email or not password:
        return jsonify({'success': False, 'message': 'Name, email and password are required.'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'message': 'An account with this email address already exists.'}), 409

    new_user = User(
        full_name=name,
        email=email,
        mobile=mobile,
        role='citizen',
        auth_provider='local'
    )
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    token = generate_token(new_user)
    return jsonify({
        'success': True,
        'token': token,
        'user': new_user.to_dict(),
        'message': 'Account registered successfully.'
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'success': False, 'message': 'Email and password are required.'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'success': False, 'message': 'Invalid email address or password.'}), 401

    if not user.is_active:
        return jsonify({'success': False, 'message': 'This account has been disabled.'}), 403

    token = generate_token(user)
    return jsonify({
        'success': True,
        'token': token,
        'role': user.role,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/google-login', methods=['POST'])
def google_login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    name = data.get('name', '').strip() or 'Citizen User'
    photo_url = data.get('photoURL')
    uid = data.get('uid')

    if not email:
        return jsonify({'success': False, 'message': 'Email is required from Google Auth.'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(
            full_name=name,
            email=email,
            photo_url=photo_url,
            firebase_uid=uid,
            role='citizen',
            auth_provider='google'
        )
        db.session.add(user)
    else:
        if photo_url and not user.photo_url:
            user.photo_url = photo_url
        if uid and not user.firebase_uid:
            user.firebase_uid = uid

    db.session.commit()
    token = generate_token(user)

    return jsonify({
        'success': True,
        'token': token,
        'role': user.role,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return jsonify({'success': False, 'message': 'Token missing'}), 401

    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        user = User.query.get(payload['user_id'])
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        return jsonify({'success': True, 'user': user.to_dict()}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'success': False, 'message': 'Session expired'}), 401
    except Exception as e:
        return jsonify({'success': False, 'message': 'Invalid token'}), 401
