import React, { useState, useEffect } from 'react';
import styles from './TaskMenu.module.css';
import Image from 'next/image';
import { Task } from './Grimoire';

interface TaskMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onUpdateTask: (updatedProperties: Partial<Task>) => void;
  calculateXP: (task: Task) => number;
  task: Task | null;
}

const propertyDisplayNames: Record<'length' | 'difficulty' | 'urgency' | 'importance' | 'recurrence', string> = {
  length: 'Long',
  difficulty: 'Difficult',
  urgency: 'Urgent',
  importance: 'Important',
  recurrence: 'Recurrent'
};

const TaskMenu = ({ isOpen, onClose, onDelete, onUpdateTask, calculateXP, task }: TaskMenuProps) => {
    if (!isOpen || !task) return null;


     // Initialize properties state with the task properties
  const [properties, setProperties] = useState({
    length: task.length || false,
    difficulty: task.difficulty || false,
    urgency: task.urgency || false,
    importance: task.importance || false, 
    recurrence: task.recurrence || false,
  });

  // Update properties when task changes
  useEffect(() => {
    if (task) {
      setProperties({
        length: task.length || false,
        difficulty: task.difficulty || false,
        urgency: task.urgency || false,
        importance: task.importance || false,
        recurrence: task.recurrence || false,
      });
    }
  }, [task]);

    // Handle checkbox changes and recalculate XP
    const handleCheckboxChange = (property: keyof typeof properties) => {
        const newProperties = { ...properties, [property]: !properties[property] };
        setProperties(newProperties);
                
        onUpdateTask({ ...newProperties});
      };
    
      return (
        <dialog open className={styles.menuContainer}>
          <button className={styles.closeButton} onClick={onClose}>×</button>
          <div className={styles.menuContent}>
            <h3 className={styles.title}> Is my task ...</h3>
            <div className={styles.checkboxGroup}>
            {(Object.keys(properties) as Array<keyof typeof properties>).map((key) => (
            <div key={key} className={styles.checkboxItem}>
              <span>{propertyDisplayNames[key]}</span>
                  <input
                    type="checkbox"
                    checked={properties[key]}
                    onChange={() => handleCheckboxChange(key)}
                  />
                </div>
              ))}
              <h3 className={styles.title}> ...? </h3> 
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