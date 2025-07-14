from flask import Blueprint, request, jsonify
from utils.pdf_utils import extract_text_from_pdf
from utils.gemini_utils import summarize_text_with_gemini

pdf_bp = Blueprint('pdf', __name__)

@pdf_bp.route('/pdf-summary', methods=['POST'])
def pdf_summary():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    try:
        text = extract_text_from_pdf(file)
        summary = summarize_text_with_gemini(text)
        return jsonify({'summary': summary})
    except Exception as e:
        return jsonify({'error': str(e)}), 500 