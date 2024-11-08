import React, { useState, useEffect} from "react";
import Image from "next/image";
import styles from "./User.module.css";
import Deadline from "./Deadline";

/**
 * User Component
 * 
 * This component displays user information including username, avatar, streak, rewards, and deadline.
 * 
 * Key Features:
 * - Displays user avatar and username.
 * - Shows current streak and longest streak (currently a placeholder).
 * - Displays user rewards (durrently a placeholder).
 * - Integrates the Deadline component for deadline management.
 * 
 * @param {UserProps} props - The props for the User component.
 * @property {string} username - The username of the current user.
 * @property {boolean} isLoggedIn - Indicates whether a user is logged in.
 * @property {number} userXP - The experience points of the user.
 * @property {string} deadline - The current deadline value.
 * @property {function} setDeadline - Function to update the deadline.
 * 
 * Future Implementations:
 * - Implement dynamic streak calculation based on user activity.
 * - Add functionality to earn and display more rewards.
 * - Implement a user page to edit user infos ? (name, avatar...?)
 * - Implement user level system ?
 */


interface UserProps {
  username: string;
  isLoggedIn: boolean;
  userXP: number;
  deadline: string;
  setDeadline: (newDeadline: string) => void;
}

const User = ({ username, isLoggedIn, userXP, deadline, setDeadline }: UserProps) => {
  // Hardcoded streak days for demonstration
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
            <span className={styles.streakText}>Current Streak: {3}</span>
            <span className={styles.streakBest}>Longest Streak: {7}</span>
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
      <Deadline 
      isLoggedIn={isLoggedIn}
      deadline={deadline}
      onDeadlineChange={setDeadline}
      />
    </div>
  );
};

export default User;
