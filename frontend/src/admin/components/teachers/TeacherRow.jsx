import React from 'react';
import styles from './TeacherRow.module.css';

const TeacherRow = ({ teacher, onEdit, onDelete, isAdmin }) => {
  const fullName = student.fullName || `${student.firstName ?? ''} ${student.lastName ?? ''}`.trim();

  return (
    <tr className={styles.row}>
      <td className={styles.td}>{fullName || 'N/A'}</td>
      <td className={styles.td}>{teacher.email || 'N/A'}</td>
      <td className={styles.td}>{teacher.phoneNumber || 'N/A'}</td>
      <td className={styles.td}>{teacher.department || 'N/A'}</td>
      <td className={styles.td}>{teacher.address || 'N/A'}</td>

      {isAdmin && (
        <td className={styles.td}>
          <div className={styles.actions}>
            <button onClick={() => onEdit(teacher)} className={styles.editBtn}>
              Edit
            </button>
            <button onClick={() => onDelete(teacher.teacherId)} className={styles.deleteBtn}>
              Delete
            </button>
          </div>
        </td>
      )}
    </tr>
  );
};

export default TeacherRow;

