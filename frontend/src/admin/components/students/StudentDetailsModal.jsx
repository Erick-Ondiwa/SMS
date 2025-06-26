import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './StudentDetailsModal.module.css';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const StudentDetailsModal = ({ student, onClose, onDelete }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    if (student?.studentId) {
      fetchEnrolledCourses(student.studentId);
    }
  }, [student]);

  const fetchEnrolledCourses = async (studentId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${baseURL}/api/students/${studentId}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnrolledCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch enrolled courses:', err);
    }
  };

  const handleRemoveCourse = async (courseId) => {
    const confirm = window.confirm('Are you sure you want to remove this course from the student?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${baseURL}/api/students/${student.studentId}/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchEnrolledCourses(student.studentId); // Refresh list after removal
    } catch (err) {
      console.error('Failed to remove course:', err);
      alert('Failed to remove course. Try again.');
    }
  };

  const fullName =
    student.fullName || `${student.firstName ?? ''} ${student.lastName ?? ''}`.trim();

  const dateOfBirth =
    student.dateOfBirth && student.dateOfBirth !== '0001-01-01T00:00:00'
      ? new Date(student.dateOfBirth).toLocaleDateString()
      : 'N/A';

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Student Details</h2>

        <div className={styles.info}>
          <p><strong>Full Name:</strong> {fullName}</p>
          <p><strong>Admission Number:</strong> {student.admissionNumber || 'N/A'}</p>
          <p><strong>Email:</strong> {student.email || 'N/A'}</p>
          <p><strong>Phone Number:</strong> {student.phoneNumber || 'N/A'}</p>
          <p><strong>Gender:</strong> {student.gender || 'N/A'}</p>
          <p><strong>Date of Birth:</strong> {dateOfBirth}</p>
          <p><strong>Year of Study:</strong> {student.yearOfStudy ?? 'N/A'}</p>
          <p><strong>Semester:</strong> {student.semester ?? 'N/A'}</p>
          <p><strong>Program:</strong> {student.academicProgram?.name || 'N/A'}</p>
        </div>

        <div className={styles.enrolledCourses}>
          <h3>Enrolled Courses</h3>
          {enrolledCourses.length === 0 ? (
            <p>No courses enrolled.</p>
          ) : (
            <table className={styles.courseTable}>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Title</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {enrolledCourses.map(course => (
                  <tr key={course.courseId}>
                    <td>{course.courseCode}</td>
                    <td>{course.title}</td>
                    <td>
                      <button
                        className={styles.removeBtn}
                        onClick={() => handleRemoveCourse(course.courseId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.actions}>
          <button onClick={() => onDelete(student.studentId)} className={styles.deleteBtn}>Delete Student</button>
          <button onClick={onClose} className={styles.closeBtn}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;
