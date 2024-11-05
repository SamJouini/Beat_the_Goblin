import React from 'react';
import Image from 'next/image';
import styles from './VersusGoblin.module.css';

/**
 * VersusGoblin Component
 * 
 * This component displays a versus screen between the user and a goblin opponent.
 * It visualizes the comparison between the user's XP and the goblin's XP.
 * 
 * Key Features:
 * - Displays a "Versus" text with color-coding based on the XP comparison and login status.
 * - Shows the goblin's avatar and name.
 * - Visually indicates whether the user's XP is sufficient to beat the goblin.
 * 
 * @param {VersusGoblinProps} props - The props for the VersusGoblin component.
 * 
 * Future Implementations:
 * - Address accessibility issus (color blindness) :
 *      Add animations for the versus text or goblin image based on the XP comparison ?
 *      Implement a more detailed XP comparison visualization ? 
 *      Add sound effects or tooltips to enhance user engagement.
 * - Create options to manage the difficulty by changing the goblin value (now = task total - 5)?
 * - Add a randomizer to the goblin name ?
 */

interface VersusGoblinProps {
  goblinName?: string;
  userXP: number;
  goblinXP: number;
  isLoggedIn: boolean;
}

const VersusGoblin = ({ goblinName = 'Bob', userXP, goblinXP, isLoggedIn }: VersusGoblinProps) => {
  // Determine if the user's XP is sufficient to beat the goblin
  const isVersusOk = userXP >= goblinXP;
  return (
    <div className={styles.VersusGoblinContainer}>
      <div className={`${styles.versusText} 
      ${!isLoggedIn ? styles.versusUnlogged : (isVersusOk ? styles.versusOk : styles.versusNotOk)}`}>
        <h2>Versus</h2>
      </div>

      <div className={styles.goblinBannerContainer}>
        <div className={styles.frameContainer}>
          <Image
            src="/assets/user_data/frame.png"
            alt="Goblin Frame"
            width={150}
            height={150}
            className={styles.frame}
          />
          <Image
            src="/assets/characters/GoblinAnimated.gif"
            alt="Goblin"
            width={130}
            height={130}
            unoptimized
            className={styles.goblin}
          />
        </div>
        <div className={styles.bannerContainer}>
          <Image
            src="/assets/user_data/banner2.png"
            alt="Goblin Banner"
            width={200}
            height={50}
            className={styles.banner}
          />
          <span className={styles.goblinName}>{goblinName}</span>
        </div>
      </div>
    </div>
  );
};

export default VersusGoblin;
