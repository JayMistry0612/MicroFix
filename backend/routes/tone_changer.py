from flask import Blueprint, request, jsonify
from utils.gemini_utils import rewrite_text_with_tone

tone_bp = Blueprint('tone', __name__)

@tone_bp.route('/tone-changer', methods=['POST'])
def tone_changer():
    data = request.get_json()
    text = data.get('text')
    tone = data.get('tone')
    if not text or not tone:
        return jsonify({'error': 'Missing text or tone'}), 400
    try:
        rewritten = rewrite_text_with_tone(text, tone)
        return jsonify({'rewritten': rewritten})
    except Exception as e:
        return jsonify({'error': str(e)}), 500 