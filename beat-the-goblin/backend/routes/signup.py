from flask import jsonify, request, Blueprint
from werkzeug.security import generate_password_hash
import sqlite3

bp = Blueprint('signup', __name__)

def get_db_connection():
    conn = sqlite3.connect('mydatabase.db')
    conn.row_factory = sqlite3.Row
    return conn

@bp.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Check if user already exists
        cursor.execute("SELECT * FROM Users WHERE username = ? OR email = ?", (username, email))
        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({'success': False, 'message': 'Username or email already exists'}), 400

        # Hash the password
        hashed_password = generate_password_hash(password)

        # Store the new user
        cursor.execute("INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)",
                       (username, email, hashed_password))
        conn.commit()

        return jsonify({'success': True, 'message': 'User registered successfully'}), 201

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return jsonify({'success': False, 'message': 'An error occurred during registration'}), 500

    finally:
        cursor.close()
        conn.close()