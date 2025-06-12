import React from 'react';
import styles from './StudentRow.module.css';

const StudentRow = ({ student, onEdit, onDelete, isAdmin }) => {
  const { fullName, admissionNumber, gender, dateOfBirth, phoneNumber } = student;

  return (
    <tr className={styles.row}>
      <td className={styles.td}>{fullName}</td>
      <td className={styles.td}>{admissionNumber}</td>
      <td className={styles.td}>{gender}</td>
      <td className={styles.td}>{new Date(dateOfBirth).toLocaleDateString()}</td>
      <td className={styles.td}>{phoneNumber}</td>
      {isAdmin && (
        <td className={styles.td}>
          <div className={styles.actions}>
            <button onClick={() => onEdit(student)} className={styles.editBtn}>
              Edit
            </button>
            <button onClick={() => onDelete(student.studentId)} className={styles.deleteBtn}>
              Delete
            </button>
          </div>
        </td>
      )}
    </tr>
  );
};

export default StudentRow;
