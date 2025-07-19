from flask import Blueprint, request, jsonify
from utils.gemini_utils import rewrite_text_with_tone
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.history import RequestHistory
from app import db

tone_bp = Blueprint('tone', __name__)

@tone_bp.route('/tone-changer', methods=['POST'])
@jwt_required()
def tone_changer():
    data = request.get_json()
    text = data.get('text')
    tone = data.get('tone')
    if not text or not tone:
        return jsonify({'error': 'Missing text or tone'}), 400
    try:
        rewritten = rewrite_text_with_tone(text, tone)
        # Save to history
        user_id = get_jwt_identity()
        history = RequestHistory(
            user_id=user_id,
            feature_type='tone',
            original_input=text,
            ai_response=rewritten,
            language=None
        )
        db.session.add(history)
        db.session.commit()
        return jsonify({'rewritten': rewritten})
    except Exception as e:
        return jsonify({'error': str(e)}), 500 