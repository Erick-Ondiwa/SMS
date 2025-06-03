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

        <section className={styles.content}>
          <p>This is the admin dashboard where you can manage users, assign roles, and view system reports.</p>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
