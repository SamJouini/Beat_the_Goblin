import React from 'react';
import Image from 'next/image';
import styles from './VersusGoblin.module.css';

const VersusGoblin = ({ goblinName = 'Bob', isVersusOk = true }) => {
  return (
    <div className={styles.VersusGoblinContainer}>
      <div className={`${styles.versusText} ${isVersusOk ? styles.versusOk : styles.versusNotOk}`}>
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
