import React, { useState, useEffect } from 'react';
import styles from './AssignmentFormModal.module.css';
import axios from 'axios';
import { getUserFromToken } from '../../../utils/auth';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const AssignmentFormModal = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [file, setFile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const user = getUserFromToken();

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${baseURL}/api/teachers/my-courses/${user.userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !courseId) {
      setMessage('Please provide title and course.');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('courseId', courseId);
    if (file) formData.append('file', file);

    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(`${baseURL}/api/assignment/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('✅ Assignment uploaded successfully!');
      // Optionally reset the form
      setTitle('');
      setCourseId('');
      setFile(null);
      setTimeout(() => {
        onClose(); // Close modal after short delay
      }, 1000);
    } catch (err) {
      console.error('Upload error:', err);
      setMessage('❌ Failed to upload assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Create Assignment</h3>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Course</label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          >
            <option value="">-- Select Course --</option>
            {courses.map((c) => (
              <option key={c.courseId} value={c.courseId}>
                {c.courseCode} - {c.title}
              </option>
            ))}
          </select>

          <label>File</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />

          {message && <p className={styles.message}>{message}</p>}

          <div className={styles.actions}>
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : '✅ Submit'}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentFormModal;


// import React, { useState, useEffect } from 'react';
// import styles from './AssignmentFormModal.module.css';
// import axios from 'axios';

// import { getUserFromToken } from '../../../utils/auth';
// const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

// const AssignmentFormModal = ({ onClose }) => {
//   const [title, setTitle] = useState('');
//   const [courseId, setCourseId] = useState('');
//   const [file, setFile] = useState(null);
//   const [courses, setCourses] = useState([]);

//   const user = getUserFromToken();

//   useEffect(() => {
//     fetchMyCourses();
//   }, []);

//   const fetchMyCourses = async () => {
//     const token = localStorage.getItem('token');
//     const res = await axios.get(`${baseURL}/api/teachers/my-courses/${user.userId}`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     setCourses(res.data);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('courseId', courseId);
//     if (file) formData.append('file', file);

//     const token = localStorage.getItem('token');
//     await axios.post(`${baseURL}/api/assignments`, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data'
//       }
//     });

//     onClose();
//   };

//   return (
//     <div className={styles.overlay}>
//       <div className={styles.modal}>
//         <h3>Create Assignment</h3>
//         <form onSubmit={handleSubmit}>
//           <label>Title</label>
//           <input value={title} onChange={(e) => setTitle(e.target.value)} required />

//           <label>Course</label>
//           <select value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
//             <option value="">-- Select Course --</option>
//             {courses.map(c => (
//               <option key={c.courseId} value={c.courseId}>{c.courseCode} - {c.title}</option>
//             ))}
//           </select>

//           <label>File</label>
//           <input type="file" onChange={(e) => setFile(e.target.files[0])} />

//           <div className={styles.actions}>
//             <button type="submit">✅ Submit</button>
//             <button type="button" onClick={onClose}>❌ Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AssignmentFormModal;
