'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

/**
 * Breath Component
 * 
 * This component implements a breathing exercise timer designed to guide users through 
 * a 5-minute breathing exercise. It alternates between "Inhale" and "Exhale" prompts every 
 * 5 seconds, with a visual indicator (an animated circle) to assist in maintaining rhythm.
 * 
 * Key Features:
 * - Timer countdown that persists across page refreshes using localStorage.
 * - Automatic reset when the timer reaches zero or when manually reset.
 * - Start, pause, and reset functionality for user control.
 * 
 * - Add a setup system to allow users to customize:
 *   1. Overall exercise duration (currently fixed at 5 minutes)
 *   2. Duration of each inhale and exhale cycle (currently fixed at 5 seconds each)
 */

const EXERCISE_DURATION = 5 * 60; // 5 minutes in seconds
const BREATH_CYCLE = 10; // 10 seconds total (5 seconds inhale, 5 seconds exhale)

const Breath = () => {
  // State variables for managing the timer, activity status, and initialization
  const [timeLeft, setTimeLeft] = useState(EXERCISE_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Effect to initialize the timer state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('breathState');
    if (savedState) {
      // Parse the saved state
      const { timeLeft: savedTime, isActive: savedIsActive, lastUpdated } = JSON.parse(savedState);
      // Calculate elapsed time since last update
      const elapsedTime = Math.floor((Date.now() - lastUpdated) / 1000);
      // Calculate remaining time, ensuring it doesn't go below 0
      const remainingTime = Math.max(savedTime - elapsedTime, 0);
      if (remainingTime > 0) {
        // If there's time left, restore the saved state
        setTimeLeft(remainingTime);
        setIsActive(savedIsActive);
      } else {
        // If time has elapsed, reset the exercise
        resetExercise();
      }
    }
    // Mark the component as initialized
    setIsInitialized(true);
  }, []);

  // Effect to handle timer countdown and state persistence
  useEffect(() => {
    if (!isInitialized) return;

    let interval: NodeJS.Timeout | null = null;

    // Function to save current state to localStorage
    const saveState = () => {
      localStorage.setItem('breathState', JSON.stringify({
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
            // If time is up, reset the exercise
            resetExercise();
          } else {
            // Otherwise, save the current state
            saveState();
          }
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      // If time is up, reset the exercise
      resetExercise();
    }

    // Save state when component updates
    saveState();

    // Cleanup function to clear interval
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isInitialized]);

  // Function to toggle the exercise between active and paused states
  const toggleExercise = () => {
    setIsActive((prevIsActive) => !prevIsActive);
  };

  // Function to reset the exercise to its initial state
  const resetExercise = () => {
    setTimeLeft(EXERCISE_DURATION);
    setIsActive(false);
    localStorage.removeItem('breathState');
  };

  // Function to format seconds into MM:SS string
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Determine whether the current phase is inhale or exhale
  const isInhale = Math.floor((EXERCISE_DURATION - timeLeft) / (BREATH_CYCLE / 2)) % 2 === 0;



  // Render the Breath exercise UI
  return (
    <div className={styles.breathContainer}>
      <div className={`${styles.breathCircle} ${isActive ? styles.animate : ''}`}>
        <div className={styles.circleContent}>
          <span className={styles.breathText}>{isInhale ? 'Inhale' : 'Exhale'}</span>
          <span className={styles.timerText}>{formatTime(timeLeft)}</span>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={toggleExercise}>
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button className={styles.button} onClick={resetExercise}>
          Reset
        </button>
      </div>
    </div>
  );  
};

export default Breath;
