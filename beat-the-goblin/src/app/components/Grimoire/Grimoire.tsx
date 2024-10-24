import React, { useState, useEffect, useMemo} from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import Image from 'next/image';
import * as taskService from './TaskUtils/TaskServices';
import { calculateXP, calculateCombatXP } from './TaskUtils/calculations'
import TaskList from './TaskList';
import TaskMenu from './TaskMenu';
import styles from './Grimoire.module.css';
import { debounce } from 'lodash';

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
  order?: number;
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
  const [isDragMode, setIsDragMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

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

  const toggleDragMode = () => {
    setIsDragMode(!isDragMode);
  };

  // Debounced reorder function
  const debouncedReorderTasks = debounce(async (newOrder: number[]) => {
    try {
      const success = await taskService.reorderTasks(newOrder);
      if (!success) {
        console.error('Failed to update task order in the backend');
        await fetchTasks();
      }
    } catch (error) {
      console.error('Error occurred while reordering tasks:', error);
      await fetchTasks();
    }
  }, 500);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      setTasks((prevTasks) => {
        const oldIndex = prevTasks.findIndex((task) => task.id === active.id);
        const newIndex = prevTasks.findIndex((task) => task.id === over.id);
        const newTasks = arrayMove(prevTasks, oldIndex, newIndex);
        
        // Get the new order of task IDs
        const newOrder = newTasks.map(task => task.id).filter((id): id is number => id !== undefined);
        debouncedReorderTasks(newOrder);
        
        return newTasks;
      });
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

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
          <TaskList 
            isLoggedIn={isLoggedIn}
            tasks={tasks}
            onOpenDialog={openDialog}
            onUpdateTask={updateTask}
            onCompleteTask={completeTask}
            isDragMode={isDragMode}
          />
      </DndContext>

      <TaskMenu
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onUpdateTask={(updatedProperties) => updateTaskProperties(updatedProperties)}
        onDelete={deleteTask}
        calculateXP={calculateXP}
        task={selectedTask}
      />

      {isLoggedIn && (
        <button 
          onClick={toggleDragMode}
          className={styles.dragModeButton}
        >
          {isDragMode ? 'Edit Tasks' : 'Reorder Tasks'}
        </button>
      )}
    </>
  );
};

export default TaskManager;