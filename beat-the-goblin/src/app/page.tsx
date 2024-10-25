'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Header from './components/Header';
import Grimoire from './components/Grimoire/Grimoire';
import User from './components/Combat/User';
import VersusGoblin from './components/Combat/VersusGoblin';
import Map from './components/Map';
import Footer from './components/Footer'

const MyComponents = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('Guest');
  const [userXP, setUserXP] = useState(0);
  const [goblinXP, setGoblinXP] = useState(0);
  const [deadline, setDeadline] = useState<string>("--:--");

  useEffect(() => {
    const checkTokenAndExpiration = () => {
      const token = localStorage.getItem('token');
      const expirationTime = localStorage.getItem('tokenExpiration');
      const storedUsername = localStorage.getItem('username');

      if (token && expirationTime) {
        const currentTime = new Date().getTime();
        if (currentTime > parseInt(expirationTime)) {
          // Token has expired
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiration');
          localStorage.removeItem('username');
          setIsLoggedIn(false);
          setUsername('Guest');
        } else {
          // Token is still valid
          setIsLoggedIn(true);
          setUsername(storedUsername || 'Guest');
        }
      } else {
        // No token or expiration time found
        setIsLoggedIn(false);
        setUsername('Guest');
      }
    };

    // Initial check
    checkTokenAndExpiration();

    // Set up periodic checks
    const intervalId = setInterval(checkTokenAndExpiration, 60000); // Check every minute

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);


  // Function to update the Xps
  const updateCombatXP = (newUserXP : number, newGoblinXP : number) => {
    setUserXP(newUserXP);
    setGoblinXP(newGoblinXP);
  };


  // Add a useEffect for victory check
  useEffect(() => {
    const checkVictoryCondition = () => {
      const now = new Date();
      const [hours, minutes] = deadline.split(':').map(Number);
      const deadlineTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

      if (now >= deadlineTime && userXP >= goblinXP) {
        router.push('/victory');
      } else if (now >= deadlineTime && userXP < goblinXP) {
        router.push('/challenge');
      }
    };

    const victoryCheck = setInterval(checkVictoryCondition, 60000); // Check every minute
    checkVictoryCondition();

    return () => clearInterval(victoryCheck);
  }, [deadline, userXP, goblinXP, router]);


  return (
    <div className={styles.container}>
      <Header 
      isLoggedIn={isLoggedIn} 
      setIsLoggedIn={setIsLoggedIn} 
      setUsername={setUsername} />

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
            <User 
            username={username} 
            isLoggedIn={isLoggedIn} 
            userXP={userXP}
            deadline={deadline}
            setDeadline={setDeadline}
            />
            <VersusGoblin 
            goblinName="Bob" 
            userXP={userXP} 
            goblinXP={goblinXP}
            isLoggedIn={isLoggedIn}
            />
          </div>

          <div className={styles.paperTodo}>
            <Image
              src="/assets/desk/todopaper.png"
              alt="Paper Todo"
              width={650}
              height={750}
            />
            <div className={styles.todoContent}>
              <Grimoire 
              isLoggedIn={isLoggedIn} 
              updateCombatXP={updateCombatXP}
              deadline={deadline}
              />
            </div>
          </div>
        </section>

      <Map/>
      </main>

      <Footer/>
    </div>
  );
};

export default MyComponents;
