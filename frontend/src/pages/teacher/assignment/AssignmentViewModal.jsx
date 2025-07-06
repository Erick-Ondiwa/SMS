import React from 'react';
import styles from './AssignmentViewModal.module.css';

const AssignmentViewModal = ({ assignment, onClose }) => {
  const fileUrl = assignment.filePath?.startsWith('http')
    ? assignment.filePath
    : `${import.meta.env.VITE_API_URL || 'https://localhost:7009'}/${assignment.filePath}`;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{assignment.title}</h3>
        <p><strong>Course:</strong> {assignment.courseCode}</p>
        <p><strong>Uploaded File:</strong></p>
        {assignment.filePath ? (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className={styles.viewBtn}>
            📄 Open File
          </a>
        ) : (
          <p>No file uploaded.</p>
        )}

        <button className={styles.closeBtn} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AssignmentViewModal;
