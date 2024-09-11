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
                  src="/assets/to-do/feather.png"
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
