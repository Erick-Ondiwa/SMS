import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For redirecting after login

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

 

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const response = await axios.post('https://localhost:7009/api/Auth/login', {
      email: formData.email,
      password: formData.password,
    });

    const { token, user } = response.data;

    // Decode token to get roles
    const decodedToken = jwtDecode(token);
    const roles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    // Save token and user
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    console.log('Roles:', roles);

    // Role-based redirect
    if (roles?.includes('Admin')) {
      navigate('/admin/dashboard');
    } else if(roles?.includes('Student')){
      navigate('/student/dashboard');
    } else if(roles?.includes('Teacher')){
      navigate('/teacher/dashboard');
    } else if(roles?.includes('Parent')){
      navigate('/parent/dashboard');
    }else{
      setError(`Role ${ roles} does not exist `)
    }
  } catch (err) {
    if (err.response && err.response.status === 401) {
      setError('Invalid email or password.');
    } else {
      setError('An error occurred. Please try again later.');
    }
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

