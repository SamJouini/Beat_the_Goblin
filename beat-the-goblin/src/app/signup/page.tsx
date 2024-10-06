import SignupForm from './components/signupForm';
import styles from './page.module.css';

// html page for the form
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
