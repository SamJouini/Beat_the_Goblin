from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash

app = Flask(__name__)
CORS(app)

# This is a simple in-memory storage. In a real application, you'd use a database.
users = []

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    # Check if user already exists
    if any(user['username'] == username or user['email'] == email for user in users):
        return jsonify({'success': False, 'message': 'Username or email already exists'}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)

    # Store the new user
    users.append({
        'username': username,
        'email': email,
        'password': hashed_password
    })

    return jsonify({'success': True, 'message': 'User registered successfully'}), 201

if __name__ == '__main__':
    app.run(debug=True, port =5000)
