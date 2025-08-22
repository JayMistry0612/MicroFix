from flask import Blueprint, request, jsonify
from models.user import User
from models.history import RequestHistory
from app import db
from flask_jwt_extended import create_access_token,jwt_required,get_jwt_identity
from .utils import hash_password, check_password

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    if not username or not email or not password:
        return jsonify({'error': 'Missing fields'}), 400
    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'error': 'User already exists'}), 409
    user = User(username=username, email=email, password_hash=hash_password(password))
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if not user or not check_password(password, user.password_hash):
        return jsonify({'error': 'Invalid credentials'}), 401
    access_token = create_access_token(identity=str(user.id))
    return jsonify({'access_token': access_token, 'user': {'id': user.id, 'username': user.username, 'email': user.email}}) 


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    history=RequestHistory.query.filter_by(user_id=user_id).all().count()    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({'data':{'username': user.username, 'email': user.email,'records':history}})

