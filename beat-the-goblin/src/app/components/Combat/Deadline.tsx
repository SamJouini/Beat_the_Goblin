import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
import styles from './Deadline.module.css';
import Image from 'next/image';

/**
 * Deadline Component
 * 
 * This component manages and displays a deadline for logged-in users. It allows users to view and edit 
 * the deadline, which is stored and retrieved from an API.
 * 
 * Key Features:
 * - Fetches the current deadline from an API on component mount.
 * - Allows users to edit the deadline with an inline time input.
 * - Updates the deadline on the server when changes are made.
 * 
 * Props:
 * @param {boolean} isLoggedIn - Indicates whether a user is logged in.
 * @param {string} deadline - The current deadline value.
 * @param {function} onDeadlineChange - Callback function to update the deadline in the parent component.
 * 
 * Futur implementations:
 * - Modify the displayed gif depending the time of the day (dawn, day, noon, night).
 * - The current component uses 'any' type for its props, change it to improve type safety.
 */

const Deadline = ({isLoggedIn, deadline, onDeadlineChange}:any) => {
  // State to manage whether the deadline is being edited
  const [editing, setEditing] = useState(false);
  
  // Effect to fetch the deadline when the component mounts
  useEffect(() => {
    if (isLoggedIn) {
      fetchDeadline();
    }
  }, [isLoggedIn]);

  // Function to fetch the current deadline from the API
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
        onDeadlineChange(data.deadline);
      }
    } catch (error) {
      console.error('Error fetching deadline:', error);
    }
  };

  // Function to save the updated deadline to the API
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

  // If the user is not logged in, don't render anything
  if (!isLoggedIn) {
    return null;
  }

  // Render the Deadline component UI
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
        // Render an input field when editing
        <input type="time" 
              className={styles.clock}
              value={deadline}
              onChange={(e) => onDeadlineChange(e.target.value)}
              onKeyDown={e => {if (e.key == 'Enter'){handleSave()}}}
              onBlur={handleSave}
              autoFocus/>
      ) : (
        // Render a button with the current deadline when not editing
        <button className={styles.deadlineButton} onClick={() => setEditing(true)}>
          {deadline}
        </button>
      )}
    </div>
  );
};

export default Deadline;
