from flask import jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from routes.tasks_CRUD import create_task
import sqlite3
import logging

bp = Blueprint('completed', __name__)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_db_connection():
    "Establishes and returns a connection to the SQLite database."
    conn = sqlite3.connect('btgdatabase.db')
    conn.row_factory = sqlite3.Row
    return conn

@bp.route('/api/complete-task', methods=['PUT'])
@jwt_required()
def complete_task():
    """
    Handles task completion or un-completion using JSON data with 'taskId' and 'completedAt' as fields.
    If the task is recurring and completed, it creates a clone for the next occurrence.
    """
    current_user_id = get_jwt_identity()
    data = request.json
    task_id = data.get('taskId')
    completed_at = data.get('completedAt')

    if task_id is None:
        return jsonify({'success': False, 'message': 'Missing taskId'}), 400

    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
               # Update the task's completed_at status
            cursor.execute("UPDATE Tasks SET completed_at = ? WHERE id = ? AND user_id = ?",
                           (completed_at, task_id, current_user_id))
            
            if cursor.rowcount == 1:
                if completed_at is not None:
                    # Check if the task is recurring
                    cursor.execute("SELECT * FROM Tasks WHERE id = ? AND user_id = ?", (task_id, current_user_id))
                    task = cursor.fetchone()

                    if task['is_recurring']:
                        # Clone the task for the next day
                        clone_recurring_task(task)
                conn.commit()

                action = "uncompleted" if completed_at is None else "completed"
                return jsonify({'success': True, 'message': f'Task {action} successfully'}), 200
            
            else:
                return jsonify({'success': False, 'message': 'Task not found or not owned by user'}), 500

        except sqlite3.Error as e:
            logger.error(f"Database error while updating task completion status: {e}")
            return jsonify({'success': False, 'message': 'An error occurred while updating the task'}), 500

def clone_recurring_task(task):
    try:
        # Create a new task with just the user_id and title
        new_task = create_task(task['user_id'], task['title'])
        
        # Update the new task with additional attributes
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE Tasks SET xp = ?, is_long = ?, is_difficult = ?, is_urgent = ?, is_important = ?, is_recurring = 1
                WHERE id = ?
            """, (
                task['xp'],
                task['is_long'],
                task['is_difficult'],
                task['is_urgent'],
                task['is_important'],
                new_task['id']
            ))
            conn.commit()
        
        logger.info(f"Cloned recurring task: {new_task['id']}")
        return new_task
    
    except sqlite3.Error as e:
        logger.error(f"Error cloning recurring task: {e}")
        raise e
