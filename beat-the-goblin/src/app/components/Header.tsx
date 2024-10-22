'use client';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import styles from "./Header.module.css";

/**
 * Header Component
 * 
 * This component implements the header section of the application, including
 * login/logout functionality, signup option, and the main title.
 * 
 * Key Features:
 * - Displays "Sign up" button for non-logged-in users.
 * - Shows "Login" or "Logout" button based on user's login status.
 * - Handles user authentication state and token management.
 * - Provides navigation to signup and login pages.
 * 
 * Props:
 * @param {boolean} isLoggedIn - Indicates whether a user is currently logged in.
 * @param {function} setIsLoggedIn - Function to update the login status.
 * @param {function} setUsername - Function to set the current user's username.
 */


interface HeaderProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  setUsername: (value: string) => void;
}

const Header = ({ isLoggedIn, setIsLoggedIn, setUsername }: HeaderProps) => {
  const router = useRouter();

  // Function to handle signup button click
  const handleSignupClick = () => {
    router.push('/signup');
  };


  interface LoginResponse {
    access_token: string;
    username: string;
    expires_in: number;
  }  

   // Function to handle login success
   const handleLoginSuccess = (response : LoginResponse) => {
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('username', response.username);
    
    // Calculate and store expiration time
    const expirationTime = new Date().getTime() + (response.expires_in * 1000);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
    
    setIsLoggedIn(true);
    setUsername(response.username);
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

  // Render the header UI
  return (
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
      <h1 className={styles.title}>Beat the goblin!</h1>
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
    </header>
  );
};

export default Header;
