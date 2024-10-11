'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Grimoire from './components/Grimoire/Grimoire';
import User from './components/Combat/User';
import VersusGoblin from './components/Combat/VersusGoblin';

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
      setUsername('Guest');
    } else {
      router.push('/login');
    }
  };

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
            <User username={username} isLoggedIn={isLoggedIn}/>
            <VersusGoblin goblinName="Bob" isVersusOk={true}/>
          </div>

          <div className={styles.paperTodo}>
            <Image
              src="/assets/desk/todopaper.png"
              alt="Paper Todo"
              width={650}
              height={750}
            />
            <div className={styles.todoContent}>
              <Grimoire isLoggedIn={isLoggedIn}/>
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
