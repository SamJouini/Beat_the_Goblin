from flask import jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
import sqlite3
import logging

bp = Blueprint('reorder', __name__)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_db_connection():
    conn = sqlite3.connect('btgdatabase.db')
    conn.row_factory = sqlite3.Row
    return conn

@bp.route('/api/reorder-tasks', methods=['PUT'])
@jwt_required()
def reorder_tasks():
   current_user_id = get_jwt_identity()
   data = request.json
   task_ids = data.get('taskIds')

   if not task_ids:
       return jsonify({'success': False, 'message': 'Missing task IDs'}), 400

   with get_db_connection() as conn:
       cursor = conn.cursor()
       try:
           for index, task_id in enumerate(task_ids):
               cursor.execute("UPDATE Tasks SET `order` = ? WHERE id = ? AND user_id = ?",
                               (index, task_id, current_user_id))
           conn.commit()

           return jsonify({'success': True}),200 # Return success message.
       except sqlite3.Error as e:
           logger.error(f"Database error while reordering tasks: {e}")
           return jsonify({'success': False}),500 # Handle errors gracefully.