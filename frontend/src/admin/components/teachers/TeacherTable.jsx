import React from 'react';
import styles from './TeacherTable.module.css';

const TeacherTable = ({ teachers, onEdit, onDelete, isAdmin }) => {
  return (
    <table className={styles.table}>
      <thead className={styles.thead}>
        <tr>
          <th className={styles.th}>Name</th>
          <th className={styles.th}>Email</th>
          <th className={styles.th}>Phone</th>
          <th className={styles.th}>Department</th>
          <th className={styles.th}>Address</th>
          {isAdmin && <th className={styles.th}>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {teachers.map((teacher) => (
          <tr key={teacher.teacherId} className={styles.row}>
            <td className={styles.td}>{teacher.fullName || 'N/A'}</td>
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
        ))}
      </tbody>
    </table>
  );
};

export default TeacherTable;
