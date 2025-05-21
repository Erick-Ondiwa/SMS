import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>EduTrack</div>

        <div className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}>
          <Link to="/" className={styles.link}>Home</Link>
          <a href="#features" className={styles.link}>Features</a>
          <a href="#contact" className={styles.link}>Contact</a>
          <Link to="/login" className={styles.button}>Login</Link>
          <Link to="/register" className={styles.outlineButton}>Register</Link>
        </div>

        <div className={styles.menuIcon} onClick={() => setIsOpen(!isOpen)}>
          <div className={isOpen ? styles.barOpen : styles.bar}></div>
          <div className={isOpen ? styles.barOpen : styles.bar}></div>
          <div className={isOpen ? styles.barOpen : styles.bar}></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
