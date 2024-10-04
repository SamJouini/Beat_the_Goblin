'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import EditableList from './components/TaskEdition';
import CreateTask from './components/TaskAddition';

// Set up to adds components
const MyComponents = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('Guest');


// Function to check if there's a token in storage and fetch username
useEffect(() => {
  const token = localStorage.getItem('token');
  setIsLoggedIn(Boolean(token));

  const storedUsername = localStorage.getItem('username');
  if (storedUsername) {
    setUsername(storedUsername);
  }
}, []);

// Function to handle signup button click
const handleSignupClick = () => {
  router.push('/signup');
};

// Function to handle login/logout button click
const handleLoginLogoutClick = () => {
  if (isLoggedIn) {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('Guest');;
  } else {
    router.push('/login');
  }
};

// Function to handle task addition button click
const handleAddTaskClick = () => {
  if (isLoggedIn) {
    CreateTask
  } else {
    router.push('/login');
  }
};

/* Function to handle task deletion button click
const handleDelTaskClick = () => {
  if (isLoggedIn) {
  }
} else {
  router.push('/login');
} */

  return (
    <div className={styles.container}>

      <header className={styles.header}>
        <div className={styles.leftCloud}>
          <Image
            src="/assets/clouds/leftcloud.png"
            alt="Left cloud"
            width={300}
            height={200}
          />
          {!isLoggedIn && (
            <button className={styles.signupButton} onClick={handleSignupClick}>
            Sign up
            </button>
          )}
        </div>
        <div className={styles.rightCloud}>
          <Image
            src="/assets/clouds/rightcloud.png"
            alt="Right cloud"
            width={300}
            height={200}
          />
          <button className={styles.loginButton} onClick={handleLoginLogoutClick}>
          {isLoggedIn ? 'Logout' : 'Login'}
          </button>
        </div>
        <h1 className={styles.title}>Beat the goblin!</h1>
      </header>

      <main className={styles.main}>

        <section className={styles.grimoire}>

          <div className={styles.deskBackground}>
            <Image
              src="/assets/desk/desk.png"
              alt="Desk"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          <div className={styles.paperUser}>
            <Image
              src="/assets/desk/userpaper.png"
              alt="Paper User"
              width={800}
              height={600}
            />

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

              <div className={styles.versusText}> {/* Idée changer la couleur du versus si ok = vert, sinon = rouge ?*/}
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
                  <span className={styles.GoblinName}> Bob {/*ajouter random goblin name ici ?*/}</span>
                </div>
              </div>

              <div className={styles.userStatsContainer}>
                <div className={styles.userLevelContainer}>
                  <h3 className={styles.levelTitle}> Current level: {5} {/*ajouter logique level ici*/}</h3>
                  <div className={styles.levelDisplay}>
                    <div className={styles.levelBar}>  {/*show the user's xp/next level when hoover ?*/}
                      <div className={styles.levelProgress} style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>

                <div className={styles.streakContainer}>
                  <span className={styles.streakBest}>Longest's Streak: {7}</span>
                  <span className={styles.streakText}>Current Streak: {7}</span>
                </div>

                <div className={styles.rewardContainer}>
                  <h4 className={styles.rewardTitle}>My rewards:</h4> {/* reward function here*/}
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

          <div className={styles.paperTodo}>
            <Image
              src="/assets/desk/todopaper.png"
              alt="Paper Todo"
              width={650}
              height={750}
            />

            <div className={styles.todoContent}>
              <h2>Grimoire
                <Image
                  src="/assets/todo/feather.png"
                  alt="Add"
                  width={30}
                  height={30}
                  className={`${styles.AddTaskButton} ${isLoggedIn ? styles.AddTaskButtonActive : ''}`}
                  onClick={handleAddTaskClick}
                />
              </h2>

              <EditableList />

              <Image
                src={"/assets/todo/cross.png"}
                alt='Delete'
                width={30}
                height={60}
                className={`${styles.DelTaskButton} ${isLoggedIn ? styles.DelTaskButtonActive : ''}`}
                /*onClick={handleDelTaskClick}*/
                />
            </div>

          </div>
        </section>

        <section className={styles.mapSection}>
          <h2 className={styles.mapTitle}>The adventure map</h2>
          <div className={styles.mapContainer}>
            <Image
              src="/assets/map/map.png"
              alt="game's map"
              width={850}
              height={650}
            />
            
{/*
            <div className={styles.rockinthewater}>
              <Image
                src="/assets/map/water/Rocks_03.gif"
                alt="Rock in the water"
                width={100}
                height={100}
              />
            </div>
            <div className={styles.sheepinsand}>
              <Image
                src="/assets/map/decors/HappySheep_Idle.gif"
                alt="sheep in sand"
                width={100}
                height={100}
              />
            </div>
            <div className={styles.tree1}>
              <Image
                src="/assets/map/decors/Tree1.gif"
                alt="Tree1"
                width={100}
                height={100}
              />
            </div>
*/}
          </div>
        </section>

      </main>

      <footer className={styles.footer}>
      <div className={styles.cloud}>
          <Image
            src="/assets/clouds/leftcloud.png"
            alt="center cloud"
            width={300}
            height={200}
            />
            <div className={styles.footerText}>
              <p>&copy; 2024 by Samantha Jouini</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default MyComponents;