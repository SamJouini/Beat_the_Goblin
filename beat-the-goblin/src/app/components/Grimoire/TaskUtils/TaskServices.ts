import { Task } from '../Grimoire';

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

