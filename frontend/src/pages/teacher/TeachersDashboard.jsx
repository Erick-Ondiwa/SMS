import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styles from './TeachersDashboard.module.css';
import { getUserFromToken } from '../../utils/auth';
import { FaUserCircle } from 'react-icons/fa';

const TeachersDashboard = () => {
  const user = getUserFromToken();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [showLogout, setShowLogout] = useState(false);
  const profileRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


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
            Grades
          </NavLink>
          <NavLink to="/teacher/assignments" className={styles.link}>
            Assignments
          </NavLink>
          <NavLink to="/teacher/profile" className={styles.link}>
            Announcements
          </NavLink>
          <NavLink to="/teacher/profile" className={styles.link}>
            Settings
          </NavLink>
          {/* <button onClick={handleLogout} className={styles.logoutBtn}>
            🚪 Logout
          </button> */}
        </nav>
      </aside>

      {/* Main Area */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.userInfo} ref={profileRef}>
            <div
              className={styles.profileWrapper}
              onClick={() => setShowLogout((prev) => !prev)}
            >
              <FaUserCircle size={40} className={styles.profileIcon} />
              <span className={styles.displayName}>
                {user?.firstName || 'Teacher'}
              </span>
            </div>

            {showLogout && (
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            )}
          </div>
        </header>

        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default TeachersDashboard;
