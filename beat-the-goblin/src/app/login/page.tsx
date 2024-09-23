import LoginForm from "../components/loginForm";
import styles from './page.module.css';

// html page for the form
export default function LoginPage() {
    return (
      <div className={styles.page}>
      <main className={styles.mainContainer}>
          <div className={styles.paperSection}>
          <div className={styles.content}>
              <h1 className={styles.title}>Welcome to Beat the Goblin!</h1>
              <LoginForm/>
          </div>
          </div>
      </main>
  </div>
  );
};