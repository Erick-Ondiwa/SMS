import React from 'react';
import CourseRow from './CourseRow';
import styles from './CourseTable.module.css';

const CourseTable = ({ courses, onEdit, onViewDetails }) => (
  <table className={styles.table}>
    <thead>
      <tr>
        <th>Course Code</th>
        <th>Title</th>
        <th>Program</th> {/* ✅ Added */}
        <th>Level</th>
        <th>Semester</th>
        <th>Teacher</th>
        <th>Created</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {courses.map((course) => (
        <CourseRow
          key={course.courseId}
          course={course}
          onEdit={onEdit}
          onViewDetails={onViewDetails}
        />
      ))}
    </tbody>
  </table>
);

export default CourseTable;
