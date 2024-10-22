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
            deadline_str = result['deadline']
            if deadline_str == None:
                deadline_str = datetime.time(hour=20).isoformat(timespec="minutes")
            
            # here we have the default deadline for the user
            # add a bit more if the user has done a pomodoro
            cursor.execute("SELECT pomodoro, breath FROM Combat WHERE user_id = ? AND combat_date = ?", 
                           (current_user_id, datetime.date.today().isoformat()))
            result = cursor.fetchone()

            if result and result['pomodoro'] == 1:
                deadline = datetime.time.fromisoformat(deadline_str)
                edited_deadline = datetime.datetime.combine(datetime.date.today(), deadline) + datetime.timedelta(minutes = 30)
                deadline_str = (edited_deadline).time().isoformat(timespec="minutes")

            elif result and result ['breath'] == 1:
                deadline = datetime.time.fromisoformat(deadline_str)
                edited_deadline = datetime.datetime.combine(datetime.date.today(), deadline) + datetime.timedelta(minutes = 30)
                deadline_str = (edited_deadline).time().isoformat(timespec="minutes")
            
            return jsonify({'success': True, 'deadline': deadline_str}), 200
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
        cursor.execute("UPDATE Users SET deadline = ? WHERE id = ?", 
                       (new_deadline.isoformat(timespec="minutes"), current_user_id))
        conn.commit()
        if cursor.rowcount > 0:
            return jsonify({'success': True, 'message': 'Deadline updated successfully'}), 200
        return jsonify({'success': False, 'message': 'Failed to update deadline'}), 500


@bp.route('/api/pomodoro', methods=['PUT'])
@jwt_required()
def start_pomodoro():
    current_user_id = get_jwt_identity()
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE Combat SET pomodoro = ? WHERE user_id = ? AND combat_date = ?", 
                       (1, current_user_id, datetime.date.today().isoformat()))
        conn.commit()
        if cursor.rowcount < 1:
            cursor.execute("INSERT INTO Combat (pomodoro, user_id, combat_date) VALUES (1, ?, ?)", 
                       (current_user_id, datetime.date.today().isoformat()))
            conn.commit()
       
        return jsonify({"message": "Pomodoro started successfully"}), 200


@bp.route('/api/breath', methods=['PUT'])
@jwt_required()
def start_breath():
    current_user_id = get_jwt_identity()
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE Combat SET breath = ? WHERE user_id = ? AND combat_date = ?", 
                       (1, current_user_id, datetime.date.today().isoformat()))
        conn.commit()
        if cursor.rowcount < 1:
            cursor.execute("INSERT INTO Combat (breath, user_id, combat_date) VALUES (1, ?, ?)", 
                       (current_user_id, datetime.date.today().isoformat()))
            conn.commit()
       
        return jsonify({"message": "Exercice started successfully"}), 200
