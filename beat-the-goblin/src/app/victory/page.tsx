import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

/**
 * Victory Page
 * 
 * This page is displayed when the user successfully completes a task or challenge,
 * (metaphorically) defeating the goblin. It offers a congratulatory message and
 * provides a way to return to the main page (Grimoire).
 * 
 * Key Features:
 * - Displays a celebratory banner with a congratulatory title and message.
 * - Offers a "Return to Grimoire" button to navigate back to the main page.
 * - Uses Next.js Link component for client-side navigation.
 * 
 */


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

