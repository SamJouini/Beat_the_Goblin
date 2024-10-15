import React, { useState } from 'react';
import styles from './TaskMenu.module.css';
import Image from 'next/image';
import { Task } from './Grimoire';

interface TaskMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onUpdateTask: (updatedProperties: Partial<Task>) => void;
  task: Task | null;
}

const TaskMenu = ({ isOpen, onClose, onDelete, onUpdateTask, task }: TaskMenuProps) => {
    if (!isOpen || !task) return null;


  const [properties, setProperties] = useState({
    long: false,
    difficult: false,
    urgent: false,
    important: false,
  });

  const handleCheckboxChange = (property: keyof Task) => {
    const newValue = !task[property];
    setProperties(prev => ({ ...prev, [property]: newValue }));
    onUpdateTask({ [property]: newValue });
  };

  if (!isOpen) return null;

  return (
    <dialog open className={styles.menuContainer}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <div className={styles.menuContent}>
            <h3 className={styles.title}>Is this task ...</h3>
            <div className={styles.checkboxGroup}>
                {Object.entries(properties).map(([key, value]) => (
                    <div key={key} className={styles.checkboxItem}>
                        <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        <input
                            type="checkbox"
                            checked={value}
                            onChange={() => handleCheckboxChange(key as keyof Task)}
                        />
                    </div>
                ))}
            <h3 className={styles.title}> ... ? </h3>
            </div>
            <button className={styles.deleteButton} onClick={onDelete}>
                <Image
                    src="/assets/todo/cross.png"
                    alt="Delete"
                    width={40}
                    height={60}
                />
            </button>
        </div>
    </dialog>
);
};

export default TaskMenu;
