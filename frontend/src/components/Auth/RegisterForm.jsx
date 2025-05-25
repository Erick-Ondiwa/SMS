// components/Auth/RegisterForm.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './RegisterForm.module.css';

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Student',
  });

  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post('https://localhost:5001/api/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      // Optionally save the token
      const token = response.data.token;
      localStorage.setItem('token', token);

      // Redirect to dashboard or login
      navigate('/login');
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Try again.');
      }
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h2>Create Account</h2>

      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
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

      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className={styles.input}
      >
        <option value="Student">Student</option>
        <option value="Teacher">Teacher</option>
        <option value="Parent">Parent</option>
      </select>

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

