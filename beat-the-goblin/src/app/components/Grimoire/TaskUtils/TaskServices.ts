import { Task } from '../Grimoire';

/*Fetches tasks from the server.*/
export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/tasks', { headers });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};


/*Adds a new task to the server.*/
export const addTask = async (newTask: Task): Promise<Task | null> => {
  try {
    const response = await fetch('/api/edition', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(newTask),
    });
    const data = await response.json();

    if (data.success) {
      return { ...newTask, id: data.taskId };
    } else {
      console.error('Failed to add task:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error adding task:', error);
    return null;
  }
};


/*Updates an existing task on the server.*/
export const updateTask = async (updatedTask: Task): Promise<boolean> => {
  try {
    const response = await fetch('/api/edition', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updatedTask),
    });
    const data = await response.json();

    if (data.success) {
      return true;
    } else {
      console.error('Failed to update task:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Error updating task:', error);
    return false;
  }
};


/*Deletes a task from the server.*/
export const deleteTask = async (taskId: number): Promise<boolean> => {
  try {
    const response = await fetch(`/api/delete?id=${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.success) {
      return true;
    } else {
      console.error('Failed to delete task:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
};


/*Updates the completion status of a task on the server. */
export const completeTask = async (taskId: number, completedAt: string | null): Promise<boolean> => {
  try {
    const response = await fetch('/api/complete-task', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ taskId, completedAt }),
    });
    const data = await response.json();

    if (data.success) {
      return true;
    } else {
      console.error('Failed to update task completion status:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Error updating task completion status:', error);
    return false;
  }
};


/*Reorders tasks on the server.*/
export const reorderTasks = async (taskIds: number[]): Promise<boolean> => {
  try {
    const response = await fetch('/api/reorder-tasks', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ taskIds }),
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error reordering tasks:', error);
    return false;
  }
};
