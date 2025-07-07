import React, { useEffect, useState } from 'react';
import styles from './StudentHomePage.module.css';
import axios from 'axios';
import { getUserFromToken } from '../../utils/auth';
import { FaUserCircle } from 'react-icons/fa';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const StudentHomePage = () => {
  const user = getUserFromToken();
  const [student, setStudent] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.userId) {
      setError("User ID not found in token.");
      setLoading(false);
      return;
    }

    const fetchStudentDetails = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${baseURL}/api/students/user/${user.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudent(response.data);
        setFormData(response.data);
      } catch (err) {
        setError('Unable to fetch your student profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [user?.userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${baseURL}/api/students/${student.studentId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudent(formData);
      setEditing(false);
    } catch (err) {
      alert('Update failed');
    }
  };

  const stage = student?.yearOfStudy && student?.semester
    ? `Y${student.yearOfStudy}S${student.semester}`
    : 'N/A';

  return (
    <div className={styles.home}>
      {loading && <p className={styles.info}>Loading your profile...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        <>
          <h2 className={styles.welcome}>Welcome back, {student?.fullName || user?.firstName || 'Student'}!</h2>

          <div className={styles.content}>
            {/* Left: Profile Section */}
            <div className={styles.leftSection}>
              <div className={styles.profileIcon}>
                <FaUserCircle size={80} />
              </div>
              <h3 className={styles.fullName}>{student?.fullName}</h3>
              <p><strong>Program:</strong> {student?.academicProgram?.name || 'N/A'}</p>
              <p><strong>Stage:</strong> {stage}</p>
            </div>

            {/* Right: Editable Personal Info */}
            <div className={styles.rightSection}>
              <h3>Personal Information</h3>
              <div className={styles.detailsGrid}>
                {[
                  { label: 'Admission No', name: 'admissionNumber' },
                  { label: 'Email', name: 'email' },
                  { label: 'Phone', name: 'phoneNumber' },
                  { label: 'Address', name: 'address' },
                  { label: 'Gender', name: 'gender' },
                  { label: 'Date of Birth', name: 'dateOfBirth', type: 'date' }
                ].map(field => (
                  <div key={field.name}>
                    <strong>{field.label}:</strong>
                    {editing ? (
                      <input
                        type={field.type || 'text'}
                        name={field.name}
                        value={formData?.[field.name] || ''}
                        onChange={handleChange}
                      />
                    ) : (
                      <span> {student?.[field.name] || '—'}</span>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={editing ? handleUpdate : () => setEditing(true)}
                className={styles.updateButton}
              >
                {editing ? 'Save Changes' : 'Update Info'}
              </button>
            </div>
          </div>

          {/* Bottom: Quick Actions */}
          <section className={styles.quickLinks}>
            <h3>Quick Actions</h3>
            <div className={styles.actions}>
             <button
                className={styles.actionBtn}
                onClick={() => window.location.href = '/student/courses'}
              >
                📚 View Enrolled Courses
              </button>

              <button
                className={styles.actionBtn}
                onClick={() => window.location.href = '/student/attendance'}
              >
                📅 View Attendance
              </button>
             
              <button
                className={styles.actionBtn}
                onClick={() => window.location.href = '/student/assignments'}
              >
                📝 Check Assignments
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default StudentHomePage;

