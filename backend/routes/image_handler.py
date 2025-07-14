from flask import Blueprint, request, jsonify
from utils.gemini_utils import caption_image_with_gemini

image_bp = Blueprint('image', __name__)

@image_bp.route('/image-caption', methods=['POST'])
def image_caption():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    try:
        caption = caption_image_with_gemini(file)
        return jsonify({'caption': caption})
    except Exception as e:
        return jsonify({'error': str(e)}), 500 