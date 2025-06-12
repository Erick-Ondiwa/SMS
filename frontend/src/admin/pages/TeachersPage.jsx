import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TeacherTable from '../components/teachers/TeacherTable';
import TeacherFormModal from '../components/teachers/TeacherFormModal';
import { getUserFromToken } from '../../utils/Auth';
import styles from './TeachersPage.module.css'; // ⬅️ Module styling

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = getUserFromToken(); // { role, token }

  useEffect(() => {
    if (user?.token) fetchTeachers();
  }, [user]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/teachers', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTeachers(res.data);
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    try {
      await axios.delete(`/api/teachers/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchTeachers();
    } catch (err) {
      console.error('Failed to delete teacher:', err);
    }
  };

  if (!user) return null;

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Teacher Management</h2>
        {user.role === 'Admin' && (
          <button onClick={() => setShowForm(true)} className={styles.addButton}>
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
          isAdmin={user.role === 'Admin'}
        />
      )}

      {showForm && (
        <TeacherFormModal
          teacher={editingTeacher}
          onClose={() => {
            setEditingTeacher(null);
            setShowForm(false);
          }}
          onRefresh={fetchTeachers}
        />
      )}
    </div>
  );
};

export default TeachersPage;
