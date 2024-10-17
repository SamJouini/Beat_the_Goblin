import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const VictoryPage = () => {
  return (
    <div className={styles.victoryContainer}>
      <div className={styles.banner}>
        <h1>Congratulations!</h1>
        <p>You’ve triumphed over the goblin!</p>
      </div>
      <Link href="/" className={styles.returnButton}>
        Return to Grimoire
      </Link>
    </div>
  );
};

export default VictoryPage;

