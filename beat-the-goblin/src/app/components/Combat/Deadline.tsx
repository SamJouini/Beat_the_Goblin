import React, { useState } from 'react';
import styles from './User.module.css';

const DeadlineModal = ({ isOpen, onClose, currentDeadline, onSave }: any) => {
  const [hours, setHours] = useState(currentDeadline);

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Set Deadline</h2>
        <input 
          type="number" 
          min="0" 
          max="23" 
          value={hours} 
          onChange={(e) => setHours(Number(e.target.value))}
        />
        <button onClick={() => onSave(hours)}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default DeadlineModal;
