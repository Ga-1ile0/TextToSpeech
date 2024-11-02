from flask import Flask, request, jsonify, Response
import os
from flask_cors import CORS
from TTS.utils.synthesizer import Synthesizer
from pathlib import Path, PureWindowsPath
import time
from pydub import AudioSegment

app = Flask(__name__)

CORS(app)

# Model paths
base_model_path = Path(PureWindowsPath(".\\models\\"))
config_path = base_model_path / "config.json"
output_path = Path(PureWindowsPath(".\\output\\"))
synthesizers = {}

@app.route('/synthesize', methods=['POST'])
def synthesize():
    data = request.get_json()
    text = data.get('text')
    voice = data.get('voice')

    if not text:
        return jsonify({'error': 'Text is required'}), 400

    model_file = base_model_path / f"{voice}.pth"

    if not os.path.exists(model_file):
        return jsonify({'error': 'Voice model does not exist'}), 400

    # Initialize synthesizer if not already loaded
    if voice not in synthesizers:
        synthesizers[voice] = Synthesizer(
            tts_config_path=config_path,
            tts_checkpoint=model_file,
            use_cuda=False  # Use CUDA if available and needed
        )

    # Synthesize the text to a WAV format
    wav = synthesizers[voice].tts(text)

    output_wav_filename = f"{int(time.time())}_{voice}.wav"
    output_wav_file = output_path / output_wav_filename
    synthesizers[voice].save_wav(wav, output_wav_file)

    # Convert the WAV file to MP3 with high quality
    output_mp3_filename = f"{int(time.time())}_{voice}.mp3"
    output_mp3_file = output_path / output_mp3_filename

    # Load the WAV file with pydub and export it as high-quality MP3
    sound = AudioSegment.from_wav(output_wav_file)
    
    # Export with higher bitrate for better quality
    sound.export(output_mp3_file, format="mp3", bitrate="320k")

    # Generator for streaming file
    def generate():
        with open(output_mp3_file, 'rb') as mp3_file:
            data = mp3_file.read(1024)
            while data:
                yield data
                data = mp3_file.read(1024)
        # Delete the files after streaming is done
        os.remove(output_wav_file)
        os.remove(output_mp3_file)

    # Return response as streaming file
    return Response(generate(), mimetype='audio/mpeg')

# No need for app.run() here, Gunicorn will take over in production.
