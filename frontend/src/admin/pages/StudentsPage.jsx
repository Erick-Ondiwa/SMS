import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentTable from '../components/students/StudentTable';
import StudentFormModal from '../components/students/StudentFormModal';
import StudentDetailsModal from '../components/students/StudentDetailsModal';
import RegisterForm from '../../components/Auth/RegisterForm';
import { getUserFromToken } from '../../utils/Auth';
import styles from './StudentsPage.module.css';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [registeredStudent, setRegisteredStudent] = useState(null);

  const navigate = useNavigate();
  const currentUser = getUserFromToken();
  const isAdmin = currentUser?.roles?.includes('Admin');

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter((s) =>
      s.admissionNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${baseURL}/api/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : [];
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch students.');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowStudentForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${baseURL}/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert('Failed to delete student.');
    }
  };

  const handleRegisterComplete = (userId, details) => {
    const studentData = {
      userId,
      fullName: details.fullName,
      phoneNumber: details.phoneNumber
    };
    setShowRegisterForm(false);
    setRegisteredStudent(studentData);
    setSuccessMessage(`✅ ${details.fullName} registered successfully. Add other details.`);
    fetchStudents();
  };

  const handleStudentDetailsSubmit = () => {
    setShowStudentForm(false);
    setRegisteredStudent(null);
    setEditingStudent(null);
    setSuccessMessage('✅ Details updated successfully.');
    fetchStudents();
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Student Management</h2>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search by Admission Number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className={styles.clearButton}>
              Clear
            </button>
          )}
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setShowRegisterForm(true);
              setEditingStudent(null);
              setRegisteredStudent(null);
              setSuccessMessage('');
            }}
            className={styles.addButton}
          >
            Add Student
          </button>
        )}
      </div>

      {successMessage && (
        <div className={styles.successBox}>
          <p>{successMessage}</p>
          {registeredStudent && (
            <button
              onClick={() => {
                setEditingStudent(registeredStudent);
                setShowStudentForm(true);
                setSuccessMessage('');
              }}
              className={styles.addButton}
            >
              Add Details
            </button>
          )}
        </div>
      )}

      <StudentTable
        students={filteredStudents}
        onEdit={handleEdit}
        onViewDetails={handleViewDetails}
        isAdmin={true}
      />

      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {/* Register Form Modal */}
      {showRegisterForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <RegisterForm
              isAdminCreating={true}
              role="Student"
              onRegisterComplete={(userId, details) => handleRegisterComplete(userId, details)}
            />
            <button onClick={() => setShowRegisterForm(false)} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Student Details Form Modal */}
      {showStudentForm && (
        <StudentFormModal
          student={editingStudent}
          onClose={handleStudentDetailsSubmit}
          onRefresh={fetchStudents}
        />
      )}
    </div>
  );
};

export default StudentsPage;


// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import StudentTable from '../components/students/StudentTable';
// import StudentFormModal from '../components/students/StudentFormModal';
// import StudentDetailsModal from '../components/students/StudentDetailsModal';
// import RegisterForm from '../../components/Auth/RegisterForm';
// import { getUserFromToken } from '../../utils/Auth';
// import styles from './StudentsPage.module.css';

// const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

// const StudentsPage = () => {
//   const [students, setStudents] = useState([]);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [showRegisterForm, setShowRegisterForm] = useState(false);
//   const [showStudentForm, setShowStudentForm] = useState(false);
//   const [editingStudent, setEditingStudent] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [registeredStudent, setRegisteredStudent] = useState(null);

//   const [filteredStudents, setFilteredStudents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResult, setSearchResult] = useState(null);

//   const navigate = useNavigate();
//   const currentUser = getUserFromToken();
//   const isAdmin = currentUser?.roles?.includes('Admin');

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const fetchStudents = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`${baseURL}/api/students`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setStudents(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error(err);
//       alert('Failed to fetch students.');
//     }
//   };

//   const handleSearch = async () => {
//     if (!searchTerm) return;
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`${baseURL}/api/students/search?admissionNumber=${searchTerm}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setSearchResult(res.data);
//     } catch (err) {
//       console.error('Search failed:', err);
//       alert('Student not found');
//     }
//   };


//   const handleEdit = (student) => {
//     setEditingStudent(student);
//     setShowStudentForm(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this student?')) return;
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`${baseURL}/api/students/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchStudents();
//     } catch (err) {
//       console.error(err);
//       alert('Failed to delete student.');
//     }
//   };

//   const handleRegisterComplete = (userId, details) => {
//     const studentData = {
//       userId,
//       fullName: details.fullName,
//       phoneNumber: details.phoneNumber
//     };
//     setShowRegisterForm(false);
//     setRegisteredStudent(studentData);
//     setSuccessMessage(`✅ ${details.fullName} registered successfully. Add other details.`);
//     fetchStudents(); // Refresh table
//   };

//   const handleStudentDetailsSubmit = () => {
//     setShowStudentForm(false);
//     setRegisteredStudent(null);
//     setEditingStudent(null);
//     setSuccessMessage('✅ Details updated successfully.');
//     fetchStudents();
//   };

//   const handleViewDetails = (student) => {
//     setSelectedStudent(student);
//   };

//   return (
//     <div className={styles.pageContainer}>
//       <div className={styles.header}>
//         <h2 className={styles.title}>Student Management</h2>
//         <div className={styles.searchBar}>
//         <input
//           type="text"
//           placeholder="Search by Admission Number"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className={styles.searchInput}
//         />
//         <button onClick={handleSearch} className={styles.searchButton}>Search</button>
//         {searchResult && (
//           <button onClick={() => setSearchResult(null)} className={styles.clearButton}>
//             Clear Search
//           </button>
//         )}

//       </div>

//         {isAdmin && (
//           <button
//             onClick={() => {
//               setShowRegisterForm(true);
//               setEditingStudent(null);
//               setRegisteredStudent(null);
//               setSuccessMessage('');
//             }}
//             className={styles.addButton}
//           >
//             Add Student
//           </button>
//         )}
//       </div>

//       {successMessage && (
//         <div className={styles.successBox}>
//           <p>{successMessage}</p>
//           {registeredStudent && (
//             <button
//               onClick={() => {
//                 setEditingStudent(registeredStudent);
//                 setShowStudentForm(true);
//                 setSuccessMessage('');
//               }}
//               className={styles.addButton}
//             >
//               Add Details
//             </button>
//           )}
//         </div>
//       )}

//     <>
//       <StudentTable
//        students={searchResult ? [searchResult] : students}
//         onEdit={handleEdit}
//         onViewDetails={handleViewDetails}
//         isAdmin={true}
//       />

//       {selectedStudent && (
//         <StudentDetailsModal
//           student={selectedStudent}
//           onClose={() => setSelectedStudent(null)}
//         />
//       )}
//     </>

//       {/* Step 1: RegisterForm */}
//       {showRegisterForm && (
//         <div className={styles.modal}>
//           <div className={styles.modalContent}>
//             <RegisterForm
//               isAdminCreating={true}
//               role="Student"
//               onRegisterComplete={(userId, details) => handleRegisterComplete(userId, details)}
//             />
//             <button onClick={() => setShowRegisterForm(false)} className={styles.cancelButton}>
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Step 2: StudentFormModal */}
//       {showStudentForm && (
//         <StudentFormModal
//           student={editingStudent}
//           onClose={handleStudentDetailsSubmit}
//           onRefresh={fetchStudents}
//         />
//       )}
//     </div>
//   );
// };

// export default StudentsPage;
