import React, { useMemo } from 'react';
import styles from './TaskList.module.css';
import { Task } from './Grimoire';
import TaskItem from './TaskItem';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

/**
 * TaskList Component
 * 
 * Renders a list of tasks with sorting capabilities.
 */

interface TaskListProps {
  isLoggedIn: boolean;
  tasks: Task[];
  onOpenDialog: (taskId: number | undefined, clientY: number) => void;
  onUpdateTask: (updatedTask: Task) => void;
  onCompleteTask: (taskId: number) => void;
  isDragMode: boolean;
}

const TaskList = ({ isLoggedIn, tasks, onOpenDialog, onUpdateTask, onCompleteTask, isDragMode }: TaskListProps) => {

    // Create a memoized array of sortable items
    const sortedTaskIds = useMemo(() => 
      tasks.filter(task => task.id !== undefined).map(task => ({ id: task.id! })),
      [tasks]
    );


    // Handles saving of edited task titles
  const handleSave = async (id: number | undefined, title: string) => {
    if (!isLoggedIn || id === undefined) return;

    const updatedTask = tasks.find(task => task.id === id);
    if (updatedTask) {
      onUpdateTask({ ...updatedTask, title: title });
    }
  };


  return (
    <div className={styles.customScrollContainer}>
    <div className={`${styles.EditableTasks} ${isLoggedIn ? styles.loggedIn : ''}`}>
      <ul>
        <SortableContext 
          items={sortedTaskIds}
          strategy={verticalListSortingStrategy}
          >
        {tasks.map((task) => <TaskItem
            isLoggedIn={isLoggedIn}
            task={task}
            isDragMode={isDragMode}
            onCompleteTask={onCompleteTask}
            onOpenDialog={onOpenDialog}
            onSave={handleSave}
            />)}
        </SortableContext>
      </ul>
    </div>
    </div>
  );
};

export default TaskList;
