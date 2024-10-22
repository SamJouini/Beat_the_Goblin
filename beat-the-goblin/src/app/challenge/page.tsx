import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

/**
 * Challenge Page 
 * 
 * This page renders the challenge page, offering users different options
 * to gain extra XP after the deadline (if the user did not manage to beat the goblin).
 * It provides motivational messages and links to various coping strategies.
 * 
 * Key Features:
 * - Displays a motivational banner with a title and encouraging message.
 * - Offers three options for users to choose from:
 *   1. Motivation boost (links to Pomodoro page)
 *   2. Taking a breath (links to Breath page)
 *   3. Postponing the challenge (links to Tomorrow page -> moves the uncompleted task(s) to the next day)
 * - Uses Next.js Link component for client-side navigation between pages.
 * 
 */

const ChallengePage = () => {
    return (
      <div className={styles.challengeContainer}>
        <div className={styles.banner}>
          <h1>Challenge!</h1>
          <p>You’ve faced a tough battle, but there’s always room to grow!</p>
        </div>
        <div className={styles.options}>
          <Link href="/pomodoro" className={styles.optionButton}>
            I need a motivation boost.
          </Link>
          <Link href="/breath" className={styles.optionButton}>
            I need to take a breath.
          </Link>
          <Link href="/tomorow" className={styles.optionButton}>
            I still can do it tomorow.
          </Link>
        </div>
      </div>
    );
  };
  
  export default ChallengePage;
  