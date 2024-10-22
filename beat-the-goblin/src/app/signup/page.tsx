import SignupForm from './components/signupForm';
import styles from './page.module.css';

/**
 * Signup Page
 * 
 * This page renders the signup interface for the "Beat the Goblin" application.
 * It provides a welcoming message to new users and incorporates the SignupForm component
 * for user registration.
 * 
 * Key Features:
 * - Displays a welcoming title for new users.
 * - Integrates the SignupForm component for handling user registration.
 * - Uses CSS modules for styling, ensuring a consistent and appealing layout.
 * 
 */

export default function SignupPage() {
    return (
      <div className={styles.page}>
      <main className={styles.mainContainer}>
          <div className={styles.paperSection}>
          <div className={styles.content}>
              <h1 className={styles.title}>Welcome to Beat the Goblin!</h1>
              <SignupForm/>
          </div>
          </div>
      </main>
  </div>
  );
};
