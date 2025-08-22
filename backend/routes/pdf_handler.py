from flask import Blueprint, request, jsonify
from utils.pdf_utils import extract_text_from_pdf
from utils.gemini_utils import summarize_text_with_gemini, generate_pdf_followups
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
            # Store full extracted text so analytics (word reduction) uses correct counts
            original_input=text,
            ai_response=summary,
            language=None
        )
        db.session.add(history)
        db.session.commit()
        # Also return word counts for potential frontend display/debug
        return jsonify({
            'summary': summary,
            'original_word_count': len((text or '').split()),
            'summary_word_count': len((summary or '').split())
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pdf_bp.route('/pdf-followups', methods=['POST'])
@jwt_required()
def pdf_followups():
    try:
        data = request.get_json() or {}
        summary = data.get('summary')
        if not summary or not isinstance(summary, str):
            return jsonify({'error': 'Missing or invalid summary'}), 400
        result = generate_pdf_followups(summary)
        return jsonify({"questions": result.get("questions", [])})
    except Exception as e:
        return jsonify({'error': str(e)}), 500