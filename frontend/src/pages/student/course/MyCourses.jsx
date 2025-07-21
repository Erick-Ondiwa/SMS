// src/components/student/MyCourses.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './MyCourses.module.css';
import StudentCourseCard from './StudentCourseCard';
import { getUserFromToken } from '../../../utils/auth';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = getUserFromToken();

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${baseURL}/api/students/my-courses/${user.userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch attendance for each course
      const updatedCourses = await Promise.all(
        res.data.map(async (course) => {
          try {
            const attendanceRes = await axios.get(
              `${baseURL}/api/attendance/student/${user.userId}/course/${course.courseId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return {
              ...course,
              attendancePercentage: attendanceRes.data.percentage
            };
          } catch (err) {
            return { ...course, attendancePercentage: 0 };
          }
        })
      );

      setCourses(updatedCourses);
    } catch (err) {
      setError('Failed to fetch courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>📚 My Enrolled Courses</h2>
      {loading && <p className={styles.info}>Loading courses...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && courses.length === 0 && <p className={styles.info}>You are not enrolled in any courses.</p>}

      <div className={styles.cardGrid}>
        {courses.map((course) => (
          <StudentCourseCard key={course.courseId} course={course} />
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
