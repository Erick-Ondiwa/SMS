import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AssignmentsPage.module.css';
import AssignmentCard from './AssignmentCard';
import AssignmentFormModal from './AssignmentFormModal';
import AssignmentViewModal from './AssignmentViewModal';

import { getUserFromToken } from '../../../utils/auth';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    const token = localStorage.getItem('token');
    const user = getUserFromToken();
    const res = await axios.get(`${baseURL}/api/assignment/my/${user.userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAssignments(res.data);
  };

  const handleDelete = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${baseURL}/api/assignment/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(prev => prev.filter(a => a.assignmentId !== assignmentId));
    } catch (err) {
      alert('Failed to delete assignment.');
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>📄 My Assignments</h2>
        <button onClick={() => setShowForm(true)} className={styles.newBtn}>➕ Create Assignment</button>
      </div>

      <div className={styles.cardGrid}>
        {assignments.map((a) => (
          <AssignmentCard
            key={a.assignmentId}
            assignment={a}
            onView={() => setSelectedAssignment(a)}
            onShare={() => alert('Share functionality goes here')}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {showForm && (
        <AssignmentFormModal
          onClose={() => {
            setShowForm(false);
            fetchAssignments();
          }}
        />
      )}

      {selectedAssignment && (
        <AssignmentViewModal
          assignment={selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
        />
      )}
    </div>
  );
};

export default AssignmentsPage;
