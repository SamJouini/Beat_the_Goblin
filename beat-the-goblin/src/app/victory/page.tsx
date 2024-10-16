import React from 'react';
import Link from 'next/link';
import styles from './victory.module.css';

const VictoryPage = () => {
  return (
    <div className={styles.victoryContainer}>
      <div className={styles.banner}>
        <h1>Congratulations!</h1>
        <p>You've defeated the goblin and completed your tasks!</p>
      </div>
      <Link href="/" className={styles.returnButton}>
        Return to Grimoire
      </Link>
    </div>
  );
};

export default VictoryPage;

