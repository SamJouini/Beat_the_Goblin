import Image from "next/image";
import styles from "./User.module.css";

const User = ({ username }: any) => {
  const streakDays = 3;
  return (
    <div className={styles.userContainer}>
      <div className={styles.userContent}>
        <div className={styles.knightBannerContainer}>
          <div className={styles.frameContainer}>
            <Image
              src="/assets/user_data/frame.png"
              alt="Frame"
              width={150}
              height={150}
              className={styles.frame}
            />
            <Image
              src="/assets/characters/KnightAnimated.gif"
              alt="Knight"
              width={130}
              height={130}
              unoptimized
              className={styles.knight}
            />
          </div>
          <div className={styles.bannerContainer}>
            <Image
              src="/assets/user_data/banner.png"
              alt="Banner"
              width={200}
              height={50}
              className={styles.banner}
            />
            <span className={styles.username}>{username}</span>
          </div>
        </div>
        <div className={styles.userStatsContainer}>
          <div className={styles.streakContainer}>
            <div className={styles.streakBar}>
              {[...Array(7)].map((_, index) => (
                <div 
                  key={index} 
                  className={`${styles.streakDay} ${index < streakDays ? styles.active : ''}`}
                ></div>
              ))}
            </div>
            <span className={styles.streakBest}>Longest's Streak: {7}</span>
            <span className={styles.streakText}>Current Streak: {3}</span>
          </div>
          <div className={styles.rewardContainer}>
            <h4 className={styles.rewardTitle}>My rewards:</h4>
            <div className={styles.rewardGrid}>
              <div className={styles.rewardItem}>
                <Image
                  src="/assets/user_data/rewards/cailloux.png"
                  alt="Reward 1"
                  width={50}
                  height={50}
                />
              </div>
              <div className={styles.rewardItem}>
                <Image
                  src="/assets/user_data/rewards/courge.png"
                  alt="Reward 2"
                  width={50}
                  height={50}
                />
              </div>
              <div className={styles.rewardItem}>
                <Image
                  src="/assets/user_data/rewards/mushroom.png"
                  alt="Reward 3"
                  width={50}
                  height={50}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
