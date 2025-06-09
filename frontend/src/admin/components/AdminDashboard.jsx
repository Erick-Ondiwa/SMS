import styles from './AdminDashboard.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      const decoded = jwtDecode(token);
      const roles = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      if (!roles?.includes('Admin')) {
        return navigate('/unauthorized');
      }
    } catch (error) {
      navigate('/login');
    }
  }, [navigate]);

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
            <li><a href="/admin/dashboard">Dashboard</a></li>
            <li><a href="/admin/users">Manage Users</a></li>
            <li><a href="/admin/roles">Assign Roles</a></li>
            <li><a href="/admin/reports">Reports</a></li>
          </ul>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Welcome Admin</h1>
          <button onClick={handleLogout} className={styles.logout}>Logout</button>
        </header>

        <div className={styles.mainContent}>

        <section className={styles.overview}>
          <h2>Overview</h2>
          <p>Monitor user activity, manage roles, and keep your school data up to date.</p>
        </section>


          {/* Stat Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Students</h3>
              <p>620</p>
            </div>
            <div className={styles.statCard}>
              <h3>Teachers</h3>
              <p>45</p>
            </div>
            <div className={styles.statCard}>
              <h3>Staff</h3>
              <p>10</p>
            </div>
            <div className={styles.statCard}>
              <h3>Courses</h3>
              <p>38</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className={styles.activitySection}>
            <h3>Recent Activities</h3>
            <ul>
              <li>🟢 John Doe (Student) registered</li>
              <li>📘 "Physics 101" course added</li>
              <li>⚠️ No teacher assigned to "Biology 204"</li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className={styles.quickActions}>
            <button className={styles.actionButton}>➕ Add New User</button>
            <button className={styles.actionButton}>📚 Create Course</button>
            <button className={styles.actionButton}>👩‍🏫 Assign Teacher</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
