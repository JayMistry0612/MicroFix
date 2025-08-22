import os
import google.generativeai as genai
from PIL import Image
import io
import json

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def summarize_text_with_gemini(text):
    if not GEMINI_API_KEY:
        return "Gemini API key not set."
    model = genai.GenerativeModel("gemini-1.5-pro")
    prompt = (
        "Summarize the following document in clear, concise language:\n\n"
        f"{text}"
    )
    response = model.generate_content(prompt)
    return response.text if hasattr(response, 'text') else str(response)

def caption_image_with_gemini(file):
    if not GEMINI_API_KEY:
        return "Gemini API key not set."
    model = genai.GenerativeModel("gemini-1.5-pro")
    # Read image file into PIL Image
    try:
        image = Image.open(file.stream if hasattr(file, 'stream') else file)
    except Exception:
        file.seek(0)
        image = Image.open(io.BytesIO(file.read()))
    prompt = "Describe the contents of this image in one sentence."
    response = model.generate_content([prompt, image])
    return response.text if hasattr(response, 'text') else str(response)

def analyze_mood_with_gemini(text):
    if not GEMINI_API_KEY:
        return "Gemini API key not set."
    model = genai.GenerativeModel("gemini-1.5-pro")
    prompt = (
        "Analyze the following transcript and return the overall mood or sentiment (e.g., happy, sad, angry, neutral, excited, etc.):\n\n"
        f"{text}"
    )
    response = model.generate_content(prompt)
    return response.text if hasattr(response, 'text') else str(response)

def rewrite_text_with_tone(text, tone):
    if not GEMINI_API_KEY:
        return "Gemini API key not set."
    model = genai.GenerativeModel("gemini-1.5-pro")
    prompt = (
        f"Rewrite the following text in a {tone} tone:\n\n{text}"
    )
    response = model.generate_content(prompt)
    return response.text if hasattr(response, 'text') else str(response) 

def generate_pdf_followups(summary_text):
    if not GEMINI_API_KEY:
        return {
            "questions": [
                "What are the key assumptions behind the main argument?",
                "How could these findings be applied in a real-world scenario?",
                "What are potential limitations or counterarguments?",
                "What further data would strengthen the conclusions?",
                "Which sections need deeper exploration or examples?"
            ]
        }

    model = genai.GenerativeModel("gemini-1.5-pro")
    prompt = (
        "You are assisting with study and research follow-ups. Given the following PDF summary, "
        "create 5 concise, high-quality follow-up questions a reader could ask next.\n"
        "Respond strictly as JSON array of strings (no numbering, no extra keys, no prose outside JSON).\n\n"
        f"SUMMARY:\n{summary_text}\n\n"
        "Return only a JSON array of strings."
    )
    response = model.generate_content(prompt)
    text = response.text if hasattr(response, 'text') else str(response)
    # Try strict JSON array parse first
    try:
        data = json.loads(text)
        if isinstance(data, list):
            questions = [q for q in data if isinstance(q, str)]
            return {"questions": questions[:5]}
        if isinstance(data, dict) and "questions" in data and isinstance(data["questions"], list):
            questions = [q for q in data["questions"] if isinstance(q, str)]
            return {"questions": questions[:5]}
    except Exception:
        pass

    # Fallback: extract lines that look like questions
    raw_lines = [l.strip() for l in text.splitlines() if l.strip()]
    cleaned = []
    for l in raw_lines:
        # Strip common bullets/numbering
        l2 = l.lstrip("-•* ")
        if l2 and (l2.endswith("?") or len(l2.split()) >= 4):
            cleaned.append(l2)
    if not cleaned:
        cleaned = raw_lines
    return {"questions": cleaned[:5]}