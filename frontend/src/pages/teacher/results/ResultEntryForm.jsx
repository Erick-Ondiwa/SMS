// src/components/results/ResultEntryForm.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ResultEntryForm.module.css';

const baseURL = import.meta.env.VITE_API_URL;

const ResultEntryForm = ({ course, onBack }) => {
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEnrolledStudents();
  }, []);

  const fetchEnrolledStudents = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${baseURL}/api/courses/${course.courseId}/enrollments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
      alert('❌ Failed to load enrolled students.');
    }
  };

  const handleChange = (studentId, field, value) => {
    setScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    const token = localStorage.getItem('token');

    const payload = students.map(s => {
      const cat = scores[s.studentId]?.cat || 0;
      const exam = scores[s.studentId]?.exam || 0;

      return {
        studentId: s.studentId,
        courseId: course.courseId,
        catScore: cat,
        assignmentScore: 0, // Add logic here if you're using assignments
        examScore: exam
      };
    });

    try {
      await axios.post(`${baseURL}/api/results`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Results saved successfully.");
    } catch (err) {
      console.error('Result submission error:', err.response?.data || err);
      alert("❌ Failed to save results.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <h3>Enter Results for {course.courseCode} : {course.title}</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Adm No</th>
            <th>Full Name</th>
            <th>CAT (30%)</th>
            <th>Exam (70%)</th>
            <th>Total (%)</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => {
            const studentScore = scores[s.studentId] || {};
            const cat = studentScore.cat || 0;
            const exam = studentScore.exam || 0;
            const total = cat + exam;

            return (
              <tr key={s.studentId}>
                <td>{s.admissionNumber}</td>
                <td>{`${s.firstName} ${s.lastName}`}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={cat}
                    onChange={(e) => handleChange(s.studentId, 'cat', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="70"
                    value={exam}
                    onChange={(e) => handleChange(s.studentId, 'exam', e.target.value)}
                  />
                </td>
                <td><strong>{total}</strong></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className={styles.actions}>
        <button onClick={onBack}>⬅️ Back</button>
        <button onClick={handleSubmit} disabled={saving}>✅ Save Results</button>
      </div>
    </div>
  );
};

export default ResultEntryForm;


// // src/components/results/ResultEntryForm.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import styles from './ResultEntryForm.module.css';

// const baseURL = import.meta.env.VITE_API_URL;

// const ResultEntryForm = ({ course, onBack }) => {
//   const [students, setStudents] = useState([]);
//   const [scores, setScores] = useState({});
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     fetchEnrolledStudents();
//   }, []);

//   const fetchEnrolledStudents = async () => {
//     const token = localStorage.getItem('token');
//     const res = await axios.get(`${baseURL}/api/courses/${course.courseId}/enrollments`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     setStudents(res.data);
//   };

//   const handleChange = (studentId, field, value) => {
//     setScores(prev => ({
//       ...prev,
//       [studentId]: {
//         ...prev[studentId],
//         [field]: parseFloat(value) || 0
//       }
//     }));
//   };

//   const handleSubmit = async () => {
//     setSaving(true);
//     const token = localStorage.getItem('token');

//     const payload = {
//       courseId: course.courseId,
//       results: students.map(s => {
//         const cat = scores[s.studentId]?.cat || 0;
//         const exam = scores[s.studentId]?.exam || 0;
//         return {
//           StudentId: s.studentId, 
//           Cat: cat,
//           Exam: exam,
//           Score: cat + exam
//         };
//       })
//     };

//     console.log(JSON.stringify(payload))

//     try {
//       await axios.post(`${baseURL}/api/results`, payload, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       alert("✅ Results saved successfully.");
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to save results.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className={styles.formWrapper}>
//       <h3>Enter Results for {course.courseCode} : {course.title}</h3>
//       <table className={styles.table}>
//         <thead>
//           <tr>
//             <th>Adm No</th>
//             <th>Full Name</th>
//             <th>CAT (30%)</th>
//             <th>Exam (70%)</th>
//             <th>Total (%)</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.map(s => {
//             const studentScore = scores[s.studentId] || {};
//             const cat = studentScore.cat || 0;
//             const exam = studentScore.exam || 0;
//             const total = cat + exam;

//             return (
//               <tr key={s.studentId}>
//                 <td>{s.admissionNumber}</td>
//                 <td>{`${s.firstName} ${s.lastName}`}</td>
//                 <td>
//                   <input
//                     type="number"
//                     min="0"
//                     max="30"
//                     value={cat}
//                     onChange={(e) => handleChange(s.studentId, 'cat', e.target.value)}
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="number"
//                     min="0"
//                     max="70"
//                     value={exam}
//                     onChange={(e) => handleChange(s.studentId, 'exam', e.target.value)}
//                   />
//                 </td>
//                 <td><strong>{total}</strong></td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>

//       <div className={styles.actions}>
//         <button onClick={onBack}>⬅️ Back</button>
//         <button onClick={handleSubmit} disabled={saving}>✅ Save Results</button>
//       </div>
//     </div>
//   );
// };

// export default ResultEntryForm;
