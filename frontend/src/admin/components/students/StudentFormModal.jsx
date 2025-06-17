// components/students/StudentForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './StudentFormModal.module.css';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const StudentFormModal = ({ student, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    userId: student?.userId || '',
    fullName: student?.fullName || '',
    admissionNumber: student?.admissionNumber || '',
    // dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth : null,
    dateOfBirth: student?.dateOfBirth?.slice(0, 10) || '',
    gender: student?.gender || '',
    phoneNumber: student?.phoneNumber || '',
    address: student?.address || '',
    parentId: student?.parentId || '',
    photoUrl: student?.photoUrl || ''
  });

  const isEditMode = !!formData?.studentId || !!formData?.userId;


  const [parents, setParents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/api/parents`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setParents(response.data);
      } catch (err) {
        console.error('Failed to fetch parents', err);
      }
    };
    fetchParents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (student) {
        await axios.put(`${baseURL}/api/students/${student.studentId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${baseURL}/api/students`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      onRefresh();
      onClose();
    } catch (err) {
      setError('❌ Failed to save student. Make sure all required fields are selected.');
      console.error(err);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.heading}>
        {isEditMode ? 'Edit Student' : 'Add New Student'}
      </h2>
  
      {error && <div className={styles.errorMessage}>{error}</div>}
  
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Full Name</label>
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={styles.inputField}
            placeholder="Full Name"
            required
          />
        </div>
  
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Admission Number</label>
          <input
            name="admissionNumber"
            value={formData.admissionNumber}
            onChange={handleChange}
            className={styles.inputField}
            placeholder="ADM No."
            required
          />
        </div>
  
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Phone Number</label>
          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={styles.inputField}
            placeholder="Phone"
          />
        </div>
  
        {/* <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.inputField}
            placeholder="Email"
          />
        </div> */}
  
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={styles.selectField}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
  
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>
  
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Address</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={styles.inputField}
            placeholder="Address"
          />
        </div>
  
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Parent</label>
          <select
            name="parentId"
            value={formData.parentId}
            onChange={handleChange}
            className={styles.selectField}
            // required
          >
            <option value="">Select Parent</option>
            {parents.map((parent) => (
              <option key={parent.parentId} value={parent.parentId}>
                {parent.fullName}
              </option>
            ))}
          </select>
        </div>
  
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton}>
            {isEditMode ? 'Update Student' : 'Add Student'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
  
};

export default StudentFormModal;


// import React, { useState, useEffect } from 'react';
// import styles from './StudentFormModal.module.css';
// import axios from 'axios';
// import { getUserFromToken } from '../../../utils/Auth';

// const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

// const StudentFormModal = ({ student, onClose, onRefresh }) => {
//   const { user } = getUserFromToken();

//   console.log(user)

//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     admissionNumber: '',
//     dateOfBirth: '',
//     gender: '',
//     address: '',
//     phoneNumber: '',
//     photoUrl: ''
//   });

//   useEffect(() => {
//     if (student) {
//       const nameParts = (student.fullName || '').split(' ');
//       const firstName = nameParts[0] || '';
//       const lastName = nameParts.slice(1).join(' ') || '';

//       setFormData({
//         firstName,
//         lastName,
//         admissionNumber: student.admissionNumber || '',
//         dateOfBirth: student.dateOfBirth?.split('T')[0] || '',
//         gender: student.gender || '',
//         address: student.address || '',
//         phoneNumber: student.phoneNumber || '',

//         UserId: student.userId,
//         ParentId: student.ParentId || '',

//         photoUrl: student.photoUrl || ''
//       });
//     }
//   }, [student]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const payload = {
//         ...formData,
//         fullName: `${formData.firstName} ${formData.lastName}`.trim()
//       };

//       if (student) {
//         const token = localStorage.getItem('token');
//         const response = await axios.put(`${baseURL}/api/students/${student.studentId}`, payload, {
//           headers: { Authorization: `Bearer ${token}` }

//         });
//       } else {
        
//         await axios.post(`${baseURL}/api/students`, payload, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//       }

//       onClose();
//       onRefresh();
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong while saving the student.");
//     }
//   };

//   return (
//     <div className={styles.modalOverlay}>
//       <div className={styles.modalContent}>
//         <h2 className={styles.modalTitle}>{student ? 'Edit Student' : 'Add Student'}</h2>
//         <form onSubmit={handleSubmit} className={styles.form}>
//           <input
//             name="firstName"
//             placeholder="First Name"
//             value={formData.firstName}
//             onChange={handleChange}
//             required
//           />
//           <input
//             name="lastName"
//             placeholder="Last Name"
//             value={formData.lastName}
//             onChange={handleChange}
//             required
//           />
//           <input
//             name="admissionNumber"
//             placeholder="Admission Number"
//             value={formData.admissionNumber}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="date"
//             name="dateOfBirth"
//             value={formData.dateOfBirth}
//             onChange={handleChange}
//             required
//           />
//           <select name="gender" value={formData.gender} onChange={handleChange} required>
//             <option value="">Select Gender</option>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//           </select>
//           <input
//             name="address"
//             placeholder="Address"
//             value={formData.address}
//             onChange={handleChange}
//           />
//           <input
//             name="phoneNumber"
//             placeholder="Phone Number"
//             value={formData.phoneNumber}
//             onChange={handleChange}
//           />
//           <input
//             name="photoUrl"
//             placeholder="Photo URL"
//             value={formData.photoUrl}
//             onChange={handleChange}
//           />

//           <div className={styles.actions}>
//             <button type="submit" className={styles.saveBtn}>
//               {student ? 'Update' : 'Add'}
//             </button>
//             <button type="button" className={styles.cancelBtn} onClick={onClose}>
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default StudentFormModal;


