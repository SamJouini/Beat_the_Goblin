from flask import jsonify, request, Blueprint
from werkzeug.security import check_password_hash
import sqlite3
import logging
from flask_jwt_extended import create_access_token, JWTManager
from datetime import timedelta

bp = Blueprint('login', __name__)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Setup JWT
jwt = JWTManager()

def get_db_connection():
    conn = sqlite3.connect('btgdatabase.db')
    conn.row_factory = sqlite3.Row
    return conn

@bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Input validation
    if not email or not password:
        return jsonify({'success': False, 'message': 'Missing email or password'}), 400

    with get_db_connection() as conn:
        cursor = conn.cursor()

        try:
            # Fetch email from database
            cursor.execute("SELECT * FROM Users WHERE email = ?", (email,))
            user = cursor.fetchone()

            if user is None:
                return jsonify({'success': False, 'message': 'Email not found'}), 404

            # Check password
            if check_password_hash(user['password_hash'], password):
                # Create access token
                expires = timedelta(hours=5)  # Set token to expire after 5 hours ?
                access_token = create_access_token(
                    identity=user['id'],
                    additional_claims={"username": user['username']},
                    expires_delta=expires
                )
                response = jsonify({
                    'success': True,
                    'message': 'Login successful',
                    'access_token': access_token,
                    'username': user['username'],
                    'expires_in': int(expires.total_seconds())  # Add expiration time in seconds
                })
                return response

            else:
                return jsonify({'success': False, 'message': 'Invalid password'}), 401

        except sqlite3.Error as e:
            logger.error(f"Database error during login: {e}")
            return jsonify({'success': False, 'message': 'An error occurred during login'}), 500
