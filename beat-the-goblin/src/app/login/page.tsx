import LoginForm from "./components/loginForm";
import styles from './page.module.css';

/**
 * Login Page
 * 
 * This page renders the login interface for the "Beat the Goblin" application.
 * It provides a welcoming message and incorporates the LoginForm component
 * for user authentication.
 * 
 * Key Features:
 * - Displays a welcoming title for returning users.
 * - Integrates the LoginForm component for handling user login.
 * - Uses CSS modules for styling, ensuring a consistent and appealing layout.
 *
 */


export default function LoginPage() {
    return (
      <div className={styles.page}>
      <main className={styles.mainContainer}>
          <div className={styles.paperSection}>
          <div className={styles.content}>
              <h1 className={styles.title}>Welcome back to Beat the Goblin!</h1>
              <LoginForm/>
          </div>
          </div>
      </main>
  </div>
  );
};