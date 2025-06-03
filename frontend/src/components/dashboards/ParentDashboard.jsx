import React from 'react';
import styles from './ParentDashboard.module.css';
import { FileText, MessageSquare, CreditCard, Users } from 'lucide-react';

const ParentDashboard = () => {
  const parent = {
    name: "Mr. Ochieng Ondiwa",
    childName: "Erick O. Ondiwa",
    class: "3rd Year, Computer Science",
    feeBalance: "Ksh 5,000",
    attendance: "94%",
    performance: "B+ Average",
  };

  const announcements = [
    { title: "Parents-Teachers Meeting", date: "May 28, 2025" },
    { title: "Mid-Term Exams Start", date: "June 5, 2025" },
  ];

  const quickLinks = [
    { label: "Report Card", icon: <FileText size={24} />, link: "#" },
    { label: "Fee Payment", icon: <CreditCard size={24} />, link: "#" },
    { label: "Messages", icon: <MessageSquare size={24} />, link: "#" },
    { label: "Teachers", icon: <Users size={24} />, link: "#" },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Welcome, {parent.name} 👨‍👧</h1>
      <p className={styles.subText}>
        Monitoring: <strong>{parent.childName}</strong> ({parent.class})
      </p>

      {/* Stat Cards */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <div>
            <h3>Performance</h3>
            <p><strong>{parent.performance}</strong></p>
          </div>
          <FileText color="#3b82f6" size={32} />
        </div>

        <div className={styles.card}>
          <div>
            <h3>Attendance</h3>
            <p><strong>{parent.attendance}</strong></p>
          </div>
          <Users color="#10b981" size={32} />
        </div>

        <div className={styles.card}>
          <div>
            <h3>Fee Balance</h3>
            <p>{parent.feeBalance}</p>
          </div>
          <CreditCard color="#f59e0b" size={32} />
        </div>
      </div>

      {/* Announcements */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>📢 Important Announcements</h2>
        <ul>
          {announcements.map((a, index) => (
            <li key={index} className={styles.listItem}>
              <span>{a.title}</span>
              <span className="text-sm text-gray-500">{a.date}</span>
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

export default ParentDashboard;
