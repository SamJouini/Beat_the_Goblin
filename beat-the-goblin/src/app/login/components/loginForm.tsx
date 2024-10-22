'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './loginForm.module.css';

/**
 * Login Form Component
 * 
 * This component implements a login form for user authentication in the application.
 * It handles form submission, token management, and automatic logout on token expiration.
 * 
 * Key Features:
 * - Manages form state for email and password inputs.
 * - Performs client-side form validation.
 * - Sends login requests to the server and handles responses.
 * - Stores authentication tokens and user information in localStorage.
 * - Implements automatic logout on token expiration.
 * - Displays error messages for failed login attempts.
 * - Uses Next.js router for navigation after successful login.
 * 
 */


const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check token expiration on component mount
    checkTokenExpiration();
  }, []);

  // Checks if the stored token has expired
  const checkTokenExpiration = () => {
    const expirationTime = localStorage.getItem('tokenExpiration');
    if (expirationTime && new Date().getTime() > parseInt(expirationTime)) {
      handleLogout();
    }
  };

  // Removes stored authentication data and redirects to login page
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('tokenExpiration');
    router.push('/login');
  };

  // Updates form state as user types
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Processes form submission and authentication
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        // Store the token and username in localStorage
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('username', data.username);
        
        // Set token expiration
        const expirationTime = new Date().getTime() + (data.expires_in * 1000);
        localStorage.setItem('tokenExpiration', expirationTime.toString());
        
        // Set up automatic logout
        setTimeout(handleLogout, data.expires_in * 1000);
        
        // Redirect to dashboard or home page after successful login
        router.push('/');
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  // Render the login form UI
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formField}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
      </div>
      <div className={styles.formField}>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.submitButton}>Log In</button>
    </form>
  );
};

export default LoginForm;