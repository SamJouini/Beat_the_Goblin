import React, { useEffect, useState, ChangeEvent } from 'react';
import styles from './Deadline.module.css';
import Image from 'next/image';

const Deadline = () => {
  const [deadline, setDeadline] = useState("--:--");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
      fetchDeadline();
  }, []);

  const fetchDeadline = async () => {
    try {
      const response = await fetch('/api/deadline', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setDeadline(data.deadline);
      }
    } catch (error) {
      console.error('Error fetching deadline:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/deadline', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({"deadline": deadline}),
      });
      const data = await response.json();
      if (data.success) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error updating deadline:', error);
    }
  };

  return (
  <>
      <div className={styles.dayGifContainer}>
        <Image 
          src="/assets/user_data/day.gif"
          alt="Day"
          width={100}
          height={100}
          className={styles.dayGif}
        />
        <button className={styles.deadlineButton} onClick={() => setIsOpen(true)}>
          {deadline} 
        </button>
      </div>
      <dialog className={styles.dialog} open={isOpen}>
        <button className={styles.closeButton} onClick={() => setIsOpen(false)}> × </button>
        <div className={styles.dialogContent}>
          <h2 className={styles.title}>Edit your deadline</h2>
          <div className={styles.time}>
            <input type="time" className={styles.clock} value={deadline} onChange={(e) => setDeadline(e.target.value)}/>
          </div>
          <button className={styles.SaveButton} onClick={handleSave}>Save</button>
        </div>
      </dialog>
  </>
  );
};

export default Deadline;
