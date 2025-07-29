import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import styles from './CourseDetailsModal.module.css';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const CourseDetailsModal = ({ course, onClose, onRefresh }) => {
  const [students, setStudents] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  useEffect(() => {
    if (course?.courseId) {
      fetchStudents();
      fetchEnrollments();
    }
  }, [course]);

  const fetchStudents = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${baseURL}/api/courses/${course.courseId}/eligible-students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to fetch eligible students:', err);
    }
  };

  // const fetchStudents = async () => {
  //   const token = localStorage.getItem('token');
  //   const res = await axios.get(`${baseURL}/api/students`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   setStudents(res.data);
  // };

  const fetchEnrollments = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${baseURL}/api/courses/${course.courseId}/enrollments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEnrolled(res.data);
  };

  const handleEnroll = async () => {
    if (selectedStudentIds.length === 0) return;

    const token = localStorage.getItem('token');
    try {
      await Promise.all(
        selectedStudentIds.map((id) =>
          axios.post(
            `${baseURL}/api/courses/${course.courseId}/enroll`,
            { studentId: id },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );
      setSelectedStudentIds([]);
      fetchEnrollments();
    } catch (err) {
      console.error('Error enrolling students:', err);
    }
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

  const studentOptions = students.map((s) => ({
    value: s.studentId,
    label: s.fullName || `${s.firstName ?? ''} ${s.lastName ?? ''}`.trim(),
  }));

  const availableOptions = studentOptions.filter(
    (opt) => !enrolled.some((e) => e.studentId === opt.value)
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Course Details</h2>
        <p><strong>Code:</strong> {course.courseCode}</p>
        <p><strong>Title:</strong> {course.title}</p>
        <p><strong>Program:</strong> {course.academicProgram?.name || '—'}</p>
        <p><strong>Description:</strong> {course.description || '—'}</p>
        <p><strong>Year Of Study:</strong> {course.yearOfStudy}</p>
        <p><strong>Semester:</strong> {course.semester}</p>
        <p><strong>Status:</strong> {course.status || '—'}</p>
        <p><strong>Teacher:</strong> {course.teacher?.fullName || 'Unassigned'}</p>
        <p><strong>Enrolled Students:</strong> {enrolled.length}</p>

        <div className={styles.enrollSection}>
          <label>Select Students to Enroll</label>

          <Select
            options={availableOptions}
            isMulti
            value={studentOptions.filter((opt) => selectedStudentIds.includes(opt.value))}
            onChange={(selected) => {
              const selectedIds = selected ? selected.map((opt) => opt.value) : [];
              setSelectedStudentIds(selectedIds);
            }}
            className={styles.multiSelect}
            placeholder="Search and select students..."
          />

          <button onClick={handleEnroll} className={styles.enrollBtn}>
            Enroll Selected
          </button>
        </div>

        <div className={styles.enrolledList}>
          <h4>Enrolled Students</h4>
          {enrolled.length === 0 ? (
            <p>No students enrolled in this course.</p>
          ) : (
            <table className={styles.enrolledTable}>
              <thead>
                <tr>
                  <th>Admission No</th>
                  <th>Full Name</th>
                  <th>Enrollment Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {enrolled.map((s) => (
                  <tr key={s.studentId}>
                    <td>{s.admissionNumber || 'N/A'}</td>
                    <td>{`${s.firstName ?? ''} ${s.lastName ?? ''}`.trim()}</td>
                    <td>{new Date(s.enrollmentDate).toISOString().split('T')[0]}</td>
                    <td>
                      <button
                        onClick={() => handleUnenroll(s.studentId)}
                        className={styles.unenrollBtn}
                      >
                        Unenroll
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
