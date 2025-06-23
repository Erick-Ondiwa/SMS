import React, { useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { getUserFromToken } from '../../utils/Auth';
import { logout } from '../../utils/authService';
import styles from './StudentDashboard.module.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = getUserFromToken();

  const displayName =
    user?.firstName || user?.userName || user?.email || 'Student';

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
    <div className={styles.dashboard}>
      {/* Left Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>Student Panel</h2>
        <nav className={styles.nav}>
          <ul>
            <li><NavLink to="dashboard" className={({ isActive }) => isActive ? styles.active : ''}>Dashboard</NavLink></li>
            <li><NavLink to="courses" className={({ isActive }) => isActive ? styles.active : ''}>My Courses</NavLink></li>
            <li><NavLink to="profile" className={({ isActive }) => isActive ? styles.active : ''}>Profile</NavLink></li>
            <li><NavLink to="documents" className={({ isActive }) => isActive ? styles.active : ''}>Documents</NavLink></li>
          </ul>
        </nav>
      </aside>

      {/* Right Content */}
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.userInfo}>
            <span className={styles.welcome}>Welcome, {displayName}</span>
            <img
              src={user?.profilePictureUrl || '/default-avatar.png'}
              alt="Profile"
              className={styles.profilePic}
            />
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </header>

        <div className={styles.mainContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
