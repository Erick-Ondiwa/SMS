// components/Auth/ForgotPasswordForm.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ForgotPasswordForm.module.css';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('');
    setError('');

    try {
      // TODO: Replace with API call to initiate password reset
      console.log(`Sending reset link to: ${email}`);
      setStatus('Password reset link sent. Check your email.');
    } catch (err) {
      setError('Failed to send reset link. Try again later.');
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className={styles.input}
      />

      {status && <div className={styles.success}>{status}</div>}
      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={styles.button}>
        Send Reset Link
      </button>

      <p className={styles.linkText}>
        Remembered your password?{' '}
        <Link to="/login" className={styles.link}>
          Login
        </Link>
      </p>
    </form>
  );
};

export default ForgotPasswordForm;
