import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
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
        </div>
        <div className={styles.rightCloud}>
          <Image
            src="/assets/clouds/rightcloud.png"
            alt="Right cloud"
            width={300}
            height={200}
          />
          <button className={styles.loginButton}> Login {/*ajouter logique login ici*/} </button>
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
                    src="/assets/user_data/knight.png"
                    alt="Knight"
                    width={130}
                    height={130}
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
                  <span className={styles.username}>Username {/*ajouter logique username ici*/}</span>
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
                    src="/assets/user_data/goblin.png"
                    alt="Goblin"
                    width={130}
                    height={130}
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
                  alt="Edit"
                  width={40}
                  height={40}
                  className={styles.editButton} //ajouter logique edit todo ici
                />
              </h2>

              <ul className={styles.todoList}>
                <li>Learn fireball spell</li>
                <li>Collect dragon scales</li>
                <li>Brew invisibility potion</li>
                <li>Practice levitation</li>
              </ul>

            </div>

          </div>

        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 Your Name</p>
      </footer>
    </div>
  );
}
