import React, { useState, useEffect} from "react";
import Image from "next/image";
import styles from "./User.module.css";
import DeadlineModal from "./Deadline";

const User = ({ username}: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deadline, setDeadline] = useState(20) // heure par défaut 20h
  const streakDays = 3;

useEffect(() => {
  fetchUserDeadline();
}, [])

const fetchUserDeadline = async () => {
  try {
    const response = await fetch('/api/user/deadline', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    if (data.success) {
      setDeadline(data.deadline);
    }
  } catch (error) {
    console.error('Error fetching user deadline:', error);
  }
};

const handleSaveDeadline = async (newDeadline: number) => {
  try {
    const response = await fetch('/api/user/deadline', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ deadline: newDeadline })
    });
    const data = await response.json();
    if (data.success) {
      setDeadline(newDeadline);
      setIsModalOpen(false);
    }
  } catch (error) {
    console.error('Error updating user deadline:', error);
  }
};

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
            <span className={styles.streakBest}>Longest's Streak: {7}</span>
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
          <div className={styles.dayGifContainer}>
            <Image
              src="/assets/user_data/day.gif"
              alt="Day"
              width={100}
              height={100}
              className={styles.dayGif}
            />
            <button 
            className={styles.deadlineButton}
            onClick={() => setIsModalOpen(true)}
            > {/*change the button to show the deadline hours ?*/}
            Deadline: {deadline}:00
            </button>
          </div>
          <DeadlineModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentDeadline={deadline}
          onSave={handleSaveDeadline}
          />
        </div>
      </div>
    </div>
  );
};

export default User;
