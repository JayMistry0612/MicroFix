from flask import Blueprint, request, jsonify
from utils.pdf_utils import extract_text_from_pdf
from utils.gemini_utils import summarize_text_with_gemini
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.history import RequestHistory
from app import db

pdf_bp = Blueprint('pdf', __name__)

@pdf_bp.route('/pdf-summary', methods=['POST'])
@jwt_required()
def pdf_summary():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    try:
        text = extract_text_from_pdf(file)
        summary = summarize_text_with_gemini(text)
        # Save to history
        user_id = get_jwt_identity()
        history = RequestHistory(
            user_id=user_id,
            feature_type='pdf',
            original_input=text[:1000],  # limit to 1000 chars for storage
            ai_response=summary,
            language=None
        )
        db.session.add(history)
        db.session.commit()
        return jsonify({'summary': summary})
    except Exception as e:
        return jsonify({'error': str(e)}), 500 