from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_mail import Message
from datetime import datetime
from app import db, mail
from models.user import User
from models.history import RequestHistory
from .utils import hash_password, check_password, generate_otp, otp_expired

auth_bp = Blueprint('auth', __name__)

# 1️⃣ Register user + send OTP
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({'error': 'Missing fields'}), 400
    if User.query.filter((User.username==username) | (User.email==email)).first():
        return jsonify({'error': 'User already exists'}), 409

    user = User(
        username=username,
        email=email,
        password_hash=hash_password(password),
        is_verified=False
    )

    # Generate OTP
    otp = generate_otp()
    user.otp = otp
    user.otp_created_at = datetime.utcnow()

    db.session.add(user)
    db.session.commit()

    # Send OTP email
    msg = Message(
        subject="Your OTP Verification Code",
        sender="your_email@gmail.com",
        recipients=[email]
    )
    msg.body = f"Hi {username}, your OTP is {otp}. It expires in 10 minutes."
    mail.send(msg)

    return jsonify({'message': 'Registered successfully. Check email for OTP.'}), 201


# 2️⃣ Verify OTP
@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    otp_input = data.get('otp')

    if not email or not otp_input:
        return jsonify({'error': 'Email and OTP required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if user.is_verified:
        return jsonify({'message': 'User already verified'}), 200

    if user.otp != otp_input or otp_expired(user.otp_created_at):
        return jsonify({'error': 'Invalid or expired OTP'}), 400

    user.is_verified = True
    user.otp = None
    user.otp_created_at = None
    db.session.commit()

    return jsonify({'message': 'Email verified successfully!'}), 200


# 3️⃣ Login (checks verification)
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()

    if not user or not check_password(password, user.password_hash):
        return jsonify({'error': 'Invalid credentials'}), 401

    if not user.is_verified:
        return jsonify({'error': 'Email not verified. Please verify your OTP.'}), 403

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'access_token': access_token,
        'user': {'id': user.id, 'username': user.username, 'email': user.email}
    })


# 4️⃣ Profile
@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    history = RequestHistory.query.filter_by(user_id=user_id).count()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'data': {'username': user.username, 'email': user.email, 'records': history}})


# 5️⃣ Delete account
@auth_bp.route('/delete-account', methods=['DELETE'])
@jwt_required()
def delete_account():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    RequestHistory.query.filter_by(user_id=user_id).delete()
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'Account deleted successfully'}), 200


# 6️⃣ Optional: Resend OTP
@auth_bp.route('/resend-otp', methods=['POST'])
def resend_otp():
    data = request.get_json()
    email = data.get('email')
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    if user.is_verified:
        return jsonify({'message': 'User already verified'}), 200

    otp = generate_otp()
    user.otp = otp
    user.otp_created_at = datetime.utcnow()
    db.session.commit()

    msg = Message(
        subject="Your OTP Verification Code",
        sender="your_email@gmail.com",
        recipients=[email]
    )
    msg.body = f"Hi {user.username}, your new OTP is {otp}. It expires in 10 minutes."
    mail.send(msg)

    return jsonify({'message': 'OTP resent successfully.'}), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Generate OTP for password reset
    otp = generate_otp()
    user.otp = otp
    user.otp_created_at = datetime.utcnow()
    db.session.commit()

    msg = Message(
        subject="Password Reset OTP",
        sender="your_email@gmail.com",
        recipients=[email]
    )
    msg.body = f"Hi {user.username}, your password reset OTP is {otp}. It expires in 10 minutes."
    mail.send(msg)

    return jsonify({'message': 'OTP sent to your email'}), 200


# 8️⃣ Reset Password using OTP
@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    otp_input = data.get('otp')
    new_password = data.get('newPassword')

    if not email or not otp_input or not new_password:
        return jsonify({'error': 'Email, OTP, and new password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if user.otp != otp_input or otp_expired(user.otp_created_at):
        return jsonify({'error': 'Invalid or expired OTP'}), 400

    user.password_hash = hash_password(new_password)
    user.otp = None
    user.otp_created_at = None
    db.session.commit()

    return jsonify({'message': 'Password reset successful! You can now login with your new password.'}), 200
