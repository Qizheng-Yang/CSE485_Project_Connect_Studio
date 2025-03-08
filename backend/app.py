from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import os
import utils
from dotenv import load_dotenv

load_dotenv() # Load environment

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')  # Get from .env or default
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@app.route('/api/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:  # In a real app, check file type, size, etc.
        filename = utils.save_uploaded_file(file, UPLOAD_FOLDER) #save file
        return jsonify({'message': 'File uploaded successfully', 'filename': filename}), 200

    return jsonify({'error': 'File upload failed'}), 500


@app.route('/api/process', methods=['POST'])
def process_video():
    data = request.get_json()

    # --- Essential Data Validation ---
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    intro_text = data.get('introText')
    title = data.get('title')
    image_filename = data.get('imageFilename')
    step = data.get('step')  # Get the current step

    # Basic validation (add more as needed)
    if not intro_text or not title:
        return jsonify({'error': 'Missing required fields (introText, title)'}), 400
    if not image_filename:  # Check if an image has been uploaded
        return jsonify({'error': 'Missing imageFilename'}), 400

    # --- Simulate Video Processing ---
    #  In a real application, this is where you'd:
    #  1.  Use a library like MoviePy to combine images, text, and music.
    #  2.  Handle different steps (theme selection, effects, etc.).
    #  3.  Generate a preview or the final video.
    #  4.  Store the video file and return its URL.

    try:
        # Placeholder for video processing logic
        # result = utils.create_video(intro_text, title, image_filename) # example of calling utils
        processed_data = {
            'introText': intro_text,
            'title': title,
            'imageFilename': image_filename,
            'step': step + 1  # Move to the next step
        }
        return jsonify({'message': 'Data processed', 'data': processed_data}), 200
    except Exception as e:
        print(f"Error during processing: {e}")  # Log the error
        return jsonify({'error': 'Video processing failed', 'details': str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Run in debug mode on port 5000
