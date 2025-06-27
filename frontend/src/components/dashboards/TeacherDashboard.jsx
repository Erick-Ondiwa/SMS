import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserFromToken } from '../../utils/Auth';
import { logout } from '../../utils/authService';
import styles from './TeacherDashboard.module.css';

const TeacherDashboard = () => {
  const user = getUserFromToken();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      const decoded = jwtDecode(token);
      const roles = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      if (!roles?.includes('Teacher')) {
        return navigate('/unauthorized');
      }
    } catch (error) {
      navigate('/login');
    }
  }, [navigate, user]);

  const displayName =
    user?.firstName || user?.userName || user?.email || 'Teacher';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Welcome, {displayName}!</h1>
      <p className={styles.info}>This is your teacher dashboard.</p>
      
      {/* Add more teacher-specific content here if needed */}
      
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default TeacherDashboard;
