from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.history import RequestHistory
from models.user import User
from app import db

history_bp = Blueprint('history', __name__)

@history_bp.route('/history/<feature>', methods=['GET'])
@jwt_required()
def get_history(feature):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    history = RequestHistory.query.filter_by(user_id=user_id, feature_type=feature).order_by(RequestHistory.created_at.desc()).all()
    results = [
        {
            'id': h.id,
            'feature_type': h.feature_type,
            'original_input': h.original_input,
            'ai_response': h.ai_response,
            'language': h.language,
            'created_at': h.created_at.isoformat()
        }
        for h in history
    ]
    return jsonify({'history': results}) 