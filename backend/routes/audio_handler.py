from flask import Blueprint, request, jsonify
from utils.audio_utils.transcribe import transcribe_audio
from utils.gemini_utils import analyze_mood_with_gemini
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.history import RequestHistory
from app import db

audio_bp = Blueprint('audio', __name__)

@audio_bp.route('/audio-analysis', methods=['POST'])
@jwt_required()
def audio_analysis():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    try:
        transcript = transcribe_audio(file)
        mood = analyze_mood_with_gemini(transcript)
        # Save to history
        user_id = get_jwt_identity()
        history = RequestHistory(
            user_id=user_id,
            feature_type='audio',
            original_input=transcript,
            ai_response=mood,
            language=None
        )
        db.session.add(history)
        db.session.commit()
        return jsonify({'transcript': transcript, 'mood': mood})
    except Exception as e:
        return jsonify({'error': str(e)}), 500 