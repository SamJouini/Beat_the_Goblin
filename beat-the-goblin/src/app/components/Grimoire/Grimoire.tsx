import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TaskMenu from './TaskMenu';
import styles from './Grimoire.module.css';
import Image from 'next/image';
import * as taskService from './TaskUtils/TaskServices';
import { calculateXP, calculateCombatXP } from './TaskUtils/calculations'

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

interface GrimoireProps {
  isLoggedIn: boolean;
  updateCombatXP: (userXP: number, goblinXP: number) => void;
  deadline: string;
}

const TaskManager = ({ isLoggedIn, updateCombatXP, deadline }: GrimoireProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | undefined>(undefined);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const fetchedTasks = await taskService.fetchTasks();
    setTasks(fetchedTasks);
  };

  useEffect(() => {
    const { userXP, goblinXP } = calculateCombatXP(tasks);
    updateCombatXP(userXP, goblinXP);
  }, [tasks, updateCombatXP]);

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

  const addTask = async () => {
    const newTask: Task = {
      title: "My new task",
      xp: 5, // basic xp
    };

    const addedTask = await taskService.addTask(newTask);
    if (addedTask) {
      setTasks([...tasks, addedTask]);
    }
  };

  const updateTask = async (updatedTask: Task) => {
    const success = await taskService.updateTask(updatedTask);
    if (success) {
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
    }
  };

  const updateTaskProperties = async (updatedProperties: Partial<Task>) => {
    if (selectedTaskId) {
      const taskToUpdate = tasks.find(task => task.id === selectedTaskId);
      if (!taskToUpdate) return;

      const updatedTask = {...taskToUpdate, ...updatedProperties};
      const newXP = calculateXP(updatedTask);
      
      const success = await taskService.updateTask({...updatedTask, xp: newXP});
      if (success) {
        setTasks(prevTasks => prevTasks.map(task => 
          task.id === selectedTaskId ? {...updatedTask, xp: newXP} : task
        ));
      }
    }
  };

  const deleteTask = async () => {
    if (selectedTaskId) {
      const success = await taskService.deleteTask(selectedTaskId);
      if (success) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== selectedTaskId));
        closeDialog();
      }
    }
  };
 
  const completeTask = async (taskId: number) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;

    const completedAt = taskToUpdate.completed_at ? null : new Date().toISOString();
    const success = await taskService.completeTask(taskId, completedAt);
    if (success) {
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === taskId ? {...task, completed_at: completedAt} : task
      ));
    }
  };

  const openDialog = (taskId: number | undefined) => {
    const task = tasks.find(t => t.id === taskId) || null;
    setIsDialogOpen(true);
    setSelectedTask(task);
    setSelectedTaskId(taskId);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedTask(null);
    setSelectedTaskId(undefined);
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
        onUpdateTask={updateTask}
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
