import React, { useEffect, useState, ChangeEvent } from 'react';
import styles from './Deadline.module.css';
import Image from 'next/image';

const Deadline = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
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
        setHours(data.deadline.hours);
        setMinutes(data.deadline.minutes);
      }
    } catch (error) {
      console.error('Error fetching deadline:', error);
    }
  };

  const handleHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 0 && value <= 23) {
      setHours(value);
    }
  };

  const handleMinutesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 0 && value <= 59) {
      setMinutes(value);
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
        body: JSON.stringify({ hours, minutes }),
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
          {hours}:{minutes} 
        </button>
      </div>
      <dialog className={styles.dialog} open={isOpen}>
        <button className={styles.closeButton} onClick={() => setIsOpen(false)}> × </button>
        <div className={styles.dialogContent}>
          <h2 className={styles.title}>Edit your deadline</h2>
          <div className={styles.time}>
            <div className={styles.hours}>
              <input 
                className={styles.clock}
                type="number" 
                min="0" 
                max="23" 
                value={hours} 
                onChange={handleHoursChange}
                />
            </div>
            <div className={styles.minutes}>
              <input 
                id="minutes"
                className={styles.clock}
                type="number" 
                min="0" 
                max="59" 
                value={minutes} 
                onChange={handleMinutesChange}
              />
            </div>
          </div>
          <button className={styles.SaveButton} onClick={handleSave}>Save</button>
        </div>
      </dialog>
  </>
  );
};

export default Deadline;
