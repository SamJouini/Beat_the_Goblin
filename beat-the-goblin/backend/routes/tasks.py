from flask import jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
import sqlite3
import logging

bp = Blueprint('main', __name__)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_db_connection():
    conn = sqlite3.connect('btgdatabase.db')
    conn.row_factory = sqlite3.Row
    return conn

@bp.route('/api/tasks', methods=['GET', 'PUT'])
@jwt_required(optional=True)
def main_page():
    current_user_id = get_jwt_identity()

    if request.method == 'GET':
        tasks = []
        if current_user_id != None:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                try:
                    cursor.execute("""
                        SELECT id, title, xp, created_at, due_date, priority, completed_at 
                        FROM Tasks 
                        WHERE user_id = ?
                    """, (current_user_id,))
                    tasks = [{
                        'id': row['id'],
                        'title': row['title'],
                        'xp': row['xp'],
                        'created_at': row['created_at'],
                        'due_date': row['due_date'],
                        'priority': row['priority'],
                        'completed_at': row['completed_at']
                    } for row in cursor.fetchall()]
                except sqlite3.Error as e:
                    logger.error(f"Database error while fetching tasks: {e}")
                    return jsonify({'success': False, 'message': 'An error occurred while fetching tasks'}), 500
        
        return jsonify({
            'success': True,
            'isLoggedIn': current_user_id != None,
            'tasks': tasks
        }), 200

    elif request.method == 'PUT':
        if current_user_id == None:
            return jsonify({'success': False, 'message': 'Authentication required'}), 401
        
        data = request.json
        task_id = data.get('id')
        new_title = data.get('title')
        new_xp = data.get('xp')
        new_due_date = data.get('due_date')
        new_priority = data.get('priority')
        new_completed_at = data.get('completed_at')

        if task_id is None or new_title is None:
            return jsonify({'success': False, 'message': 'Missing id or title'}), 400

        with get_db_connection() as conn:
            cursor = conn.cursor()
            try:
                update_fields = []
                update_values = []
                
                if new_title is not None:
                    update_fields.append("title = ?")
                    update_values.append(new_title)
                if new_xp is not None:
                    update_fields.append("xp = ?")
                    update_values.append(new_xp)
                if new_due_date is not None:
                    update_fields.append("due_date = ?")
                    update_values.append(new_due_date)
                if new_priority is not None:
                    update_fields.append("priority = ?")
                    update_values.append(new_priority)
                if new_completed_at is not None:
                    update_fields.append("completed_at = ?")
                    update_values.append(new_completed_at)
                
                update_values.extend([task_id, current_user_id])
                
                query = f"""
                    UPDATE Tasks 
                    SET {', '.join(update_fields)}
                    WHERE id = ? AND user_id = ?
                """
                
                cursor.execute(query, update_values)
                conn.commit()

                if cursor.rowcount == 0:
                    return jsonify({'success': False, 'message': 'Task not found or not owned by user'}), 404

                return jsonify({'success': True, 'message': 'Task updated successfully'}), 200
            except sqlite3.Error as e:
                logger.error(f"Database error while updating task: {e}")
                return jsonify({'success': False, 'message': 'An error occurred while updating the task'}), 500

    return jsonify({'success': False, 'message': 'Method not allowed'}), 405
