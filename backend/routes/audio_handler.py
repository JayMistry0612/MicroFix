from flask import Blueprint, request, jsonify
from utils.audio_utils.transcribe import transcribe_audio
from utils.gemini_utils import analyze_mood_with_gemini

audio_bp = Blueprint('audio', __name__)

@audio_bp.route('/audio-analysis', methods=['POST'])
def audio_analysis():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    try:
        transcript = transcribe_audio(file)
        mood = analyze_mood_with_gemini(transcript)
        return jsonify({'transcript': transcript, 'mood': mood})
    except Exception as e:
        return jsonify({'error': str(e)}), 500 