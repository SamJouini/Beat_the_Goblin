from flask import jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
import sqlite3
import logging

bp = Blueprint('CRUD', __name__)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_db_connection():
    "Establishes and returns a connection to the SQLite database."
    conn = sqlite3.connect('btgdatabase.db')
    conn.row_factory = sqlite3.Row
    return conn

@bp.route('/api/tasks')
@jwt_required(optional=True)
def tasks_list():
    """
    Retrieves the list of tasks for a user.
    If the user is not logged in or has no tasks, returns hardcoded tasks.
    """
    current_user_id = get_jwt_identity() # Get the current user's ID from 

    # Hardcoded tasks to display when no user is logged in
    hardcoded_tasks = [
        {"id": 1, "title": "Click here to edit the tasks or on the feather to add one"},
        {"id": 2, "title": "Each completed task will give you xp"},
        {"id": 3, "title": "If they are important, urgent or even hard you will gain more xp"},
        {"id": 4, "title": "At the end of the deadline your xp will be compared to Bob's"},
    ]
    
    if current_user_id == None:
        return jsonify({'isLoggedIn': False, 'tasks': hardcoded_tasks})
    
    else:
        tasks = get_user_tasks (current_user_id)  # Fetch user's tasks from the database
        if len(tasks) == 0:
            for task in hardcoded_tasks:
                tasks.append(create_task(current_user_id, task['title']))
        
        return jsonify({'isLoggedIn': True, 'tasks': tasks})
        
def get_user_tasks (user_id):
    "Retrieves tasks for a user from the database."
    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            cursor.execute("""
                SELECT id, title, xp, created_at, due_date, completed_at, 
                    is_long, is_difficult, is_urgent, is_important, `order`, is_recurring
                FROM Tasks 
                WHERE user_id = ? 
                AND (due_date >= DATE('now') OR due_date IS NULL)
                AND (completed_at >= DATETIME('now', 'start of day') OR completed_at IS NULL)
                ORDER BY `order`
            """, (user_id,))

            # Convert rows into a list of dictionaries for easier JSON serialization
            rows = cursor.fetchall()
            return [{
                'id': row['id'],
                'title': row['title'],
                'xp': row['xp'],
                'created_at': row['created_at'],
                'due_date': row['due_date'],
                'completed_at': row['completed_at'],
                'length': row['is_long'],
                'difficulty': row['is_difficult'],
                'urgency': row['is_urgent'],
                'importance': row['is_important'],
                'order': row['order'],
                'recurrence': row['is_recurring']
            } for row in rows]

        except sqlite3.Error as e:
            logger.error(f"Database error while fetching tasks: {e}")
            raise e

def create_task(user_id, title):
    "Creates a new task for a user."
    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            # Set a default XP value for new tasks
            default_xp = 5

            cursor.execute("INSERT INTO Tasks (user_id, title, xp) VALUES (?, ?, ?) RETURNING id, title, created_at, xp",
                           (user_id, title, default_xp))
            
            row = cursor.fetchone()
            conn.commit()  # Commit the transaction

            return {
                'id': row[0],  # Access by index instead of key
                'title': row[1],
                'created_at': row[2],
                'xp': row[3]
            }
            
        except sqlite3.Error as e:
            logger.error(f"Database error while creating task: {e}")
            raise e
            
@bp.route('/api/edition', methods=['PUT'])
@jwt_required()
def task_edition():
    "Handles task update."
    current_user_id = get_jwt_identity()

    data = request.json
    task_id = data.get('id')
    new_title = data.get('title')
    new_xp = data.get('xp')
    new_due_date = data.get('due_date')
    new_completed_at = data.get('completed_at')
    new_is_long = data.get('length')
    new_is_difficult = data.get('difficulty')
    new_is_urgent = data.get('urgency')
    new_is_important = data.get('importance')
    new_is_recurring = data.get('recurrence')

    if task_id is None and new_title is None:
        return jsonify({'success': False, 'message': 'Missing id or title'}), 400
    
    if task_id is None:    # Create a new task if no ID is provided
        task = create_task(current_user_id, new_title)
        return jsonify({'success': True, 'message': 'Task updated successfully', 'taskId': task['id']}), 200

    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            update_fields = [] # List to hold SQL update fields
            update_values = [] # List to hold corresponding values
            
            # Build dynamic SQL update statement based on provided fields
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
            if new_is_recurring is not None:
                update_fields.append("is_recurring = ?")
                update_values.append(int(new_is_recurring))
            
            # Append task ID and user ID for the WHERE clause
            update_values.extend([task_id, current_user_id])
            
            cursor.execute(f"UPDATE Tasks SET {', '.join(update_fields)} WHERE id = ? AND user_id = ?",
                            (update_values))
            conn.commit()

            if cursor.rowcount == 0: # No rows updated means task not found or not owned by user
                return jsonify({'success': False, 'message': 'Task not found or not owned by user'}), 404

            return jsonify({'success': True, 'message': 'Task updated successfully'}), 200
        except sqlite3.Error as e:
            logger.error(f"Database error while updating task: {e}")
            return jsonify({'success': False, 'message': 'An error occurred while updating the task'}), 500


@bp.route('/api/delete', methods=['DELETE'])
@jwt_required()
def task_delete():
    "Handles task deletion."
    current_user_id = get_jwt_identity()
    
    task_id = request.args.get('id')
    
    if task_id is None:
        return jsonify({'success': False, 'message': 'Missing task id'}), 400

    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:            
            cursor.execute("DELETE FROM Tasks WHERE id = ? AND user_id = ?",
                            (task_id, current_user_id))
            
            conn.commit()

            if cursor.rowcount == 1: # Check if one row was deleted successfully
                return jsonify({'success': True, 'message': 'Task deleted successfully'}), 200
            else:
                return jsonify({'success': False, 'message': 'Failed to delete task'}), 500

        except sqlite3.Error as e:
            logger.error(f"Database error while deleting task: {e}")
            return jsonify({'success': False, 'message': 'An error occurred while deleting the task'}), 500
