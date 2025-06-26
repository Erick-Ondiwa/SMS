import React from 'react';
import styles from './StudentRow.module.css';

const StudentRow = ({ student, onEdit, onViewDetails, isAdmin }) => {
  const fullName = student.fullName || `${student.firstName ?? ''} ${student.lastName ?? ''}`.trim();
  const admissionNumber = student.admissionNumber || 'N/A';
  const gender = student.gender || 'N/A';
  const dateOfBirth =
    student.dateOfBirth && student.dateOfBirth !== '0001-01-01T00:00:00'
      ? new Date(student.dateOfBirth).toLocaleDateString()
      : 'N/A';
  const phoneNumber = student.phoneNumber || 'N/A';

  return (
    <tr className={styles.row}>
      <td className={styles.td}>{fullName || 'N/A'}</td>
      <td className={styles.td}>{admissionNumber}</td>
      <td className={styles.td}>{gender}</td>
      <td className={styles.td}>{dateOfBirth}</td>
      <td className={styles.td}>{phoneNumber}</td>
      {isAdmin && (
        <td className={styles.td}>
          <div className={styles.actions}>
            <button onClick={() => onEdit(student)} className={styles.editBtn}>
              Edit
            </button>
            <button onClick={() => onViewDetails(student)} className={styles.viewDetailsBtn}>
              View Details
            </button>
          </div>
        </td>
      )}
    </tr>
  );
};

export default StudentRow;

