import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserFromToken } from '../../utils/Auth';
import { logout } from '../../utils/authService';
import styles from './StudentDashboard.module.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = getUserFromToken();

  const displayName =
    user?.firstName || user?.userName || user?.email || 'Student';

  // ✅ Role-based protection
  useEffect(() => {
    if (!user) {
      logout();
      return navigate('/login');
    }

    const roles = user?.roles || [];

    if (!roles.includes('Student')) {
      return navigate('/unauthorized');
    }
  }, [navigate, user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Welcome, {displayName}!</h1>
      <p className={styles.info}>This is your student dashboard.</p>

      {/* More student-specific content can go here */}

      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default StudentDashboard;
