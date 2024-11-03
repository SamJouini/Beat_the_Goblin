import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import Image from 'next/image';
import { Task } from './Grimoire';
import { CSS } from '@dnd-kit/utilities';
import styles from './TaskList.module.css';


interface TaskItemProps {
    isLoggedIn: boolean;
    task: Task;
    onOpenDialog: (taskId: number | undefined, clientY: number) => void;
    onCompleteTask: (taskId: number) => void;
    isDragMode: boolean;
    onSave: (id: number | undefined, title: string) => void;
  }


const TaskItem = ({isLoggedIn, task, onOpenDialog, onCompleteTask, isDragMode, onSave }: TaskItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id! });
    const [editMode, setEditMode] = useState(false);
    const [editValue, setEditValue] = useState<string>(task.title);

    const style = isDragMode ? {
        transform: CSS.Transform.toString(transform),
        transition,
    } : undefined;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setEditMode(false);
            onSave(task.id, editValue);
        }
    };

    const handleBlur = () => {
        setEditMode(false)
        onSave(task.id, editValue);
    };

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
                    {task.title} {(task.xp)}
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
MouseEvent
export default TaskItem;