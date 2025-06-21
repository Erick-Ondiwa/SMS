import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './CourseDetailsModal.module.css';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const CourseDetailsModal = ({ course, onClose, onRefresh }) => {
  const [students, setStudents] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  useEffect(() => {
    if (course?.courseId) {
      fetchStudents();
      fetchEnrollments();
    }
  }, [course]);

  const fetchStudents = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${baseURL}/api/students`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStudents(res.data);
  };

  const fetchEnrollments = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${baseURL}/api/courses/${course.courseId}/enrollments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEnrolled(res.data);
  };

  const handleEnroll = async () => {
    if (!selectedStudentId) return;
    const token = localStorage.getItem('token');
    await axios.post(`${baseURL}/api/courses/${course.courseId}/enroll`, 
      { studentId: selectedStudentId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSelectedStudentId('');
    fetchEnrollments();
  };

  const handleUnenroll = async (studentId) => {
    const confirm = window.confirm('Unenroll this student?');
    if (!confirm) return;

    const token = localStorage.getItem('token');
    await axios.delete(`${baseURL}/api/courses/${course.courseId}/unenroll/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchEnrollments();
  };

  const handleDeleteCourse = async () => {
    const confirm = window.confirm('Are you sure you want to delete this course?');
    if (!confirm) return;

    const token = localStorage.getItem('token');
    await axios.delete(`${baseURL}/api/courses/${course.courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    onRefresh?.();
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Course Details</h2>
        <p><strong>Code:</strong> {course.courseCode}</p>
        <p><strong>Title:</strong> {course.title}</p>
        <p><strong>Description:</strong> {course.description || '—'}</p>
        <p><strong>Level:</strong> {course.level}</p>
        <p><strong>Semester:</strong> {course.semester}</p>
        <p><strong>Status:</strong> {course.status || '—'}</p>
        <p><strong>Teacher:</strong> {course.teacher?.fullName || 'Unassigned'}</p>
        <p><strong>Enrolled Students:</strong> {enrolled.length}</p>

        <div className={styles.enrollSection}>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
          >
            <option value="">-- Select Student --</option>
            {students.map((s) => (
              <option key={s.studentId} value={s.studentId}>
                {`${s.fullName}`}
              </option>
            ))}
          </select>
          <button onClick={handleEnroll} className={styles.enrollBtn}>Enroll</button>
        </div>

        <div className={styles.enrolledList}>
          <h4>Enrolled Students</h4>
          <ul>
            {enrolled.map((s) => (
              <li key={s.studentId}>
                {`${s.firstName} ${s.lastName}`} ({s.email}){' '}
                <button onClick={() => handleUnenroll(s.studentId)} className={styles.unenrollBtn}>
                  Unenroll
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.actions}>
          <button onClick={handleDeleteCourse} className={styles.deleteBtn}>
            Delete Course
          </button>
          <button onClick={onClose} className={styles.closeBtn}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsModal;
