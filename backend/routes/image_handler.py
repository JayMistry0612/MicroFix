from flask import Blueprint, request, jsonify
from utils.gemini_utils import caption_image_with_gemini
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.history import RequestHistory
from app import db

image_bp = Blueprint('image', __name__)

@image_bp.route('/image-caption', methods=['POST'])
@jwt_required()
def image_caption():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    caption=request.form['caption_type']
    
    try:
        caption = caption_image_with_gemini(file,caption)
        # Save to history
        user_id = get_jwt_identity()
        history = RequestHistory(
            user_id=user_id,
            feature_type='image',
            original_input=file.filename,
            ai_response=caption,
            language=None
        )
        db.session.add(history)
        db.session.commit()
        return jsonify({'caption': caption})
    except Exception as e:
        return jsonify({'error': str(e)}), 500 