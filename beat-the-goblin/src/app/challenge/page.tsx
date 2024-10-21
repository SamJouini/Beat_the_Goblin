import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

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
  