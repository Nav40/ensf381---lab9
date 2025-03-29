from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  


users = {
    "alice": "password123",
    "bob": "secure456",
    "charlie": "qwerty789",
    "diana": "hunter2",
    "eve": "passpass",
    "frank": "letmein",
    "grace": "trustno1",
    "heidi": "admin123",
    "ivan": "welcome1",
    "judy": "password1"
}


model_path = "./src/random_forest_model.pkl"


os.makedirs("./src", exist_ok=True)

@app.route('/validate_login', methods=['POST'])
def validate_login():
    data = request.json
    
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({
            "success": False,
            "message": "Username and password are required"
        }), 400
    
    username = data['username']
    password = data['password']
    
    
    if username in users and users[username] == password:
        return jsonify({
            "success": True,
            "message": f"Welcome, {username}!"
        })
    else:
        return jsonify({
            "success": False,
            "message": "Invalid username or password"
        }), 401

@app.route('/predict_house_price', methods=['POST'])
def predict_house_price():
    try:
 
        model = joblib.load(model_path)
        
        data = request.json
        

        cats = True if 'pets' in data and data['pets'] else False
        dogs = True if 'pets' in data and data['pets'] else False
        

        sample_data = [
            data['city'], 
            data['province'], 
            float(data['latitude']), 
            float(data['longitude']), 
            data['lease_term'], 
            data['type'], 
            float(data['beds']), 
            float(data['baths']), 
            float(data['sq_feet']), 
            data['furnishing'], 
            data['smoking'], 
            cats, 
            dogs
        ]
        
        sample_df = pd.DataFrame([sample_data], columns=[
            'city', 'province', 'latitude', 'longitude', 'lease_term', 
            'type', 'beds', 'baths', 'sq_feet', 'furnishing', 
            'smoking', 'cats', 'dogs'
        ])
        
        predicted_price = model.predict(sample_df)
        
        return jsonify({"predicted_price": float(predicted_price[0])})
    
    except FileNotFoundError:
        return jsonify({
            "success": False,
            "message": "Model file not found. Please place the model file at " + model_path
        }), 500
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error making prediction: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(debug=True)