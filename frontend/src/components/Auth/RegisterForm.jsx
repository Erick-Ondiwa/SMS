import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './RegisterForm.module.css';

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    const { username, email, password, confirmPassword, firstName, lastName, phoneNumber } = formData;
  
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
  
    try {
      const payload = { username, email, password, firstName, lastName, phoneNumber };
  
      const { data } = await axios.post('https://localhost:7009/api/Auth/register', payload);
  
      localStorage.setItem('token', data.token);  // Optional: usually you redirect first
      navigate('/login'); // You could also redirect to a dashboard if token is valid immediately
      
    } catch (err) {
      const message = err?.response?.data?.message || 'Registration failed. Try again.';
      setError(message);
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h2>Create Account</h2>

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
        className={styles.input}
      />

      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
        required
        className={styles.input}
      />

      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        required
        className={styles.input}
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
        className={styles.input}
      />

      <input
        type="tel"
        name="phoneNumber"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
        className={styles.input}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className={styles.input}
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        className={styles.input}
      />

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={styles.button}>
        Register
      </button>

      <p className={styles.linkText}>
        Already have an account?{' '}
        <Link to="/login" className={styles.link}>
          Login
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
