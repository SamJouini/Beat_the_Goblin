'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

/**
 * Breath Component
 * 
 * This component implements a breathing exercise timer designed to guide users through 
 * a 5-minute breathing exercise. It alternates between "Inhale" and "Exhale" prompts every 
 * 5 seconds, with a visual indicator (an animated circle) to assist in maintaining rhythm.
 * 
 * Key Features:
 * - Timer countdown that resets on page refresh.
 * - Automatic reset when the timer reaches zero or when manually reset.
 * - Start, pause, and reset functionality for user control.
 * 
 * Future Implementation:
 * - Add a setup system to allow users to customize:
 *   1. Overall exercise duration (currently fixed at 5 minutes)
 *   2. Duration of each inhale and exhale cycle (currently fixed at 5 seconds each)
 */

const EXERCISE_DURATION = 5 * 60; // 5 minutes in seconds
const BREATH_CYCLE = 10; // 10 seconds total (5 seconds inhale, 5 seconds exhale)

const Breath = () => {
  // State variables for managing the timer and activity status
  const [timeLeft, setTimeLeft] = useState(EXERCISE_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('inhale'); // Track inhale/exhale phase

  // Effect to handle timer countdown
  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime === 0) {
            resetExercise(); // Reset exercise when time is up
          }
          return newTime;
        });

        // Update breath phase based on remaining time
        setBreathPhase((prevPhase) => 
          (EXERCISE_DURATION - timeLeft) % BREATH_CYCLE < BREATH_CYCLE / 2 ? 'inhale' : 'exhale'
        );
      }, 1000);
    } else if (timeLeft === 0) {
      resetExercise(); // Reset exercise when time is up
    }

    return () => {
      if (interval) clearInterval(interval); // Cleanup function to clear interval
    };
  }, [isActive, timeLeft]);

  // Function to toggle the exercise between active and paused states
  const toggleExercise = () => {
    setIsActive((prevIsActive) => !prevIsActive);
  };

  // Function to reset the exercise to its initial state
  const resetExercise = () => {
    setTimeLeft(EXERCISE_DURATION);
    setIsActive(false);
    setBreathPhase('inhale'); // Reset phase to inhale
  };

  // Function to format seconds into MM:SS string
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Render the Breath exercise UI
  return (
    <div className={styles.breathContainer}>
      <div 
        className={`${styles.breathCircle} ${isActive ? styles.animate : ''}`}
      >
        <div className={styles.circleContent}>
          <span className={styles.breathText}>{breathPhase === 'inhale' ? 'Inhale' : 'Exhale'}</span>
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
        <Link href="/" passHref>
          <button className={styles.button}>Grimoire</button>
        </Link>
      </div>
    </div>
  );  
};

export default Breath;
