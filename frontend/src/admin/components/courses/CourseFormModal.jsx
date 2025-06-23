import React, { useEffect, useState } from 'react';
import styles from './CourseFormModal.module.css';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const CourseFormModal = ({ course, onClose, onRefresh }) => {
  const isEditMode = !!course?.courseId;

  const [formData, setFormData] = useState({
    courseCode: '',
    title: '',
    description: '',
    creditHours: 3,
    semester: '',
    level: '',
    status: 'Active',
    teacherId: '',
    programId: '' // ✅ Add programId
  });

  const [teachers, setTeachers] = useState([]);
  const [programs, setPrograms] = useState([]); // ✅ Program list

  useEffect(() => {
    if (course) {
      setFormData({ ...course, programId: course.program?.programId || '' }); // ✅ Preload programId
    }
    fetchTeachers();
    fetchPrograms(); // ✅ Fetch programs
  }, [course]);

  const fetchTeachers = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${baseURL}/api/teachers`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTeachers(res.data);
  };

  const fetchPrograms = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${baseURL}/api/programs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPrograms(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (isEditMode) {
        await axios.put(`${baseURL}/api/courses/${course.courseId}`, formData, { headers });
      } else {
        await axios.post(`${baseURL}/api/courses`, formData, { headers });
      }
      onRefresh();
      onClose();
    } catch (err) {
      console.error('Failed to save course:', err);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{isEditMode ? 'Edit Course' : 'Add New Course'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input name="courseCode" placeholder="Course Code" value={formData.courseCode} onChange={handleChange} required />
          <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
          <input type="number" name="creditHours" placeholder="Credit Hours" value={formData.creditHours} onChange={handleChange} min={1} max={10} />
          <input name="semester" placeholder="Semester" value={formData.semester} onChange={handleChange} />
          <input name="level" placeholder="Level" value={formData.level} onChange={handleChange} />

          {/* ✅ Program selection */}
          <select name="programId" value={formData.programId} onChange={handleChange} required>
            <option value="">-- Select Program --</option>
            {programs.map(p => (
              <option key={p.programId} value={p.programId}>
                {p.name}
              </option>
            ))}
          </select>

          {/* ✅ Teacher selection */}
          <select name="teacherId" value={formData.teacherId} onChange={handleChange}>
            <option value="">-- Assign Teacher --</option>
            {teachers.map(t => (
              <option key={t.teacherId} value={t.teacherId}>{t.fullName}</option>
            ))}
          </select>

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <div className={styles.actions}>
            <button type="submit">{isEditMode ? 'Update Course' : 'Add Course'}</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseFormModal;


// // CourseFormModal.jsx
// import React, { useEffect, useState } from 'react';
// import styles from './CourseFormModal.module.css';
// import axios from 'axios';

// const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

// const CourseFormModal = ({ course, onClose, onRefresh }) => {
//   const isEditMode = !!course?.courseId;

//   const [formData, setFormData] = useState({
//     courseCode: '',
//     title: '',
//     description: '',
//     creditHours: 3,
//     semester: '',
//     level: '',
//     status: 'Active',
//     teacherId: ''
//   });

//   const [teachers, setTeachers] = useState([]);

//   useEffect(() => {
//     if (course) {
//       setFormData({ ...course });
//     }
//     fetchTeachers();
//   }, [course]);

//   const fetchTeachers = async () => {
//     const token = localStorage.getItem('token');
//     const res = await axios.get(`${baseURL}/api/teachers`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     setTeachers(res.data);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     const headers = { Authorization: `Bearer ${token}` };

//     try {
//       if (isEditMode) {
//         await axios.put(`${baseURL}/api/courses/${course.courseId}`, formData, { headers });
//       } else {
//         await axios.post(`${baseURL}/api/courses`, formData, { headers });
//       }
//       onRefresh();
//       onClose();
//     } catch (err) {
//       console.error('Failed to save course:', err);
//     }
//   };

//   return (
//     <div className={styles.modalOverlay}>
//       <div className={styles.modalContent}>
//         <h2>{isEditMode ? 'Edit Course' : 'Add New Course'}</h2>
//         <form onSubmit={handleSubmit} className={styles.form}>
//           <input name="courseCode" placeholder="Course Code" value={formData.courseCode} onChange={handleChange} required />
//           <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
//           <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
//           <input type="number" name="creditHours" placeholder="Credit Hours" value={formData.creditHours} onChange={handleChange} min={1} max={10} />
//           <input name="semester" placeholder="Semester" value={formData.semester} onChange={handleChange} />
//           <input name="level" placeholder="Level" value={formData.level} onChange={handleChange} />
          
//           <select name="teacherId" value={formData.teacherId} onChange={handleChange}>
//             <option value="">-- Assign Teacher --</option>
//             {teachers.map(t => (
//               <option key={t.teacherId} value={t.teacherId}>{t.fullName}</option>
//             ))}
//           </select>

//           <select name="status" value={formData.status} onChange={handleChange}>
//             <option value="Active">Active</option>
//             <option value="Inactive">Inactive</option>
//           </select>

//           <div className={styles.actions}>
//             <button type="submit">{isEditMode ? 'Update Course' : 'Add Course'}</button>
//             <button type="button" onClick={onClose}>Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CourseFormModal;
