import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserFromToken } from '../../utils/Auth';
import styles from './TeacherHome.module.css'; // optional styling

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const TeacherHome = () => {
  const [teacherStats, setTeacherStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    upcomingClasses: [],
  });

  const user = getUserFromToken();
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${baseURL}/api/teachers/dashboard-summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeacherStats(res.data);
    } catch (err) {
      console.error('Failed to fetch teacher dashboard stats:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>👋 Welcome Back, {user.firstName}</h2>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <h3>{teacherStats.totalCourses}</h3>
          <p>Courses Assigned</p>
        </div>
        <div className={styles.statCard}>
          <h3>{teacherStats.totalStudents}</h3>
          <p>Students Taught</p>
        </div>
      </div>

      <div className={styles.upcoming}>
        <h3>📅 Upcoming Classes</h3>
        {teacherStats.upcomingClasses.length === 0 ? (
          <p>No upcoming classes scheduled.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Course</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {teacherStats.upcomingClasses.map((session, index) => (
                <tr key={index}>
                  <td>{session.courseTitle}</td>
                  <td>{new Date(session.date).toLocaleDateString()}</td>
                  <td>{session.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.linksRow}>
        <h1 className={styles.quickTitle}>Quick Actions</h1>
        <div className={styles.actionButtons}>
          <button
            className={styles.actionBtn}
            onClick={() => window.location.href = '/teacher/my-courses'}
          >
            📚 View My Courses
          </button>
          <button
            className={styles.actionBtn}
            onClick={() => window.location.href = '/teacher/profile'}
          >
            👤 View Profile
          </button>
        </div>
      </div>

    </div>
  );
};

export default TeacherHome;
