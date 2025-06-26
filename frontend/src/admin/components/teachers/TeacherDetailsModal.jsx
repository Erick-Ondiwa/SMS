import React, { useEffect, useState } from 'react';
import styles from './TeacherDetailsModal.module.css';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const TeacherDetailsModal = ({ teacher, onClose, onDelete }) => {
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (teacher?.teacherId) {
      fetchAssignedCourses();
    }
  }, [teacher]);

  const fetchAssignedCourses = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${baseURL}/api/teachers/${teacher.teacherId}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignedCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCourse = async (courseId) => {
    const confirm = window.confirm('Remove this course from the teacher?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${baseURL}/api/teachers/${teacher.teacherId}/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAssignedCourses(); // Refresh list
    } catch (err) {
      console.error('Failed to remove course:', err);
      alert('Error removing course. Try again.');
    }
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this teacher?');
    if (!confirmDelete) return;

    onDelete(teacher.teacherId);
    onClose();
  };

  const fullName = teacher.fullName || `${teacher.firstName ?? ''} ${teacher.lastName ?? ''}`.trim();

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Teacher Details</h2>

        <p><strong>Full Name:</strong> {fullName || 'N/A'}</p>
        <p><strong>Email:</strong> {teacher.email || 'N/A'}</p>
        <p><strong>Phone:</strong> {teacher.phoneNumber || 'N/A'}</p>
        <p><strong>Department:</strong> {teacher.department || 'N/A'}</p>
        <p><strong>Address:</strong> {teacher.address || 'N/A'}</p>

        <h3>Assigned Courses</h3>
        {loading ? (
          <p>Loading courses...</p>
        ) : assignedCourses.length > 0 ? (
          <table className={styles.courseTable}>
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Title</th>
                <th>Program</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignedCourses.map((course) => (
                <tr key={course.courseId}>
                  <td>{course.courseCode}</td>
                  <td>{course.title}</td>
                  <td>{course.academicProgram?.name || 'N/A'}</td>
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
        ) : (
          <p className={styles.noCourses}>No courses assigned to this teacher.</p>
        )}

        <div className={styles.actions}>
          <button onClick={handleDelete} className={styles.deleteBtn}>
            Delete Teacher
          </button>
          <button onClick={onClose} className={styles.closeBtn}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailsModal;
