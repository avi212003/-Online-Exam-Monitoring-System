from flask import Flask, render_template, request, session, flash
import os
import re
import pandas as pd
import pickle

app = Flask(__name__)
app.secret_key = 'your_secret_key'

if (os.path.exists("face_images")==0):
    os.mkdir("face_images")

# Ensure the required files exist for storing user data
if not os.path.exists('known_face_names.txt'):
    known_face_names = []
    with open('known_face_names.txt', 'wb') as fp:
        pickle.dump(known_face_names, fp)
else:
    with open('known_face_names.txt', 'rb') as fp:
        known_face_names = pickle.load(fp)

# text file to store face encodings of the users
if os.path.exists('known_face_encodings.txt'):
    with open('known_face_encodings.txt','rb') as fp:
        known_face_encodings=pickle.load(fp)
else:
    known_face_encodings=[]


 # Using YOLOv5 model for object detection

# function to make face encodings

if not os.path.exists("candidates.csv"):
    candidates = pd.DataFrame(columns=['id', 'username', 'password', 'gender'])
    candidates.to_csv('candidates.csv', index=False)
else:
    candidates = pd.read_csv('candidates.csv')

@app.route("/", methods=["GET", "POST"])
def register():
    msg=""
    if (os.path.exists("candidates.csv")):    # CSV file to store the database
        candidates = pd.read_csv('candidates.csv')
    else:
        candidates = pd.DataFrame(columns = ['id', 'username', 'password', 'gender'])
    if request.method=="POST" :
        #Fetching data from registeration page
        files= request.files["filename"]
        username=request.form["Username"]
        password=request.form["psw"]
        gender= request.form["gender"]
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
            file_path = os.path.join("face_images",username+"."+files.filename.split('.')[1])
            files.save(file_path)
            
            with open('known_face_names.txt', 'wb') as fp:
                pickle.dump(known_face_names,fp)
            with open('known_face_encodings.txt', 'wb') as fp:
                pickle.dump(known_face_encodings,fp)
            new_row = {'id': candidates.shape[0] + 1,'username' : username, 'password' : password, 'gender' : gender}
            global index
            index = candidates.shape[0] + 1
            candidates = pd.concat([candidates, pd.DataFrame([new_row])], ignore_index=True)
            candidates.to_csv('candidates.csv', index=False)
            
            return render_template("dashboard.html", name=username, msg=msg)

        
    return render_template("register.html", msg=msg)


@app.route("/login", methods=["GET", "POST"])
def login():
    msg = ''
    candidates = pd.read_csv('candidates.csv')
    if request.method=="POST" and 'Username' in request.form and 'psw' in request.form:
         # fetching information from login page
        username= request.form["Username"]
        password=request.form["psw"]
        person = candidates[(candidates.username == username) & (candidates.password == password)].head(1)
        if person.shape[0] > 0:
            session['loggedin'] = True
            session['id'] = int(person['id'].values[0])
            global index
            index = int(person['id'].values[0])
            session['username'] = person['username'].values[0]
            return render_template("dashboard.html", name=username)
        else:
            msg = 'Incorrect username / password !'
            
    return render_template("login.html", msg=msg)

if __name__ == '__main__':
    app.run(debug=True)
