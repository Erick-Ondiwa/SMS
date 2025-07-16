// src/components/results/ResultReviewTable.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ResultReviewTable.module.css';

const baseURL = import.meta.env.VITE_API_URL;

const ResultReviewTable = ({ courseId }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${baseURL}/api/results/course/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setResults(res.data);
  };

  return (
    <div className={styles.wrapper}>
      <h4>Submitted Results</h4>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Adm No</th>
            <th>Name</th>
            <th>Score</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {results.map(r => (
            <tr key={r.studentId}>
              <td>{r.admissionNumber}</td>
              <td>{r.studentFullName}</td>
              <td>{r.totalScore}</td>
              <td>{r.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultReviewTable;
