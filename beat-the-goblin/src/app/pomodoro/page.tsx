'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

// Define the duration of a Pomodoro session in seconds (currently 25 minutes) 
// Create a change timer button for more option ? 
const POMODORO_DURATION = 25 * 60;

const Pomodoro = () => {
  // State variables
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Effect to initialize the timer state, potentially from localStorage (in case the user refresh the page)
  useEffect(() => {
    // Retrieve saved state from localStorage
    const savedState = localStorage.getItem('pomodoroState');
    if (savedState) {
      const { timeLeft: savedTime, isActive: savedIsActive, lastUpdated } = JSON.parse(savedState);
      // Calculate elapsed time since last update
      const elapsedTime = Math.floor((Date.now() - lastUpdated) / 1000);
      // Ensure remaining time doesn't go below 0
      const remainingTime = Math.max(savedTime - elapsedTime, 0);
      setTimeLeft(remainingTime);
      setIsActive(savedIsActive);
    }
    setIsInitialized(true);
  }, []);

  // Effect to handle timer countdown and state persistence
  useEffect(() => {
    if (!isInitialized) return;

    let interval: NodeJS.Timeout;

    // Function to save current state to localStorage
    const saveState = () => {
      localStorage.setItem('pomodoroState', JSON.stringify({
        timeLeft,
        isActive,
        lastUpdated: Date.now()
      }));
    };

    if (isActive && timeLeft > 0) {
      // Set up interval to decrement timer every second
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          saveState();
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      // Stop the timer when it reaches 0
      setIsActive(false);
      saveState();
    }

    // Save state when component updates
    saveState();

    // Cleanup function to clear interval
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isInitialized]);

  // Function to toggle the timer between active and paused states
  const toggleTimer = () => {
    setIsActive((prevIsActive) => !prevIsActive);
  };

  // Function to format seconds into MM:SS string
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Render the Pomodoro timer UI
  return (
    <div className={styles.pomodoroContainer}>
      <div className={styles.timerCircle}>
        <span className={styles.timerText}>{formatTime(timeLeft)}</span>
      </div>
      <button className={styles.startButton} onClick={toggleTimer}>
        {isActive ? 'Pause' : 'Start'}
      </button>
    </div>
  );
};

export default Pomodoro;
