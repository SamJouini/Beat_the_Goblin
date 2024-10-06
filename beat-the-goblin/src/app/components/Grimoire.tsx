import React, { useState, useEffect } from 'react';
import EditableList from './TaskEdition';
import styles from './Grimoire.module.css';
import Image from 'next/image';

export interface Task {
  id?: number;
  title: string;
  xp?: number;
  created_at?: string;
  due_date?: string | null;
  completed_at?: string | null;
}

const TaskManager = ({isLoggedIn}: any) => {
  const [tasks, setTasks] = useState<Task[]>([]);

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

      
      const data = await response.json();
      setTasks(data.tasks);

    } catch (error) {
      console.error('Error fetching tasks:', error);
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

        <div>
        <EditableList isLoggedIn= {isLoggedIn} tasks={tasks} setTasks={setTasks}/>
        </div>
        
        <Image
          src={"/assets/todo/cross.png"}
          alt='Delete'
          width={30}
          height={60}
          className={`${styles.DelTaskButton} ${isLoggedIn ? styles.DelTaskButtonActive : ''}`}
          /*onClick={handleDelTaskClick}*/
        />
    </>
  );
};

export default TaskManager;
