import React, { useState, useEffect } from 'react';
import styles from './TaskEdition.module.css' 
import {Task} from './Grimoire'

const EditableList = ({isLoggedIn, tasks, setTasks}: any) => {
  const [editingId, setEditingId] = useState<number | undefined>();
  const [editValue, setEditValue] = useState<string>('');

  const handleEdit = (task: Task) => {
   if (isLoggedIn) {
      setEditingId(task.id);
      setEditValue(task.title);
    }
  };

  const handleSave = async (id: number | undefined) => {
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
        setTasks(tasks.map((task: Task) => 
          task.id === id ? { ...task, title: editValue } : task
        ));
        setEditingId(undefined);
      } else {
        console.error('Failed to update task:', data.message);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: number | undefined) => {
    if (e.key === 'Enter' && isLoggedIn) {
      handleSave(id);
    }
  };

  const handleBlur = (id: number | undefined) => {
  if (isLoggedIn) {
      handleSave(id);
    }
  };

  return (
    <div className={styles.EditableTasks}>
      <div>
        <ul>
          {tasks.map((task: Task) => (
            <li key={task.id}>
              {editingId === task.id && isLoggedIn ? (
                <input
                  className={styles.taskedit}
                  value={editValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, task.id)}
                  onBlur={() => handleBlur(task.id)}
                  autoFocus
                />
              ) : (
                <span onClick={() => handleEdit(task)}>
                  {task.title}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EditableList;
