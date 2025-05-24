// components/Auth/LoginForm.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      // TODO: Add API call to authenticate
      console.log('Logging in with', formData);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className={styles.input}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className={styles.input}
        required
      />
      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={styles.button}>
        Login
      </button>

      <div className={styles.links}>
        <Link to="/forgot-password" className={styles.link}>
          Forgot Password?
        </Link>
        <p>
          Don’t have an account?{' '}
          <Link to="/register" className={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;

