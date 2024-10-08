import React, { useState } from 'react';
import styles from './TaskMenu.module.css';
import Image from 'next/image';

interface TaskMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onUpdateTask: (updatedProperties: Partial<TaskProperties>) => void;
}

interface TaskProperties {
  difficulty: boolean;
  length: boolean;
  importance: boolean;
  urgency: boolean;
}

const TaskMenu = ({ isOpen, onClose, onDelete, onUpdateTask }: TaskMenuProps) => {
  const [properties, setProperties] = useState<TaskProperties>({
    difficulty: false,
    length: false,
    importance: false,
    urgency: false,
  });

  const handleCheckboxChange = (property: keyof TaskProperties) => {
    setProperties(prev => ({ ...prev, [property]: !prev[property] }));
    onUpdateTask({ [property]: !properties[property] });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.menuContainer}>
        <Image
          src="/assets/todo/bannerHorizontale.png"
          alt="Menu"
          layout="fill"
          objectFit="cover"
          className={styles.backgroundImage}
        />
        <div className={styles.menuContent}>
          <h3>Task Options</h3>
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                checked={properties.difficulty}
                onChange={() => handleCheckboxChange('difficulty')}
              />
              Difficulty
            </label>
            <label>
              <input
                type="checkbox"
                checked={properties.length}
                onChange={() => handleCheckboxChange('length')}
              />
              Length
            </label>
            <label>
              <input
                type="checkbox"
                checked={properties.importance}
                onChange={() => handleCheckboxChange('importance')}
              />
              Importance
            </label>
            <label>
              <input
                type="checkbox"
                checked={properties.urgency}
                onChange={() => handleCheckboxChange('urgency')}
              />
              Urgency
            </label>
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
