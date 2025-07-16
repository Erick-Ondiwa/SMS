// src/components/results/TeacherResultsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ResultEntryForm from './ResultEntryForm';
import ResultReviewTable from './ResultReviewTable';
import styles from './TeacherResultsPage.module.css';
import { getUserFromToken } from '../../../utils/auth';

const baseURL = import.meta.env.VITE_API_URL;

const TeacherResultsPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [mode, setMode] = useState(''); // 'entry' or 'review'
  const user = getUserFromToken();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${baseURL}/api/teachers/my-courses/${user.userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCourses(res.data);
  };

  const handleEntry = (course) => {
    setSelectedCourse(course);
    setMode('entry');
  };

  const handleReview = (course) => {
    setSelectedCourse(course);
    setMode('review');
  };

  const handleBack = () => {
    setSelectedCourse(null);
    setMode('');
  };

  return (
    <div className={styles.container}>
      {!selectedCourse && (
        <>
          <h2>📚 My Courses</h2>
          <div className={styles.cardGrid}>
            {courses.map((course) => (
              <div className={styles.card} key={course.courseId}>
                <h3>{course.courseCode} - {course.title}</h3>
                <p><strong>Semester:</strong> {course.semester}</p>
                <p><strong>Level:</strong> {course.level}</p>
                <div className={styles.actions}>
                  <button onClick={() => handleEntry(course)}>✏️ Enter Results</button>
                  <button onClick={() => handleReview(course)}>📊 Review Results</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedCourse && mode === 'entry' && (
        <ResultEntryForm course={selectedCourse} onBack={handleBack} />
      )}

      {selectedCourse && mode === 'review' && (
        <ResultReviewTable courseId={selectedCourse.courseId} onBack={handleBack} />
      )}
    </div>
  );
};

export default TeacherResultsPage;



// // src/components/results/TeacherResultsPage.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import styles from './TeacherResultsPage.module.css';
// import { getUserFromToken } from '../../../utils/auth';
// import ResultEntryForm from './ResultEntryForm';

// const baseURL = import.meta.env.VITE_API_URL;

// const TeacherResultsPage = () => {
//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const teacher = getUserFromToken();

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     const token = localStorage.getItem('token');
//     const res = await axios.get(`${baseURL}/api/teachers/my-courses/${teacher.userId}`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     setCourses(res.data);
//     setLoading(false);
//   };

//   return (
//     <div className={styles.container}>
//       <h2>📚 My Courses for Results Entry</h2>

//       {loading ? <p>Loading courses...</p> :
//         <ul className={styles.courseList}>
//           {courses.map(course => (
//             <li key={course.courseId}>
//               <button onClick={() => setSelectedCourse(course)}>
//                 {course.courseCode} - {course.title}
//               </button>
//             </li>
//           ))}
//         </ul>
//       }

//       {selectedCourse && (
//         <ResultEntryForm course={selectedCourse} onBack={() => setSelectedCourse(null)} />
//       )}
//     </div>
//   );
// };

// export default TeacherResultsPage;
