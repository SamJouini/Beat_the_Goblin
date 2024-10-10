import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
import styles from './Deadline.module.css';
import Image from 'next/image';

const Deadline = () => {
  const [deadline, setDeadline] = useState("--:--");
  const [editing, setEditing] = useState(false);

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
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating deadline:', error);
    }
  };

  return (
    <div className={styles.dayGifContainer}>
      <Image 
        src="/assets/user_data/day.gif"
        alt="Day"
        width={100}
        height={100}
        className={styles.dayGif}
      />

      {editing ? (
        <input type="time" 
              className={styles.clock}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              onKeyDown={e => {if (e.key == 'Enter'){handleSave()}}}
              onBlur={handleSave}
              autoFocus/>
      ):(
        <button className={styles.deadlineButton} onClick={() => setEditing(true)}>
          {deadline}
        </button>
      )
      }
    </div>
  );
};

export default Deadline;
