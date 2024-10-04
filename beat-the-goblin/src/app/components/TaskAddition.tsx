import React, { useState, useEffect } from 'react';
import styles from './TaskAddition.module.css';

const CreateTask = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (token) {
      setIsLoggedIn(true);
    } else {

      setIsLoggedIn(false);
    }
  }, []);

  const handleCreateTask = async () => {
    if (!isLoggedIn) {
      console.log('User is not logged in');
      return;
    }

    if (!newTaskTitle.trim()) {
      console.log('Task title cannot be empty');
      return;
    }

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title: newTaskTitle }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('New task created:', data);
        setNewTaskTitle('');
      } else {
        console.log('Failed to create task:', data.message);
      }
    } catch (error) {
      console.log('Error creating task:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isLoggedIn) {
      handleCreateTask();
    }
  };

  return (
    <div className={styles.CreateTask}>
      <input
        className={styles.taskInput}
        type="text"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isLoggedIn ? "Enter new task title and press Enter" : "Please log in to add tasks"}
        disabled={!isLoggedIn}
      />
    </div>
  );
};

export default CreateTask;
