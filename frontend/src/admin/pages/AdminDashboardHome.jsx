import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const DashboardHome = () => {
  const [stats, setStats] = useState({ students: 0, teachers: 0, programs: 0, courses: 0 });
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchStats = async () => {
      try {
        const [students, teachers, programs, courses] = await Promise.all([
          axios.get(`${baseURL}/api/students`, { headers }),
          axios.get(`${baseURL}/api/teachers`, { headers }),
          axios.get(`${baseURL}/api/programs`, { headers }),
          axios.get(`${baseURL}/api/courses`, { headers })
        ]);
        setStats({
          students: students.data.length,
          teachers: teachers.data.length,
          programs: programs.data.length,
          courses: courses.data.length
        });
      } catch (err) {
        console.error('Failed to load stats:', err);
      }
    };

    const fetchActivities = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/activity-logs`, { headers });
        setActivities(res.data || []);
      } catch (err) {
        setError('Unable to fetch recent activities.');
      }
    };

    fetchStats();
    fetchActivities();
  }, []);

  return (
    <>
      <section className={styles.overview}>
        <h2>Overview</h2>
        <p>Monitor user activity, manage roles, and keep your school data up to date.</p>
      </section>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}><h3>Students</h3><p>{stats.students}</p></div>
        <div className={styles.statCard}><h3>Teachers</h3><p>{stats.teachers}</p></div>
        <div className={styles.statCard}><h3>Programs</h3><p>{stats.programs}</p></div>
        <div className={styles.statCard}><h3>Courses</h3><p>{stats.courses}</p></div>
      </div>

      <div className={styles.activitySection}>
        <h3>Recent Activities</h3>
        {error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <ul>
            {activities.map((act, idx) => (
              <li key={idx}>🕓 {new Date(act.timestamp).toLocaleString()} — {act.description}</li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.quickActions}>
        <Link to="/register" className={styles.actionButton}>
          ➕ Add New User
        </Link>
        <Link to="/admin/courses" className={styles.actionButton}>
          📚 Create Course
        </Link>
        <Link to="/admin/teachers" className={styles.actionButton}>
          👩‍🏫 Assign Teacher
        </Link>
      </div>
    </>
  );
};

export default DashboardHome;
