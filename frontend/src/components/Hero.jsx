import React from 'react';
import styles from './Hero.module.css';
import { GraduationCap, ShieldCheck, Users, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Empowering Education Through Technology</h1>
          <p className={styles.heroSubtitle}>
            A smart, secure, and efficient student management system for schools.
          </p>
          <Link to="/register" className={styles.ctaBtn}>Get Started</Link>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <Users size={40} className={styles.icon} />
          <h3>Empowered Learning</h3>
          <p>Students stay on top of grades, attendance, and assignments all in one place.</p>
        </div>

        <div className={styles.featureCard}>
          <ShieldCheck size={40} className={styles.icon} />
          <h3>Parental Insights</h3>
          <p>Parents can monitor their child's academic progress and stay connected with teachers.</p>
        </div>

        <div className={styles.featureCard}>
          <BookOpen size={40} className={styles.icon} />
          <h3>Streamlined Administration</h3>
          <p>Admins and staff manage enrollment, roles, and records with minimal effort.</p>
        </div>
      </section>


      {/* <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} EduTrack. All rights reserved.</p>
      </footer> */}
    </div>
  );
};

export default Hero;


// import React from 'react';
// import styles from './Hero.module.css';
// import { Link } from 'react-router-dom';

// const Hero = () => {
//   return (
//     <section className={styles.hero}>
//       <div className={styles.content}>
//         <div className={styles.text}>
//           <h1 className={styles.title}>
//             Empowering Education <br /> with Smart Management
//           </h1>
//           <p className={styles.subtitle}>
//             Manage students, staff, attendance, and academics—all in one place.
//           </p>
//           <div className={styles.buttons}>
//             <Link to="/register" className={styles.primaryBtn}>Get Started</Link>
//             <Link to="/learn-more" className={styles.secondaryBtn}>Learn More</Link>
//           </div>
//         </div>

//         <div className={styles.image}>
//           <img
//             src="/assets/hero-illustration.svg"
//             alt="School dashboard illustration"
//           />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;
