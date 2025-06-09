import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3 className={styles.logo}>EduTrack</h3>
          <p className={styles.text}>
            Empowering schools with efficient digital management tools.
          </p>
        </div>

        <div className={styles.section}>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="/login">Login</a></li>
          </ul>
        </div>

        <div className={styles.section}>
          <h4>Contact</h4>
          <p>Email: support@edutrack.com</p>
          <p>Phone: +254 700 123 456</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} EduTrack. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
