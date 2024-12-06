from flask import Flask, render_template, request, session, flash, Response, redirect, url_for
import os
import re
import pandas as pd
import pickle
import cv2
import torch
import face_recognition
import warnings
import torch.amp as amp

app = Flask(__name__)
app.secret_key = 'your_secret_key'

# Suppress the specific FutureWarning
warnings.filterwarnings("ignore", category=FutureWarning)

# Load YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
model.eval()  # Set the model to evaluation mode

# Use CUDA if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

if not os.path.exists("face_images"):
    os.mkdir("face_images")

# Ensure the required files exist for storing user data
if not os.path.exists('known_face_names.txt'):
    known_face_names = []
    with open('known_face_names.txt', 'wb') as fp:
        pickle.dump(known_face_names, fp)
else:
    with open('known_face_names.txt', 'rb') as fp:
        known_face_names = pickle.load(fp)

# Text file to store face encodings of the users
if os.path.exists('known_face_encodings.txt'):
    with open('known_face_encodings.txt', 'rb') as fp:
        known_face_encodings = pickle.load(fp)
else:
    known_face_encodings = []

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
            
            for det in results.xyxy[0]:
                if int(det[5]) in [67, 77]:  # 67 is 'cell phone', 77 is 'remote'
                    cv2.putText(frame, "Device detected", (20, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
                    break
            
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route("/", methods=["GET", "POST"])
def register():
    msg = ""
    if os.path.exists("candidates.csv"):
        candidates = pd.read_csv('candidates.csv')
    else:
        candidates = pd.DataFrame(columns=['id', 'username', 'password', 'gender'])
    if request.method == "POST":
        files = request.files["filename"]
        username = request.form["Username"]
        password = request.form["psw"]
        gender = request.form["gender"]
        if (candidates[candidates.username == username].shape[0] != 0):
            msg = 'Account already exists !'
            flash("Account already exists !")
        elif not re.match(r'[A-Za-z0-9]+', username):
            msg = 'Username must contain only characters and numbers !'
            flash(msg)
        elif not username or not password or not gender:
            msg = 'Please fill out the form !'
            flash(msg)
        else:
            known_face_names.append(username)
            file_path = os.path.join("face_images", username + "." + files.filename.split('.')[1])
            files.save(file_path)
            
            # Create face encoding for the new user
            image = face_recognition.load_image_file(file_path)
            face_encoding = face_recognition.face_encodings(image)[0]
            known_face_encodings.append(face_encoding)
            
            with open('known_face_names.txt', 'wb') as fp:
                pickle.dump(known_face_names, fp)
            with open('known_face_encodings.txt', 'wb') as fp:
                pickle.dump(known_face_encodings, fp)
            new_row = {'id': candidates.shape[0] + 1, 'username': username, 'password': password, 'gender': gender}
            candidates = pd.concat([candidates, pd.DataFrame([new_row])], ignore_index=True)
            candidates.to_csv('candidates.csv', index=False)
            
            return render_template("dashboard.html", name=username, msg=msg)
    
    return render_template("register.html", msg=msg)

@app.route("/login", methods=["GET", "POST"])
def login():
    msg = ''
    candidates = pd.read_csv('candidates.csv')
    if request.method == "POST" and 'Username' in request.form and 'psw' in request.form:
        username = request.form["Username"]
        password = request.form["psw"]
        person = candidates[(candidates.username == username) & (candidates.password == password)].head(1)
        if person.shape[0] > 0:
            session['loggedin'] = True
            session['id'] = int(person['id'].values[0])
            session['username'] = person['username'].values[0]
            return render_template("dashboard.html", name=username)
        else:
            msg = 'Incorrect username / password !'
    
    return render_template("login.html", msg=msg)

@app.route("/dashboard")
def dashboard():
    if 'loggedin' in session:
        return render_template("dashboard.html", name=session['username'])
    return redirect(url_for('login'))

@app.route("/student_profile", methods=["POST"])
def student_profile():
    if 'loggedin' in session:
        return redirect(url_for('test_page'))
    return redirect(url_for('login'))

@app.route("/test_page")
def test_page():
    if 'loggedin' in session:
        return render_template("test.html", name=session['username'])
    return redirect(url_for('login'))

@app.route("/video_feed")
def video_feed():
    return Response(generate_frames(model, known_face_encodings, known_face_names),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)

if __name__ == '__main__':
    app.run(debug=True)