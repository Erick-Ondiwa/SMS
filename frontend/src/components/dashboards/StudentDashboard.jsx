import React from 'react';
import styles from './StudentDashboard.module.css';
import { Bell, Calendar, BookOpen, FileText, User } from 'lucide-react';

const StudentDashboard = () => {
  const user = {
    name: "Erick O. Ondiwa",
    program: "BSc. Computer Science",
    gpa: "3.7",
    balance: "Ksh 5,000",
  };

  const schedule = [
    { time: "8:00 AM", course: "Database Systems", room: "Lab 3" },
    { time: "11:00 AM", course: "Operating Systems", room: "Room 12" },
  ];

  const assignments = [
    { title: "AI Assignment 1", due: "May 30, 2025" },
    { title: "Web App Project", due: "June 3, 2025" },
  ];

  const quickLinks = [
    { label: "My Timetable", icon: <Calendar size={24} />, link: "#" },
    { label: "My Courses", icon: <BookOpen size={24} />, link: "#" },
    { label: "My Results", icon: <FileText size={24} />, link: "#" },
    { label: "My Profile", icon: <User size={24} />, link: "#" },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.welcome}>Welcome back, {user.name} 👋</h1>
      <p className={styles.subText}>{user.program}</p>

      {/* Top Cards */}
      <div className={styles.cardGrid}>
        <div className={styles.card}>
          <div>
            <h2>Academic Progress</h2>
            <p>GPA: <strong>{user.gpa}</strong></p>
          </div>
          <BookOpen color="#2563eb" size={32} />
        </div>

        <div className={styles.card}>
          <div>
            <h2>Fee Balance</h2>
            <p>{user.balance}</p>
          </div>
          <FileText color="#16a34a" size={32} />
        </div>

        <div className={styles.card}>
          <div>
            <h2>Notifications</h2>
            <p>2 new updates</p>
          </div>
          <Bell color="#eab308" size={32} />
        </div>
      </div>

      {/* Schedule */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>📅 Today’s Schedule</h3>
        <ul>
          {schedule.map((s, i) => (
            <li key={i} className={styles.listItem}>
              <span>{s.time} - {s.course}</span>
              <span className="text-sm text-gray-500">{s.room}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Assignments */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>📝 Assignments Due</h3>
        <ul>
          {assignments.map((a, i) => (
            <li key={i} className={styles.listItem}>
              <span>{a.title}</span>
              <span className="text-sm text-red-500">Due {a.due}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Links */}
      <div className={styles.linkGrid}>
        {quickLinks.map((item, i) => (
          <a href={item.link} className={styles.linkItem} key={i}>
            {item.icon}
            <span className={styles.linkText}>{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
