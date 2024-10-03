import React, { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  xp?: number;
  created_at?: string;
  due_date?: string | null;
  priority?: string | null;
  completed_at?: string | null;
}

const EditableList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
  
      const response = await fetch('/api/tasks', { headers });

      
      const data = await response.json();
      setIsLoggedIn(data.isLoggedIn);
      setTasks(data.tasks);

    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleEdit = (id: number, currentTitle: string) => {
    setEditingId(id);
    setEditValue(currentTitle);
  };

  const handleSave = async (id: number) => {
    if (!isLoggedIn) {
      console.error('User is not logged in');
      return;
    }

    try {
      const response = await fetch('/api/edition', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          id: id,
          title: editValue,
        }),
      });
      const data = await response.json();

      if (data.success) {
        setTasks(tasks.map(task => 
          task.id === id ? { ...task, title: editValue } : task
        ));
        setEditingId(null);
      } else {
        console.error('Failed to update task:', data.message);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: number) => {
    if (e.key === 'Enter') {
      handleSave(id);
    }
  };

  const handleBlur = (id: number) => {
    handleSave(id);
  };

  return (
    <div>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {editingId === task.id ? (
              <input
                value={editValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, task.id)}
                onBlur={() => handleBlur(task.id)}
                autoFocus
              />
            ) : (
              <span onClick={() => handleEdit(task.id, task.title)}>
                {task.title}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditableList;
