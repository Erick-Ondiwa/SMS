import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { Menu, X } from 'lucide-react';

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
        </div>

        <div className={styles.menuIcon} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
