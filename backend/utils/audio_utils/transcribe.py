import tempfile
import whisper
import os


def transcribe_audio(file):
    # Load the Whisper model (small for speed, change as needed)
    model = whisper.load_model("small")

    # Create a temp file, close it, then use the name
    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
        temp_filename = temp_audio.name
        file.save(temp_filename)
    try:
        # Transcribe the audio file
        result = model.transcribe(temp_filename)
        return result.get('text', '')
    finally:
        os.remove(temp_filename) 