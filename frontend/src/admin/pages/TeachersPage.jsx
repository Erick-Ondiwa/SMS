import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TeacherTable from '../components/teachers/TeacherTable';
import TeacherFormModal from '../components/teachers/TeacherFormModal';
import TeacherDetailsModal from '../components/teachers/TeacherDetailsModal';
import RegisterForm from '../../components/Auth/RegisterForm';
import { getUserFromToken } from '../../utils/Auth';
import styles from './TeachersPage.module.css';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [newTeacher, setNewTeacher] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const isAdmin = currentUser?.roles?.includes('Admin');

  useEffect(() => {
    const user = getUserFromToken();
    setCurrentUser(user);

    if (user) {
      fetchTeachers();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${baseURL}/api/teachers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeachers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setShowTeacherForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${baseURL}/api/teachers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedTeacher(null);
      fetchTeachers();
    } catch (err) {
      console.error('Failed to delete teacher:', err);
    }
  };

  const handleRegisterComplete = (userId, details) => {
    const teacherData = {
      userId,
      fullName: `${details.firstName} ${details.lastName}`,
      firstName: details.firstName,
      lastName: details.lastName,
      phoneNumber: details.phoneNumber,
      email: details.email || ''
    };

    setNewTeacher(teacherData);
    setEditingTeacher(null);
    setShowRegisterForm(false);
    setShowTeacherForm(false);
    fetchTeachers();
  };

  const handleAddDetails = () => {
    if (!newTeacher) return;

    setEditingTeacher({
      teacherId: newTeacher.teacherId,
      userId: newTeacher.userId,
      firstName: newTeacher.firstName,
      lastName: newTeacher.lastName,
      phoneNumber: newTeacher.phoneNumber,
      email: newTeacher.email,
      department: '',
      address: '',
      photoUrl: ''
    });

    setShowTeacherForm(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Teacher Management</h2>
        {isAdmin && (
          <button
            onClick={() => {
              setShowRegisterForm(true);
              setEditingTeacher(null);
              setNewTeacher(null);
            }}
            className={styles.addButton}
          >
            + Add Teacher
          </button>
        )}
      </div>

      {loading ? (
        <p className={styles.loading}>Loading teachers...</p>
      ) : (
        <TeacherTable
          teachers={teachers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetails={setSelectedTeacher}
          isAdmin={isAdmin}
        />
      )}

      {/* RegisterForm Modal */}
      {showRegisterForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <RegisterForm
              isAdminCreating={true}
              role="Teacher"
              onRegisterComplete={handleRegisterComplete}
            />
            <button
              onClick={() => setShowRegisterForm(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Success message with Add Details button */}
      {newTeacher && !showTeacherForm && (
        <div className={styles.successMessage}>
          ✅ <strong>{newTeacher.fullName}</strong> registered successfully. Add other details.
          <button onClick={handleAddDetails} className={styles.addButton}>
            Add Details
          </button>
        </div>
      )}

      {/* Teacher Form Modal */}
      {showTeacherForm && (
        <TeacherFormModal
          teacher={editingTeacher}
          onClose={() => {
            setEditingTeacher(null);
            setShowTeacherForm(false);
            setNewTeacher(null);
          }}
          onRefresh={fetchTeachers}
        />
      )}

      {/* View Teacher Details Modal */}
      {selectedTeacher && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <TeacherDetailsModal
              teacher={selectedTeacher}
              onClose={() => setSelectedTeacher(null)}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersPage;
