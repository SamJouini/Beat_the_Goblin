import React, { useState } from 'react';
import Image from 'next/image';
import styles from './TaskList.module.css';
import { Task } from './Grimoire';

interface TaskListProps {
  isLoggedIn: boolean;
  tasks: Task[];
  onOpenDialog: (taskId: number | undefined) => void;
  onUpdateTask: (updatedTask: Task) => void;
  onCompleteTask: (taskId: number) => void;
}

const TaskList = ({ isLoggedIn, tasks, onOpenDialog, onUpdateTask, onCompleteTask }: TaskListProps) => {
  const [editingId, setEditingId] = useState<number | undefined>();
  const [editValue, setEditValue] = useState<string>('');

  const handleEdit = (task: Task) => {
    if (isLoggedIn) {
      setEditingId(task.id);
      setEditValue(task.title);
    }
  };

  const handleSave = async (id: number | undefined) => {
    if (!isLoggedIn || id === undefined) return;

    const updatedTask = tasks.find(task => task.id === id);
    if (updatedTask) {
      onUpdateTask({ ...updatedTask, title: editValue });
    }
    setEditingId(undefined);
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

  const handleComplete = (taskId: number | undefined) => {
    if (isLoggedIn && taskId !== undefined) {
      onCompleteTask(taskId);
    }
  };

  return (
    <div className={`${styles.EditableTasks} ${isLoggedIn ? styles.loggedIn : ''}`}>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={task.completed_at ? styles.completed : ''}>
            <button
              className={styles.bulletButton}
              onClick={() => handleComplete(task.id)}
              disabled={!isLoggedIn}
            >
              {task.completed_at ? '✓' : '\u261B'}
            </button>
            <div className={styles.taskContent}>
              {editingId === task.id && isLoggedIn ? (
                <input
                  className={styles.taskedit}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, task.id)}
                  onBlur={() => handleBlur(task.id)}
                  autoFocus
                />
              ) : (
                <span 
                  className={`${isLoggedIn ? styles.editable : ''} ${task.completed_at ? styles.strikethrough : ''}`}
                  onClick={() => handleEdit(task)}
                >
                  {task.title}
                </span>
              )}
            </div>
            {isLoggedIn && (
              <Image
                src="/assets/todo/Book.png"
                alt="Menu"
                width={15}
                height={15}
                className={styles.MenuIcon}
                onClick={() => onOpenDialog(task.id)}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
