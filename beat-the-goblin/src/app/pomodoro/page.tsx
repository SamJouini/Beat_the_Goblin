'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

/**
 * Pomodoro Page
 * 
 * This page implements a Pomodoro timer designed to help users manage their work and break times.
 * It provides a 25-minute countdown timer with start, pause, and reset functionality.
 * 
 * Key Features:
 * - Timer countdown that persists across page refreshes using localStorage.
 * - Automatic reset when the timer reaches zero or when manually reset.
 * - Start, pause, and reset functionality for user control.
 * 
 * Future Implementation:
 * - Add customizable timer duration.
 * - Implement break timer functionality.
 * - Add sound notifications for timer completion ?
 */

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds

const Pomodoro = () => {
  // State variables for managing the timer, activity status, and initialization
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Effect to initialize the timer state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('pomodoroState');
    if (savedState) {
      const { timeLeft: savedTime, isActive: savedIsActive, lastUpdated } = JSON.parse(savedState);
      const elapsedTime = Math.floor((Date.now() - lastUpdated) / 1000);
      const remainingTime = Math.max(savedTime - elapsedTime, 0);
      if (remainingTime > 0) {
        setTimeLeft(remainingTime);
        setIsActive(savedIsActive);
      } else {
        resetTimer();
      }
    }
    setIsInitialized(true); // Mark the component as initialized
  }, []);

  // Effect to handle timer countdown and state persistence
  useEffect(() => {
    if (!isInitialized) return;

    let interval = null;

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
          if (newTime === 0) {
            resetTimer(); // Reset timer when it reaches 0
          } else {
            saveState(); // Save current state
          }
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      resetTimer(); // Reset timer when it reaches 0
    }

    saveState(); // Save state when component updates

    return () => {
      if (interval) clearInterval(interval); // Cleanup function to clear interval
    };
  }, [isActive, timeLeft, isInitialized]);

  // Function to toggle the timer between active and paused states
  const toggleTimer = () => {
    setIsActive(!isActive);
    if (!isActive) {
      fetchPomodoro();
    }
  };

  // Function to reset the timer to its initial state
  const resetTimer = () => {
    setTimeLeft(POMODORO_DURATION);
    setIsActive(false);
    localStorage.removeItem('pomodoroState'); // Clear saved state from localStorage
  };

  // Function to format seconds into MM:SS string
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Function to fetch database when pomodoro start
  const fetchPomodoro = async () => {
      try {
      const response = await fetch('/api/pomodoro', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
    } catch (error) {
      console.error('Error fetching pomodoro:', error);
    }
  };

  // Render the Pomodoro timer UI
  return (
    <div className={styles.pomodoroContainer}>
      <div className={styles.timerCircle}>
        <span className={styles.timerText}>{formatTime(timeLeft)}</span>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={toggleTimer}>
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button className={styles.button} onClick={resetTimer}>
          Reset
        </button>
        <Link href="/" passHref>
          <button className={styles.button}>Grimoire</button>
        </Link>
      </div>
    </div>
  );
};

export default Pomodoro;
