import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styles from './TeachersDashboard.module.css';
import { getUserFromToken } from '../../utils/Auth';

const TeachersDashboard = () => {
  const user = getUserFromToken();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // redirect to login
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Teacher Panel</h2>
        <nav className={styles.navLinks}>
          <NavLink to="/teacher" className={styles.link} end>
            📊 Dashboard
          </NavLink>
          <NavLink to="/teacher/my-courses" className={styles.link}>
            📚 My Courses
          </NavLink>
          <NavLink to="/teacher/profile" className={styles.link}>
            👤 Profile
          </NavLink>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main Area */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Welcome, {user?.firstName || 'Teacher'} 👋</h1>
        </header>

        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default TeachersDashboard;
