import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AssignmentCard from './AssignmentCard';
import { getUserFromToken } from '../../utils/auth';

import styles from './StudentAssignmentsPage.module.css';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const StudentAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    const student = getUserFromToken();
    const token = localStorage.getItem('token');
    const res = await axios.get(`${baseURL}/api/assignment/student/${student.userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAssignments(res.data);
  };

  return (
    <div className={styles.container}>
      <h2>📘 My Assignments</h2>
      <div className={styles.cardGrid}>
        {assignments.map((a) => (
          <AssignmentCard key={a.assignmentId} assignment={a} />
        ))}
      </div>
    </div>
  );
};

export default StudentAssignmentsPage;
