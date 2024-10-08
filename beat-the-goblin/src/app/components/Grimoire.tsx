import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TaskMenu from './TaskMenu';
import styles from './Grimoire.module.css';
import Image from 'next/image';

export interface Task {
  id?: number;
  title: string;
  xp?: number;
  created_at?: string;
  due_date?: string | null;
  completed_at?: string | null;
  difficulty?: boolean;
  length?: boolean;
  importance?: boolean;
  urgency?: boolean;
}

const TaskManager = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | undefined>(undefined);

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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTasks(data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    const newTask: Task = {
      title: "My new task",
    };

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
        setTasks([...tasks, { ...newTask, id: data.taskId }]);
      } else {
        console.error('Failed to add task:', data.message);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (updatedTask: Task) => {
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
        setTasks(prevTasks => prevTasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        ));
      } else {
        console.error('Failed to update task:', data.message);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async () => {
    if (selectedTaskId) {
      try {
        const response = await fetch(`/api/delete?id=${selectedTaskId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
  
        const data = await response.json();
  
        if (data.success) {
          setTasks(prevTasks => prevTasks.filter(task => task.id !== selectedTaskId));
          closeDialog();
        } else {
          console.error('Failed to delete task:', data.message);
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const openDialog = (taskId: number | undefined) => {
    setSelectedTaskId(taskId);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedTaskId(undefined);
  };

  const updateTaskProperties = (updatedProperties: Partial<Task>) => {
    if (selectedTaskId) {
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === selectedTaskId ? { ...task, ...updatedProperties } : task
      ));
      updateTask({ id: selectedTaskId, ...updatedProperties } as Task);
    }
  };

  return (
    <>
      <h2 className={styles.title}>
        Grimoire
        <Image
          src="/assets/todo/feather.png"
          alt="Add"
          width={30}
          height={30}
          className={`${styles.AddTaskButton} ${isLoggedIn ? styles.AddTaskButtonActive : ''}`}
          onClick={addTask}
        />
      </h2>

      <TaskList 
        isLoggedIn={isLoggedIn}
        tasks={tasks}
        setTasks={setTasks}
        onOpenDialog={openDialog}
        onUpdateTask={updateTask}
      />

      <TaskMenu
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onDelete={deleteTask}
        onUpdateTask={updateTaskProperties}
      />
    </>
  );
};

export default TaskManager;
