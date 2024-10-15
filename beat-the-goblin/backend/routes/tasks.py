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

@bp.route('/api/tasks')
@jwt_required(optional=True)
def tasks_list():
    current_user_id = get_jwt_identity()

    hardcoded_tasks = [
        {"id": 1, "title": "Click here to edit the tasks"},
        {"id": 2, "title": "Each finished task will give you xp"},
        {"id": 3, "title": "If they are important, urgent or even hard you will gain more xp"},
        {"id": 4, "title": "At the end of the deadline your xp will be compared to Bob's"},
    ]
    
    if current_user_id == None:
        return jsonify({'isLoggedIn': False, 'tasks': hardcoded_tasks})
    
    else:
        tasks = get_user_tasks (current_user_id)  
        if len(tasks) == 0:
            for task in hardcoded_tasks:
                tasks.append(create_task(current_user_id, task['title']))
        
        return jsonify({'isLoggedIn': True, 'tasks': tasks})
        
def get_user_tasks (user_id):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            cursor.execute("""
                SELECT id, title, xp, created_at, due_date, completed_at, 
                           is_long, is_difficult, is_urgent, is_important
                FROM Tasks 
                WHERE user_id = ?
            """, (user_id,))

            rows = cursor.fetchall()
            return [{
                'id': row['id'],
                'title': row['title'],
                'xp': row['xp'],
                'created_at': row['created_at'],
                'due_date': row['due_date'],
                'completed_at': row['completed_at'],
                'is_long': row['is_long'],
                'is_difficult': row['is_difficult'],
                'is_urgent': row['is_urgent'],
                'is_important': row['is_important']
            } for row in rows]

        except sqlite3.Error as e:
            logger.error(f"Database error while fetching tasks: {e}")
            raise e

def create_task(user_id, title):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            cursor.execute('INSERT INTO Tasks (user_id, title) VALUES (?, ?)'
            ' RETURNING id, title, created_at',
            (user_id, title))
            
            row = cursor.fetchone()
            return {
                'id': row['id'],
                'title': row['title'],
                'created_at': row['created_at'],
                'xp': row['xp']
            }
            
        except sqlite3.Error as e:
            logger.error(f"Database error while fetching tasks: {e}")
            raise e
            
@bp.route('/api/edition', methods=['PUT'])
@jwt_required()
def task_edition():
    current_user_id = get_jwt_identity()

    data = request.json
    task_id = data.get('id')
    new_title = data.get('title')
    new_xp = data.get('xp')
    new_due_date = data.get('due_date')
    new_completed_at = data.get('completed_at')
    new_is_long = data.get('is_long')
    new_is_difficult = data.get('is_difficult')
    new_is_urgent = data.get('is_urgent')
    new_is_important = data.get('is_important')

    if task_id is None and new_title is None:
        return jsonify({'success': False, 'message': 'Missing id or title'}), 400
    
    if task_id is None:
        create_task(current_user_id, new_title)
        return jsonify({'success': True, 'message': 'Task updated successfully'}), 200

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
            if new_completed_at is not None:
                update_fields.append("completed_at = ?")
                update_values.append(new_completed_at)
            if new_is_long is not None:
                update_fields.append("is_long = ?")
                update_values.append(int(new_is_long))
            if new_is_difficult is not None:
                update_fields.append("is_difficult = ?")
                update_values.append(int(new_is_difficult))
            if new_is_urgent is not None:
                update_fields.append("is_urgent = ?")
                update_values.append(int(new_is_urgent))
            if new_is_important is not None:
                update_fields.append("is_important = ?")
                update_values.append(int(new_is_important))
            
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


@bp.route('/api/delete', methods=['DELETE'])
@jwt_required()
def task_delete():
    current_user_id = get_jwt_identity()
    
    task_id = request.args.get('id')
    
    if task_id is None:
        return jsonify({'success': False, 'message': 'Missing task id'}), 400

    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:            
            cursor.execute("""
                DELETE FROM Tasks 
                WHERE id = ? AND user_id = ?
            """, (task_id, current_user_id))
            
            conn.commit()

            if cursor.rowcount == 1:
                return jsonify({'success': True, 'message': 'Task deleted successfully'}), 200
            else:
                return jsonify({'success': False, 'message': 'Failed to delete task'}), 500

        except sqlite3.Error as e:
            logger.error(f"Database error while deleting task: {e}")
            return jsonify({'success': False, 'message': 'An error occurred while deleting the task'}), 500


@bp.route('/api/complete-task', methods=['PUT'])
@jwt_required()
def complete_task():
    current_user_id = get_jwt_identity()
    data = request.json
    task_id = data.get('taskId')
    completed_at = data.get('completedAt')

    if task_id is None:
        return jsonify({'success': False, 'message': 'Missing taskId'}), 400

    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            if completed_at is None:
                # Reverse completion (set completed_at to NULL)
                cursor.execute("""
                    UPDATE Tasks 
                    SET completed_at = NULL
                    WHERE id = ? AND user_id = ?
                """, (task_id, current_user_id))
            else:
                # Complete task
                cursor.execute("""
                    UPDATE Tasks 
                    SET completed_at = ?
                    WHERE id = ? AND user_id = ?
                """, (completed_at, task_id, current_user_id))
            
            conn.commit()

            if cursor.rowcount == 1:
                action = "uncompleted" if completed_at is None else "completed"
                return jsonify({'success': True, 'message': f'Task {action} successfully'}), 200
            else:
                return jsonify({'success': False, 'message': 'Task not found or not owned by user'}), 404

        except sqlite3.Error as e:
            logger.error(f"Database error while updating task completion status: {e}")
            return jsonify({'success': False, 'message': 'An error occurred while updating the task'}), 500
