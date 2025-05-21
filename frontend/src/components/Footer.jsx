import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        <div className={styles.branding}>
          <h2 className={styles.logo}>EduSphere</h2>
          <p className={styles.tagline}>Empowering education through technology.</p>
        </div>

        <div className={styles.links}>
          <div>
            <h4 className={styles.title}>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/features">Features</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className={styles.title}>Support</h4>
            <ul>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className={styles.title}>Contact</h4>
            <ul>
              <li>Email: info@edusphere.com</li>
              <li>Phone: +254 712 345 678</li>
              <li>Location: Nairobi, Kenya</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} EduSphere. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
