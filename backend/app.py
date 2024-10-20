# backend/app.py

from flask import Flask, request, jsonify, session, redirect, Response, url_for, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
import re
import pandas as pd
import pickle
import cv2
import torch
import face_recognition
import warnings
import torch.amp as amp
import bcrypt

app = Flask(__name__)
app.secret_key = 'your_secret_key'

app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
jwt = JWTManager(app)

# Enable CORS for all routes (you can restrict origins as needed)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Suppress specific FutureWarnings
warnings.filterwarnings("ignore", category=FutureWarning)

# Load YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
model.eval()  # Set the model to evaluation mode

# Use CUDA if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Ensure directories exist
if not os.path.exists("face_images"):
    os.mkdir("face_images")

# Load or initialize known faces
if not os.path.exists('known_face_names.txt'):
    known_face_names = []
    with open('known_face_names.txt', 'wb') as fp:
        pickle.dump(known_face_names, fp)
else:
    with open('known_face_names.txt', 'rb') as fp:
        known_face_names = pickle.load(fp)

if os.path.exists('known_face_encodings.txt'):
    with open('known_face_encodings.txt', 'rb') as fp:
        known_face_encodings = pickle.load(fp)
else:
    known_face_encodings = []

# Load or initialize candidates
if not os.path.exists("candidates.csv"):
    candidates = pd.DataFrame(columns=['id', 'username', 'password', 'gender'])
    candidates.to_csv('candidates.csv', index=False)
else:
    candidates = pd.read_csv('candidates.csv')

def detect_faces_wc(known_face_encodings, known_face_names, frame):
    rgb_small_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    face_locations = face_recognition.face_locations(rgb_small_frame)
    face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
    
    faces = []
    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        name = "Unknown"
        if True in matches:
            matched_idx = matches.index(True)
            name = known_face_names[matched_idx]
        faces.append((left, top, right, bottom, name))
    
    return faces

def generate_frames(model, known_face_encodings, known_face_names):
    camera = cv2.VideoCapture(0)
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            faces = detect_faces_wc(known_face_encodings, known_face_names, frame)
            for left, top, right, bottom, name in faces:
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
                cv2.putText(frame, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2)
            
            # Perform object detection
            with amp.autocast(device_type='cuda', dtype=torch.float16):
                results = model(frame)
            
            # Check for specific objects
            device_detected = False
            for det in results.xyxy[0]:
                if int(det[5]) in [67, 77]:  # 67 is 'cell phone', 77 is 'remote'
                    device_detected = True
                    break
            
            if device_detected:
                cv2.putText(frame, "Device detected", (20, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
            
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# API Route for Registration
@app.route("/api/register", methods=["POST"])
def register():
    msg = ""
    try:
        if os.path.exists("candidates.csv"):
            candidates = pd.read_csv('candidates.csv')
        else:
            candidates = pd.DataFrame(columns=['id', 'username', 'password', 'gender'])
        
        # Retrieve form data
        files = request.files.get("filename")
        username = request.form.get("Username")
        password = request.form.get("psw")
        gender = request.form.get("gender")
        
        # Validation
        if not username or not password or not gender or not files:
            msg = 'Please fill out the form!'
            return jsonify({"msg": msg}), 400
        
        if (candidates[candidates.username == username].shape[0] != 0):
            msg = 'Account already exists!'
            return jsonify({"msg": msg}), 400
        elif not re.match(r'^[A-Za-z0-9]+$', username):
            msg = 'Username must contain only characters and numbers!'
            return jsonify({"msg": msg}), 400
        else:
            # Save the uploaded image
            file_extension = files.filename.split('.')[-1]
            file_path = os.path.join("face_images", f"{username}.{file_extension}")
            files.save(file_path)
            
            # Create face encoding for the new user
            image = face_recognition.load_image_file(file_path)
            face_encodings = face_recognition.face_encodings(image)
            if face_encodings:
                face_encoding = face_encodings[0]
                known_face_encodings.append(face_encoding)
                known_face_names.append(username)
            else:
                msg = 'No face detected in the image!'
                return jsonify({"msg": msg}), 400
            
            # Update known faces
            with open('known_face_names.txt', 'wb') as fp:
                pickle.dump(known_face_names, fp)
            with open('known_face_encodings.txt', 'wb') as fp:
                pickle.dump(known_face_encodings, fp)
            
            # Add new user to candidates.csv
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            new_row = {'id': candidates.shape[0] + 1, 'username': username, 'password': hashed_password.decode('utf-8'), 'gender': gender}

            # new_row = {'id': candidates.shape[0] + 1, 'username': username, 'password': password, 'gender': gender}
            candidates = pd.concat([candidates, pd.DataFrame([new_row])], ignore_index=True)
            candidates.to_csv('candidates.csv', index=False)
            
            msg = "Registration successful!"
            return jsonify({"msg": msg}), 200
    except Exception as e:
        msg = f"An error occurred: {str(e)}"
        return jsonify({"msg": msg}), 500

# Modify /api/signin to return a JWT
@app.route("/api/signin", methods=["POST"])
def signin():
    try:
        candidates = pd.read_csv('candidates.csv') if os.path.exists('candidates.csv') else pd.DataFrame(columns=['id', 'username', 'password', 'gender'])
        
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({"msg": "Please provide both username and password"}), 400
        
        user = candidates[candidates.username == username].head(1)
        if not user.empty:
            stored_password = user['password'].values[0].encode('utf-8')
            if bcrypt.checkpw(password.encode('utf-8'), stored_password):
                access_token = create_access_token(identity=username)
                return jsonify({"msg": "Sign-in successful", "access_token": access_token}), 200
            else:
                return jsonify({"msg": "Invalid username or password"}), 401
        else:
            return jsonify({"msg": "Invalid username or password"}), 401
    except Exception as e:
        return jsonify({"msg": f"An error occurred: {str(e)}"}), 500

# Protect routes using JWT
@app.route("/api/dashboard", methods=["GET"])
@jwt_required()
def dashboard_api():
    current_user = get_jwt_identity()
    return jsonify({"msg": f"Welcome, {current_user}!"}), 200

# Protected API Route for Test Page
@app.route("/api/test", methods=["GET"])
@jwt_required()
def test():
    current_user = get_jwt_identity()
    return jsonify({"msg": f"Welcome to the test page, {current_user}!"}), 200

# Video Feed Route
@app.route("/api/video_feed")
def video_feed():
    return Response(generate_frames(model, known_face_encodings, known_face_names),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)
