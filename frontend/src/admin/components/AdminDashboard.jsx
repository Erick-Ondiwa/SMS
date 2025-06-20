import styles from '../pages/AdminDashboard.module.css';
import { useNavigate,  NavLink, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [error, setError] = useState('');

  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    staff: 0,
    courses: 0
  });

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

    fetchDashboardData();
    fetchActivities();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [studentsRes, teachersRes, staffRes, coursesRes] = await Promise.all([
        axios.get(`${baseURL}/api/students`, { headers }),
        axios.get(`${baseURL}/api/teachers`, { headers }),
        // axios.get(`${baseURL}/api/staff`, { headers }), // Adjust if staff is under another endpoint
        // axios.get(`${baseURL}/api/courses`, { headers }),
      ]);

      setStats({
        students: studentsRes.data.length,
        teachers: teachersRes.data.length,
        // staff: staffRes.data.length,
        // courses: coursesRes.data.length
      });
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoadingActivities(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(`${baseURL}/api/activity-logs`, { headers });
      setActivities(response.data || []);
    } catch (err) {
      console.error('Failed to load activities:', err);
      setError('Unable to fetch recent activities.');
    } finally {
      setLoadingActivities(false);
    }
  };

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
          <ul>
            <li><NavLink to="dashboard" className={({ isActive }) => isActive ? styles.active : ''}>Dashboard</NavLink></li>
            <li><NavLink to="users" className={({ isActive }) => isActive ? styles.active : ''}> User Management </NavLink></li>
            <li><NavLink to="roles" className={({ isActive }) => isActive ? styles.active : ''}>Role Management</NavLink></li>
            <li><NavLink to="students" className={({ isActive }) => isActive ? styles.active : ''}>Students</NavLink></li>
            <li><NavLink to="teachers" className={({ isActive }) => isActive ? styles.active : ''}>Teachers</NavLink></li>
            <li><NavLink to="courses" className={({ isActive }) => isActive ? styles.active : ''}>Courses</NavLink></li>
          </ul>

          </ul>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Welcome Admin</h1>
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
