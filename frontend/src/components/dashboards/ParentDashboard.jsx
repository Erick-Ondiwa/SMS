import React from 'react';
import styles from './ParentDashboard.module.css';
import { LogOut, Users, Mail, Calendar } from 'lucide-react';
import { getUserFromToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const ParentDashboard = () => {
  const user = getUserFromToken();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      const decoded = jwtDecode(token);
      const roles = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      if (!roles?.includes('Parent')) {
        return navigate('/unauthorized');
      }
    } catch (error) {
      navigate('/login');
    }
  }, [navigate, user]);
  const navigate = useNavigate();

  const displayName = user?.firstName || user?.userName || 'Parent';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.welcome}>Welcome, {displayName} 👋</h1>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className={styles.cardGrid}>
        <div className={styles.card}>
          <Users className={styles.icon} size={28} />
          <div>
            <h2 className={styles.cardTitle}>Children</h2>
            <p className={styles.cardDesc}>View and monitor your children</p>
          </div>
        </div>

        <div className={styles.card}>
          <Mail className={styles.icon} size={28} />
          <div>
            <h2 className={styles.cardTitle}>Messages</h2>
            <p className={styles.cardDesc}>Check school communications</p>
          </div>
        </div>

        <div className={styles.card}>
          <Calendar className={styles.icon} size={28} />
          <div>
            <h2 className={styles.cardTitle}>Attendance</h2>
            <p className={styles.cardDesc}>Track student attendance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
