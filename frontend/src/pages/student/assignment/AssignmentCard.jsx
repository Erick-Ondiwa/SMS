// src/components/student/StudentAssignmentCard.jsx

import React from 'react';
import styles from './AssignmentCard.module.css';

const AssignmentCard = ({ assignment }) => {
  return (
    <div className={styles.card}>
      <h3>{assignment.title}</h3>

      <p><strong>Course:</strong> {assignment.courseCode}</p>

      <p><strong>Uploaded:</strong> {new Date(assignment.createdAt).toLocaleDateString()}</p>

      <p><strong>File:</strong>{' '}
        {assignment.filePath ? (
          <a
            href={assignment.filePath}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            📄 View File
          </a>
        ) : (
          'No file attached.'
        )}
      </p>
    </div>
  );
};

export default AssignmentCard;
