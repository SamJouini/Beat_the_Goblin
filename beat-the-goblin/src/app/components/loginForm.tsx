'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './loginForm.module.css';

const LoginForm = () => {
  // Manager form for input values
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Manager for error messages
  const [error, setError] = useState('');

  // Call for Next.js router
  const router = useRouter();

  // Field writing handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

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
        // Redirect to dashboard or home page after successful login
        router.push('/dashboard');
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

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
