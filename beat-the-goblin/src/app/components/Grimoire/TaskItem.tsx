import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import Image from 'next/image';
import { Task } from './Grimoire';
import { CSS } from '@dnd-kit/utilities';
import styles from './TaskList.module.css';

/**
 * TaskItem Component
 * 
 * Renders an individual task item with editing, completion, and drag-and-drop capabilities.
 */

interface TaskItemProps {
    isLoggedIn: boolean;
    task: Task;
    onOpenDialog: (taskId: number | undefined, clientY: number) => void;
    onCompleteTask: (taskId: number) => void;
    isDragMode: boolean;
    onSave: (id: number | undefined, title: string) => void;
  }


const TaskItem = ({isLoggedIn, task, onOpenDialog, onCompleteTask, isDragMode, onSave }: TaskItemProps) => {
    // Sortable hook for drag-and-drop functionality
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id! });
    // State for managing edit mode and task title
    const [editMode, setEditMode] = useState(false);
    const [editValue, setEditValue] = useState<string>(task.title);

    // Style for drag-and-drop
    const style = isDragMode ? {
        transform: CSS.Transform.toString(transform),
        transition,
    } : undefined;

    // Handles the keydown event when editing a task title
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setEditMode(false);
            onSave(task.id, editValue);
        }
    };

    // Handles the blur event when editing a task title
    const handleBlur = () => {
        setEditMode(false)
        onSave(task.id, editValue);
    };

    // Handles the completion of a task
    const handleComplete = () => {
        if (isLoggedIn && task.id !== undefined) {
            onCompleteTask(task.id);
        }
    };


    return (
        <li key={task.id} 
            ref={setNodeRef}
            style={style}
            {...(isDragMode ? { ...attributes, ...listeners } : {})}
            className={task.completed_at ? styles.completed : ''}
            >
            <button
            className={styles.bulletButton}
            onClick={handleComplete}
            disabled={!isLoggedIn || isDragMode}
            >
                {task.completed_at ? '✓' : '\u261B'}
            </button>
            <div className={styles.taskContent}>
                {editMode && isLoggedIn && !isDragMode ? (
                    <input
                        className={styles.taskedit}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        autoFocus
                    />
            ) : (
                <span 
                    className={`${isLoggedIn && !isDragMode ? styles.editable : ''} ${task.completed_at ? styles.strikethrough : ''}`}
                    onClick={() => setEditMode(isLoggedIn)}
                >
                    {task.title}
                </span>
            )}
            </div>
            {isLoggedIn && !isDragMode && (
            <Image
                src="/assets/todo/Book.png"
                alt="Menu"
                width={15}
                height={15}
                className={styles.MenuIcon}
                onClick={(event) => onOpenDialog(task.id, event.clientY)}
            />
        )}
        </li>
        
    )
};

export default TaskItem;