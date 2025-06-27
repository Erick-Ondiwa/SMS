import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './MyCourses.module.css';
import { getUserFromToken } from '../../utils/Auth';
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
      setCourses(res.data);
    } catch (err) {
      setError('Failed to fetch courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>My Enrolled Courses</h2>
      {loading && <p className={styles.info}>Loading courses...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && courses.length === 0 && <p className={styles.info}>You are not enrolled in any courses.</p>}

      {!loading && courses.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Title</th>
              <th>Semester</th>
              <th>Level</th>
              <th>Program</th>
              <th>Teacher</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.courseId}>
                <td>{course.courseCode}</td>
                <td>{course.title}</td>
                <td>{course.semester}</td>
                <td>{course.level}</td>
                <td>{course.academicProgram?.name || 'N/A'}</td>
                <td>{course.teacher?.fullName || 'Unassigned'}</td>
                <td>{course.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyCourses;
