import React from 'react';
import styles from './CourseRow.module.css';

const CourseRow = ({ course, onEdit, onViewDetails }) => (
  <tr>
    <td>{course.courseCode}</td>
    <td>{course.title}</td>
    <td>{course.academicProgram?.name || 'N/A'}</td>
    <td>{course.yearOfStudy}</td>
    <td>{course.semester}</td>
    <td>{course.teacher?.fullName || 'Unassigned'}</td>
    <td>{new Date(course.createdAt).toLocaleDateString()}</td>
    <td>{course.status}</td>
    <td>
      <div className={styles.buttonGroup}>
        <button onClick={() => onEdit(course)} className={styles.actionBtn}>
          Edit
        </button>
        <button onClick={() => onViewDetails(course)} className={styles.actionBtn}>
          View Details
        </button>
      </div>
    </td>
  </tr>
);

export default CourseRow;
