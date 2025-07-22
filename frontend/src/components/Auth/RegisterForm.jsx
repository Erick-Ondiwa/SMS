import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './RegisterForm.module.css';
// const RegisterForm = ({ isAdminCreating = false, role = 'Student', onRegisterComplete }) => {


  const RegisterForm = ({ isAdminCreating = false, role = 'Student', onRegisterComplete }) => {

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

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const {
      username,
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phoneNumber
    } = formData;

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (!isStrongPassword(password)) {
      setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
      return;
    }

    try {
      const payload = {
        username,
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        role
      };

      const { data } = await axios.post('https://localhost:7009/api/Auth/register', payload);

      if (isAdminCreating && typeof onRegisterComplete === 'function') {
        const userId = data.userId;
        const fullName = `${firstName} ${lastName}`;
        onRegisterComplete(userId, {
          fullName,
          firstName,
          lastName,
          phoneNumber,
          email
        });
      } else {
        localStorage.setItem('token', data.token);
        navigate('/login');
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0] ||
        'Registration failed. Try again.';
      setError(message);
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h2>{isAdminCreating ? `Add New ${role}` : 'Create Account'}</h2>

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
        {isAdminCreating ? 'Register & Proceed' : 'Register'}
      </button>

      {!isAdminCreating && (
        <p className={styles.linkText}>
          Already have an account?{' '}
          <Link to="/login" className={styles.link}>
            Login
          </Link>
        </p>
      )}
    </form>
  );
};

export default RegisterForm;
