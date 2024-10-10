from flask import jsonify, Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import logging
import sqlite3
import datetime

bp = Blueprint('deadline', __name__)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_db_connection():
    conn = sqlite3.connect('btgdatabase.db')
    conn.row_factory = sqlite3.Row
    return conn

@bp.route('/api/deadline', methods=['GET'])
@jwt_required()
def get_user_deadline():
    current_user_id = get_jwt_identity()

    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT deadline FROM Users WHERE id = ?", (current_user_id,))
        result = cursor.fetchone()
        if result:
            deadline = result['deadline']
            if deadline == None:
                deadline = datetime.time(hour=20).isoformat(timespec="minutes")
            return jsonify({'success': True, 'deadline': deadline}), 200
        return jsonify({'success': False, 'message': 'User not found'}), 404

@bp.route('/api/deadline', methods=['PUT'])
@jwt_required()
def update_user_deadline():
    current_user_id = get_jwt_identity()
    new_deadline = datetime.time.fromisoformat(request.json.get('deadline'))

    if new_deadline is None:
        return jsonify({'success': False, 'message': 'Invalid deadline'}), 400
        
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE Users SET deadline = ? WHERE id = ?", (new_deadline.isoformat(timespec="minutes"), current_user_id))
        conn.commit()
        if cursor.rowcount > 0:
            return jsonify({'success': True, 'message': 'Deadline updated successfully'}), 200
        return jsonify({'success': False, 'message': 'Failed to update deadline'}), 500
