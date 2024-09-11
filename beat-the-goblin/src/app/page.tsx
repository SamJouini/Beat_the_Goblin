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
          <button className={styles.loginButton}> Login </button> {/* ajouter logique login ici */}
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
              width={850}
              height={650}
            />
          </div>
        </section>
      </main>


      <footer className={styles.footer}>
        <p>&copy; 2024 Your Name</p>
      </footer>
    </div>
  );
}
