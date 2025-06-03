import React from 'react';
import styles from './TeacherDashboard.module.css';
import { BookOpen, ClipboardList, MessageSquare, UploadCloud, CalendarCheck } from 'lucide-react';

const TeacherDashboard = () => {
  const lecturer = {
    name: "Dr. Achieng Onyango",
    department: "School of Computing and Informatics",
    courses: [
      { code: "CSC 321", name: "Data Structures", enrolled: 60 },
      { code: "CSC 415", name: "Artificial Intelligence", enrolled: 45 },
    ],
  };

  const quickLinks = [
    { label: "Upload Grades", icon: <UploadCloud size={24} />, link: "#" },
    { label: "Post Assignment", icon: <ClipboardList size={24} />, link: "#" },
    { label: "View Messages", icon: <MessageSquare size={24} />, link: "#" },
    { label: "Mark Attendance", icon: <CalendarCheck size={24} />, link: "#" },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Welcome, {lecturer.name} 👩‍🏫</h1>
      <p className={styles.subText}>
        Department: {lecturer.department}
      </p>

      {/* Stat Cards */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <div>
            <h3>Courses Taught</h3>
            <p><strong>{lecturer.courses.length}</strong></p>
          </div>
          <BookOpen color="#3b82f6" size={32} />
        </div>

        <div className={styles.card}>
          <div>
            <h3>Total Students</h3>
            <p><strong>{
              lecturer.courses.reduce((acc, c) => acc + c.enrolled, 0)
            }</strong></p>
          </div>
          <ClipboardList color="#10b981" size={32} />
        </div>
      </div>

      {/* Courses Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>📚 Your Courses</h2>
        <ul className={styles.courseList}>
          {lecturer.courses.map((course, idx) => (
            <li key={idx} className={styles.courseItem}>
              <span>{course.code} - {course.name}</span>
              <span>{course.enrolled} students</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Links */}
      <div className={styles.quickLinks}>
        {quickLinks.map((link, index) => (
          <a href={link.link} className={styles.link} key={index}>
            {link.icon}
            <div className={styles.linkText}>{link.label}</div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;
