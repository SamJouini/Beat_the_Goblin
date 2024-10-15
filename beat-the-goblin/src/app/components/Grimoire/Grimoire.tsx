import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TaskMenu from './TaskMenu';
import styles from './Grimoire.module.css';
import Image from 'next/image';

export interface Task {
  id?: number;
  title: string;
  xp: number;
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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const archiveCompletedTasks = () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(23, 59, 59, 999);

      setTasks(prevTasks => prevTasks.filter(task => {
        if (task.completed_at) {
          return new Date(task.completed_at) > yesterday;
        }
        return true;
      }));
    };

    const midnightTimeout = setTimeout(() => {
      archiveCompletedTasks();
      // Set up a daily interval to run at midnight
      setInterval(archiveCompletedTasks, 24 * 60 * 60 * 1000);
    }, new Date().setHours(24, 0, 0, 0) - Date.now());

    return () => clearTimeout(midnightTimeout);
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

    // Function to calculate XP for a task
    const calculateXP = (task: Task): number => {
      let xp = 5; // Base XP
      if (task.difficulty) xp += 2;
      if (task.length) xp += 1;
      if (task.urgency) xp += 1;
      if (task.importance) xp += 1;
      return xp;
    };

  const addTask = async () => {
    const newTask: Task = {
      title: "My new task",
      xp:5, // basic xp
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

  const updateTaskProperties = async (updatedProperties: Partial<Task>) => {
    if (selectedTaskId) {
      const taskToUpdate = tasks.find(task => task.id === selectedTaskId);
      if (!taskToUpdate) return;

      const updatedTask = { ...taskToUpdate, ...updatedProperties };
      const newXP = calculateXP(updatedTask);
      
      try {
        const response = await fetch('/api/edition', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ ...updatedTask, xp: newXP }),
        });
        const data = await response.json();

        if (data.success) {
          setTasks(prevTasks => prevTasks.map(task => 
            task.id === selectedTaskId ? { ...updatedTask, xp: newXP } : task
          ));
        } else {
          console.error('Failed to update task:', data.message);
        }
      } catch (error) {
        console.error('Error updating task:', error);
      }
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
 
  const completeTask = async (taskId: number) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;

      const completedAt = taskToUpdate.completed_at ? null : new Date().toISOString();
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
        setTasks(prevTasks => prevTasks.map(task => 
          task.id === taskId ? { ...task, completed_at: completedAt } : task
        ));
      } else {
        console.error('Failed to update task completion status:', data.message);
      }
    } catch (error) {
      console.error('Error updating task completion status:', error);
    }
  }

   const openDialog = (taskId: number | undefined) => {
    const task = tasks.find(t => t.id === taskId) || null;
    setIsDialogOpen(true);
    setSelectedTask(task);
    setSelectedTaskId(taskId)
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedTask(null);
    setSelectedTaskId(undefined)
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
        onOpenDialog={openDialog}
        onUpdateTask={updateTaskProperties}
        onCompleteTask={completeTask}
      />

      <TaskMenu
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onUpdateTask={updateTaskProperties}
        onDelete={deleteTask}
        calculateXP={calculateXP}
        task={selectedTask}
      />
    </>
  );
};

export default TaskManager;
