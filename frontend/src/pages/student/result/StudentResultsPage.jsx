// src/components/results/StudentResultsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './StudentResultsPage.module.css';
import { getUserFromToken } from '../../../utils/auth';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const StudentResultsPage = () => {
  const [results, setResults] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = getUserFromToken();

  useEffect(() => {
    fetchStudentResults();
  }, []);

  const fetchStudentResults = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${baseURL}/api/results/student/${user.userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.length > 0) {
        setStudentInfo({
          fullName: `${res.data[0].studentFullName}`,
          regNo: res.data[0].admissionNumber,
          program: res.data[0].academicProgram,
          year: res.data[0].yearOfStudy,
          semester: res.data[0].semester,
        });
      }
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

      {studentInfo && (
        <div className={styles.studentDetails}>
          <p><strong>Full Name:</strong> {studentInfo.fullName}</p>
          <p><strong>Registration No:</strong> {studentInfo.regNo}</p>
          <p><strong>Program:</strong> {studentInfo.program}</p>
          <p><strong>Year of Study:</strong> {studentInfo.year}</p>
          <p><strong>Semester:</strong> {studentInfo.semester}</p>
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
