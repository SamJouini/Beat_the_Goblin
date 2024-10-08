import React, { useState, useEffect } from 'react';
import EditableList from './TaskEdition';
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

const Grimoire = ({isLoggedIn}: any) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | undefined>(undefined);

  const addTask = () => {
    const task: Task = {
        title: "My new task",
    }

    setTasks([...tasks, task])
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

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

  const openDialog = (taskId: number | undefined) => {
    setSelectedTaskId(taskId);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedTaskId(undefined);
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
 

  const updateTaskProperties = (updatedProperties: Partial<Task>) => {
    if (selectedTaskId) {
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === selectedTaskId ? { ...task, ...updatedProperties } : task
      ));
    }
  };

  return (
    <>
        <h2 className={styles.title}>Grimoire
        <Image
            src="/assets/todo/feather.png"
            alt="Add"
            width={30}
            height={30}
            className={`${styles.AddTaskButton} ${isLoggedIn ? styles.AddTaskButtonActive : ''}`}
            onClick={addTask}
        />
        </h2>

        <EditableList 
        isLoggedIn= {isLoggedIn} 
        tasks={tasks} 
        setTasks={setTasks}
        onOpenDialog={openDialog}
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

export default Grimoire;
