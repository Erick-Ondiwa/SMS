import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { getUserFromToken } from '../../utils/auth';
import { logout } from '../../utils/authService';
import styles from './StudentDashboard.module.css';
import { FaUserCircle } from 'react-icons/fa';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = getUserFromToken();
  const [showLogout, setShowLogout] = useState(false);
  const profileRef = useRef();

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

  // Hide logout button when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.dashboard}>
      {/* Left Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>Student Panel</h2>
        <nav className={styles.nav}>
          <ul>
            <li>
              <NavLink to="dashboard" className={({ isActive }) => isActive ? styles.active : ''}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="courses" className={({ isActive }) => isActive ? styles.active : ''}>
                My Courses
              </NavLink>
            </li>
            <NavLink to="assignments" className={({ isActive }) => isActive ? styles.active : ''}>
                Assignments
              </NavLink>
            <li>
              <NavLink to="profile" className={({ isActive }) => isActive ? styles.active : ''}>
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink to="documents" className={({ isActive }) => isActive ? styles.active : ''}>
                Documents
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Right Content */}
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.userInfo} ref={profileRef}>
            <div onClick={() => setShowLogout(!showLogout)} className={styles.profileWrapper}>
              <FaUserCircle size={40} className={styles.profileIcon} />
              <span className={styles.displayName}>{displayName}</span>
            </div>

            {showLogout && (
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            )}
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
