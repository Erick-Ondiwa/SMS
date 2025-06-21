// CourseRow.jsx
import React from 'react';
import styles from './CourseRow.module.css';

const CourseRow = ({ course, onEdit }) => (
  <tr>
    <td>{course.courseCode}</td>
    <td>{course.title}</td>
    <td>{course.level}</td>
    <td>{course.semester}</td>
    <td>{course.teacher?.fullName || 'Unassigned'}</td>
    <td>{new Date(course.createdAt).toLocaleDateString()}</td>
    <td>{course.status}</td>
    <td>
      <button onClick={() => onEdit(course)} className={styles.editBtn}>
        Edit
      </button>
    </td>
  </tr>
);

export default CourseRow;
