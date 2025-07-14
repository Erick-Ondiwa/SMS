// src/components/student/StudentCourseCard.jsx

import React from 'react';
import styles from './StudentCourseCard.module.css';

const StudentCourseCard = ({ course }) => {
  const attendance = course.attendancePercentage ?? 0;

  return (
    <div className={styles.card}>
      <div className={styles.topRight}>
        {attendance}% Attendance
      </div>

      <h3>{course.courseCode} - {course.title}</h3>
      <p><strong>Semester:</strong> {course.semester}</p>
      <p><strong>Level:</strong> {course.level}</p>
      <p><strong>Program:</strong> {course.academicProgram?.name || 'N/A'}</p>
      <p><strong>Teacher:</strong> {course.teacher?.fullName || 'Unassigned'}</p>
      <p><strong>Status:</strong> {course.status}</p>
    </div>
  );
};

export default StudentCourseCard;
