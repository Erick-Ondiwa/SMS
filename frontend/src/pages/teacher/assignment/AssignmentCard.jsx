import React from 'react';
import styles from './AssignmentCard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';

const AssignmentCard = ({ assignment, onView, onShare, onDelete }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <h3>{assignment.title}</h3>

      <button className={styles.topRightButton} onClick={() => onShare(assignment.assignmentId)}>
        <FontAwesomeIcon icon={faShareAlt} />
      </button>
    </div>

    <p><strong>Course:</strong> {assignment.courseCode}</p>
    <p><strong>File:</strong> 
      {assignment.fileName ? (
        <a 
          href={`https://localhost:7009/uploads/${assignment.fileName}`} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          {assignment.fileName}
        </a>
      ) : (
        'No File'
      )}
    </p>

    <div className={styles.actions}>
      <button onClick={onView}>
        <FontAwesomeIcon icon={faEye} /> View
      </button>

      <button className={styles.deleteButton} onClick={() => onDelete(assignment.assignmentId)}>
        <FontAwesomeIcon icon={faTrash} /> Delete
      </button>
    </div>
  </div>
);

export default AssignmentCard;
