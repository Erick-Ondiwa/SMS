// src/components/results/StudentResultsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './StudentResultsPage.module.css';
import { getUserFromToken } from '../../../utils/auth';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const StudentResultsPage = () => {
  const [results, setResults] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = getUserFromToken();
  const stage = student?.yearOfStudy && student?.semester
  ? `Y${student.yearOfStudy}S${student.semester}`
  : 'N/A';

  useEffect(() => {
    fetchStudentResults();
    fetchStudentDetails();
  }, [user?.userId]);

  const fetchStudentDetails = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${baseURL}/api/students/user/${user.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudent(response.data);
    } catch (err) {
      setError('Unable to fetch your student profile.');
    } finally {
      setLoading(false);
    }
  };



  const fetchStudentResults = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${baseURL}/api/results/student/${user.userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(res.data);
    } catch (err) {
      setError('Failed to fetch results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>🎓 My Academic Results</h2>

      {loading && <p className={styles.info}>Loading your results...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && results.length === 0 && (
        <p className={styles.info}>No results found yet. Please check back later.</p>
      )}

      {student && (
        <div className={styles.studentDetails}>
          <p><strong>Full Name:</strong> {student?.fullName}</p>
          <p><strong>Registration No:</strong> {student?.admissionNumber}</p>
          <p><strong>Program:</strong> {student.academicProgram.name}</p>
          <p><strong>Year of Study:</strong> {stage}</p>
          <p><strong>Semester:</strong> {student.semester}</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <table className={styles.resultsTable}>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Grade</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.resultId}>
                <td>{r.courseCode}</td>
                <td>{r.courseTitle}</td>
                <td>{r.grade}</td>
                <td>{r.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentResultsPage;
