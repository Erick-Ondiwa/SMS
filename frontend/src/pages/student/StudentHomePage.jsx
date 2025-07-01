import React, { useEffect, useState } from 'react';
import styles from './StudentHomePage.module.css';
import axios from 'axios';
import { getUserFromToken } from '../../utils/Auth';
import { FaUserCircle } from 'react-icons/fa';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const StudentHomePage = () => {
  const user = getUserFromToken();
  const [student, setStudent] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.userId) {
      setError("User ID not found in token.");
      setLoading(false);
      return;
    }

    const fetchStudentDetails = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${baseURL}/api/students/user/${user.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudent(response.data);
        setFormData(response.data);
      } catch (err) {
        setError('Unable to fetch your student profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [user?.userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${baseURL}/api/students/${student.studentId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudent(formData);
      setEditing(false);
    } catch (err) {
      alert('Update failed');
    }
  };

  const stage = student?.yearOfStudy && student?.semester
    ? `Y${student.yearOfStudy}S${student.semester}`
    : 'N/A';

  return (
    <div className={styles.home}>
      {loading && <p className={styles.info}>Loading your profile...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        <>
          <h2 className={styles.welcome}>Welcome back, {student?.fullName || user?.firstName || 'Student'}!</h2>

          <div className={styles.content}>
            {/* Left: Profile Section */}
            <div className={styles.leftSection}>
              <div className={styles.profileIcon}>
                <FaUserCircle size={80} />
              </div>
              <h3 className={styles.fullName}>{student?.fullName}</h3>
              <p><strong>Program:</strong> {student?.academicProgram?.name || 'N/A'}</p>
              <p><strong>Stage:</strong> {stage}</p>
            </div>

            {/* Right: Editable Personal Info */}
            <div className={styles.rightSection}>
              <h3>Personal Information</h3>
              <div className={styles.detailsGrid}>
                {[
                  { label: 'Admission No', name: 'admissionNumber' },
                  { label: 'Email', name: 'email' },
                  { label: 'Phone', name: 'phoneNumber' },
                  { label: 'Address', name: 'address' },
                  { label: 'Gender', name: 'gender' },
                  { label: 'Date of Birth', name: 'dateOfBirth', type: 'date' }
                ].map(field => (
                  <div key={field.name}>
                    <strong>{field.label}:</strong>
                    {editing ? (
                      <input
                        type={field.type || 'text'}
                        name={field.name}
                        value={formData?.[field.name] || ''}
                        onChange={handleChange}
                      />
                    ) : (
                      <span> {student?.[field.name] || '—'}</span>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={editing ? handleUpdate : () => setEditing(true)}
                className={styles.updateButton}
              >
                {editing ? 'Save Changes' : 'Update Info'}
              </button>
            </div>
          </div>

          {/* Bottom: Quick Actions */}
          <section className={styles.quickLinks}>
            <h3>Quick Actions</h3>
            <div className={styles.actions}>
              <button>📚 View Enrolled Courses</button>
              <button>📅 View Attendance</button>
              <button>📝 Check Grades</button>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default StudentHomePage;

// import React, { useEffect, useState } from 'react';
// import styles from './StudentHomePage.module.css';
// import axios from 'axios';
// import { getUserFromToken } from '../../utils/Auth';

// const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

// const StudentHomePage = () => {
//   const user = getUserFromToken();
//   console.log("Decoded user from token:", user); // debug line

//   const [student, setStudent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (!user?.userId) {
//       setError("User ID not found in token.");
//       setLoading(false);
//       return;
//     }

//     const fetchStudentDetails = async () => {
//       const token = localStorage.getItem('token');

//       if (!token) {
//         setError('No authentication token found.');
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get(`${baseURL}/api/students/user/${user.userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setStudent(response.data);
//       } catch (err) {
//         console.error('Failed to load student details:', err);
//         setError(err?.response?.data?.message || 'Unable to fetch your student profile.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudentDetails();
//   }, [user?.userId]);

//   return (
//     <div className={styles.home}>
//       {loading && <p className={styles.info}>Loading your profile...</p>}
//       {error && <p className={styles.error}>{error}</p>}

//       {!loading && !error && (
//         <>
//           <h2 className={styles.heading}>
//             Welcome back, {student?.fullName || user?.firstName || 'Student'}!
//           </h2>

//           <section className={styles.profileCard}>
//             <h3>Your Profile</h3>
//             <div className={styles.detailsGrid}>
//               <div><strong>Student ID:</strong> {student?.admissionNumber}</div>
//               <div><strong>Level:</strong> {student?.level}</div>
//               <div><strong>Semester:</strong> {student?.semester}</div>
//               <div><strong>Email:</strong> {student?.email || user?.email}</div>
//               <div><strong>Phone:</strong> {student?.phoneNumber || '—'}</div>
//               <div><strong>Address:</strong> {student?.address || '—'}</div>
//             </div>
//           </section>

//           <section className={styles.quickLinks}>
//             <h3>Quick Actions</h3>
//             <div className={styles.actions}>
//               <button>📚 View Enrolled Courses</button>
//               <button>📅 View Attendance</button>
//               <button>📝 Check Grades</button>
//             </div>
//           </section>
//         </>
//       )}
//     </div>
//   );
// };

// export default StudentHomePage;
