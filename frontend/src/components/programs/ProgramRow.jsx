import React from 'react';
import styles from './ProgramRow.module.css';

const ProgramRow = ({ program, onEdit, onDelete }) => (
  <tr className={styles.row}>
    <td className={styles.cell}>{program.name}</td>
    <td className={styles.cell}>{program.category}</td>
    <td className={styles.cell}>{program.durationInYears}</td>
    <td className={`${styles.cell}`}>
      <div className={styles.actions}>
        <button onClick={onEdit} className={styles.editButton}>
          Edit
        </button>
        <button onClick={onDelete} className={styles.deleteButton}>
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default ProgramRow;
