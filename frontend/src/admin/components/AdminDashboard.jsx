import styles from '../pages/AdminDashboard.module.css';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { getUserFromToken } from '../../utils/Auth';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = getUserFromToken();

  const displayName =
    user?.firstName || user?.userName || user?.email || 'Admin';

  useEffect(() => {
    if (!user) {
      localStorage.clear();
      return navigate('/login');
    }

    const roles = user?.roles || [];
    if (!roles.includes('Admin')) {
      return navigate('/unauthorized');
    }
  }, [navigate, user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>Admin Panel</h2>
        <nav className={styles.nav}>
          <ul>
            <li><NavLink to="dashboard" className={({ isActive }) => isActive ? styles.active : ''}>Dashboard</NavLink></li>
            <li><NavLink to="users" className={({ isActive }) => isActive ? styles.active : ''}>Users</NavLink></li>
            {/* <li><NavLink to="roles" className={({ isActive }) => isActive ? styles.active : ''}>Role Management</NavLink></li> */}
            <li><NavLink to="students" className={({ isActive }) => isActive ? styles.active : ''}>Students</NavLink></li>
            <li><NavLink to="teachers" className={({ isActive }) => isActive ? styles.active : ''}>Teachers</NavLink></li>
            <li><NavLink to="courses" className={({ isActive }) => isActive ? styles.active : ''}>Courses</NavLink></li>
          </ul>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.adminInfo}>
            <span className={styles.profileIcon}>👤</span>
            <h1 className={styles.welcomeText}>
              Welcome, {displayName}
            </h1>
          </div>
          <button onClick={handleLogout} className={styles.logout}>Logout</button>
        </header>

        <div className={styles.mainContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
