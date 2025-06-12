import React from 'react';
import styles from './TeacherRow.module.css';

const TeacherRow = ({ teacher, onEdit, onDelete, isAdmin }) => {
  return (
    <tr className={styles.row}>
      <td className={styles.cell}>{teacher.fullName}</td>
      <td className={styles.cell}>{teacher.email || 'N/A'}</td>
      <td className={`${styles.cell} ${styles.right}`}>{teacher.phoneNumber || 'N/A'}</td>

      {isAdmin && (
        <td className={`${styles.cell} ${styles.actions}`}>
          <button
            onClick={() => onEdit(teacher)}
            className={`${styles.btn} ${styles.editBtn}`}
            aria-label={`Edit ${teacher.fullName}`}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(teacher.teacherId)}
            className={`${styles.btn} ${styles.deleteBtn}`}
            aria-label={`Delete ${teacher.fullName}`}
          >
            Delete
          </button>
        </td>
      )}
    </tr>
  );
};

export default TeacherRow;
