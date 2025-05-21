import React from 'react';
import styles from './Features.module.css';
import { FaUserCheck, FaChartLine, FaUsers } from 'react-icons/fa';

const features = [
  {
    title: 'Student Attendance',
    description: 'Track student attendance in real-time and generate insightful reports.',
    icon: <FaUserCheck size={48} color="#1e3a8a" />,
  },
  {
    title: 'Academic Performance',
    description: 'Easily manage grades and assessments with performance dashboards.',
    icon: <FaChartLine size={48} color="#1e3a8a" />,
  },
  {
    title: 'Parent Engagement',
    description: 'Connect parents with updates on student progress, attendance, and communication.',
    icon: <FaUsers size={48} color="#1e3a8a" />,
  },
];

const Features = () => {
  return (
    <section className={styles.features}>
      <h2 className={styles.heading}>System Highlights</h2>
      <div className={styles.grid}>
        {features.map((feature, idx) => (
          <div key={idx} className={styles.card}>
            <div className={styles.icon}>{feature.icon}</div>
            <h3 className={styles.title}>{feature.title}</h3>
            <p className={styles.description}>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;


// import React from 'react';
// import styles from './Features.module.css';

// const features = [
//   {
//     title: 'Student Attendance',
//     description: 'Track student attendance in real-time and generate insightful reports.',
//     icon: '/assets/attendance-icon.svg',
//   },
//   {
//     title: 'Academic Performance',
//     description: 'Easily manage grades and assessments with performance dashboards.',
//     icon: '/assets/performance-icon.svg',
//   },
//   {
//     title: 'Parent Engagement',
//     description: 'Connect parents with updates on student progress, attendance, and communication.',
//     icon: '/assets/parent-icon.svg',
//   },
// ];

// const Features = () => {
//   return (
//     <section className={styles.features}>
//       <h2 className={styles.heading}>System Highlights</h2>
//       <div className={styles.grid}>
//         {features.map((feature, idx) => (
//           <div key={idx} className={styles.card}>
//             <img src={feature.icon} alt={feature.title} className={styles.icon} />
//             <h3 className={styles.title}>{feature.title}</h3>
//             <p className={styles.description}>{feature.description}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Features;
