import React, { useState, useEffect } from 'react';
import styles from './TaskMenu.module.css';
import Image from 'next/image';
import { Task } from './Grimoire';

interface TaskMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onUpdateTask: (updatedProperties: Partial<Task>) => void;
}

const TaskMenu = ({ isOpen, onClose, onDelete, onUpdateTask }: TaskMenuProps) => {
  const [properties, setProperties] = useState({
    difficulty: false,
    length: false,
    importance: false,
    urgency: false,
  });

  const handleCheckboxChange = (property: keyof typeof properties) => {
    const newValue = !properties[property];
    setProperties(prev => ({ ...prev, [property]: newValue }));
    onUpdateTask({ [property]: newValue });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.menuContainer}>
        <Image
          src="/assets/todo/DialogBox.png"
          alt="Menu"
          layout="fill"
          objectFit="cover"
          className={styles.backgroundImage}
        />
        <div className={styles.menuContent}>
          <h3>Task Options</h3>
          <div className={styles.checkboxGroup}>
            {Object.entries(properties).map(([key, value]) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleCheckboxChange(key as keyof typeof properties)}
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
          </div>
          <div className={styles.buttonGroup}>
            <button onClick={onDelete}>Delete Task</button>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskMenu;
