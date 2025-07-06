import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './TeacherCourses.module.css';
import AttendanceOverview from '../attendance/AttendanceOverview';


import { getUserFromToken } from '../../../utils/auth';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showOverview, setShowOverview] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.courseId || null);


  const user = getUserFromToken();

  useEffect(() => {
    fetchAssignedCourses();
  }, []);

  const fetchAssignedCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${baseURL}/api/teachers/my-courses/${user.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data || []);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudents = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${baseURL}/api/courses/${courseId}/enrollments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const course = courses.find(c => c.courseId === courseId);
      setSelectedCourse({ ...course, students: res.data });
    } catch (err) {
      console.error('Failed to load students:', err);
    }
  };

  return (
  <div className={styles.container}>
    <div className={styles.headerRow}>
      <h2>📚 My Assigned Courses</h2>
    </div>

    {loading ? (
      <p>Loading courses...</p>
    ) : courses.length === 0 ? (
      <p>You have not been assigned any courses yet.</p>
    ) : (
      <div className={styles.cardGrid}>
        {courses.map((course) => (
         <div key={course.courseId} className={styles.card}>
            <p className={styles.program}>{course.academicProgram?.name || 'N/A'}</p>
          
            {/* === Title + Top-Right Button Row === */}
            <div className={styles.cardHeader}>
              <h3 className={styles.courseTitle}>
                {course.courseCode}: {course.title}
              </h3>
              <button
                className={styles.attendanceBtn}
                onClick={() => {
                  setSelectedCourseId(course.courseId);
                  setShowOverview(true);
                }}
              >
                Check Attendance
              </button>
            </div>
          
            <p className={styles.level}><strong>Year:</strong> {course.level}</p>
            <p className={styles.semester}><strong>Semester:</strong> {course.semester}</p>
            <p className={styles.students}><strong>Enrolled Students:</strong> {course.totalStudents || 0}</p>
          
            <button
              className={styles.viewBtn}
              onClick={() => handleViewStudents(course.courseId)}
            >
              View Enrolled Students
            </button>
          </div>
       
        ))}
      </div>

    )}

    {/* Render Attendance Overview Modal if needed */}
    {showOverview && (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <button className={styles.closeBtn} onClick={() => setShowOverview(false)}>✖</button>
          <AttendanceOverview courseId={selectedCourseId} onMarkAttendance={() => {}} />
        </div>
      </div>
    )}

      
      {/* Modal for enrolled students */}
      {selectedCourse && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>{selectedCourse.title} - Enrolled Students</h3>
            <table className={styles.modalTable}>
              <thead>
                <tr>
                  <th>Admission No.</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Year</th>
                </tr>
              </thead>
              <tbody>
                {selectedCourse.students.length > 0 ? (
                  selectedCourse.students.map((s) => (
                    <tr key={s.studentId}>
                      <td>{s.admissionNumber || 'N/A'}</td>
                      <td>{`${s.firstName} ${s.lastName}`}</td>
                      <td>{s.email || 'N/A'}</td>
                      <td>{s.yearOfStudy || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No students enrolled.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <button
              className={styles.closeModalBtn}
              onClick={() => setSelectedCourse(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCourses;
