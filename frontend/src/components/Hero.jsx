import React from 'react';
import styles from './Hero.module.css';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.text}>
          <h1 className={styles.title}>
            Empowering Education <br /> with Smart Management
          </h1>
          <p className={styles.subtitle}>
            Manage students, staff, attendance, and academics—all in one place.
          </p>
          <div className={styles.buttons}>
            <Link to="/register" className={styles.primaryBtn}>Get Started</Link>
            <Link to="/learn-more" className={styles.secondaryBtn}>Learn More</Link>
          </div>
        </div>

        <div className={styles.image}>
          <img
            src="/assets/hero-illustration.svg"
            alt="School dashboard illustration"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
