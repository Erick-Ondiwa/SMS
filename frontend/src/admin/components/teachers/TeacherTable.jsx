import React from 'react';
import TeacherRow from './TeacherRow';
import styles from './TeacherTable.module.css';

const TeacherTable = ({ teachers, onEdit, onDelete, isAdmin }) => {
  return (
    <div className={styles.wrapper} role="region" aria-labelledby="teacher-heading">
      <h2 id="teacher-heading" className={styles.srOnly}>Teacher Table</h2>

      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Email</th>
            <th className={`${styles.th} ${styles.right}`}>Phone</th>
            {isAdmin && <th className={styles.th}>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {teachers.length > 0 ? (
            teachers.map((teacher) => (
              <TeacherRow
                key={teacher.teacherId}
                teacher={teacher}
                onEdit={onEdit}
                onDelete={onDelete}
                isAdmin={isAdmin}
              />
            ))
          ) : (
            <tr>
              <td colSpan={isAdmin ? 4 : 3} className={styles.emptyRow}>
                No teachers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherTable;
