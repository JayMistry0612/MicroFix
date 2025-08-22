from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.history import RequestHistory
from models.user import User

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/analytics', methods=['GET'])
@jwt_required()
def get_analytics():
    # Get current logged-in user
    user_identity = get_jwt_identity()
    try:
        user_id = int(user_identity)
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid user identity"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Word reduction from PDF summaries
    pdf_histories = RequestHistory.query.filter_by(user_id=user_id, feature_type='pdf').all()
    reduction_data = []
    for idx, h in enumerate(pdf_histories):
        original_text = (h.original_input or "").strip()
        ai_text = (h.ai_response or "").strip()
        original_count = len(original_text.split())
        summary_count = len(ai_text.split())
        if original_count:
            raw_pct = ((original_count - summary_count) / original_count) * 100.0
            # Clamp to [0, 100] to avoid negative or >100 values
            reduction = max(0, min(100, int(round(raw_pct))))
        else:
            reduction = 0
        reduction_data.append({
            "name": f"Doc {idx + 1}",
            "reduction": reduction
        })

    # Mood detection from audio analysis
    audio_histories = RequestHistory.query.filter_by(user_id=user_id, feature_type='audio').all()
    mood_counts = {}
    def classify_mood(text: str) -> str:
        t = (text or "").lower()
        if 'happy' in t or 'joy' in t or 'positive' in t:
            return 'Happy'
        if 'sad' in t or 'down' in t:
            return 'Sad'
        if 'angry' in t or 'anger' in t or 'mad' in t:
            return 'Angry'
        if 'calm' in t or 'relaxed' in t:
            return 'Calm'
        if 'excited' in t or 'energetic' in t:
            return 'Excited'
        if 'neutral' in t or 'mixed' in t:
            return 'Neutral'
        return 'Other'

    for h in audio_histories:
        mood_label = classify_mood(h.ai_response or "")
        mood_counts[mood_label] = mood_counts.get(mood_label, 0) + 1

    total_moods = sum(mood_counts.values()) or 1
    mood_detection = [{"mood": k, "value": int(v / total_moods * 100)} for k, v in mood_counts.items()]

    return jsonify({
        "reductionData": reduction_data, # pdf
        "moodDetection": mood_detection  # audio
    })
