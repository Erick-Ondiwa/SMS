import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentTable from '../components/students/StudentTable';
import StudentFormModal from '../components/students/StudentFormModal';
import { getUserFromToken } from '../../utils/Auth';
import styles from './StudentsPage.module.css';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const { user } = getUserFromToken(); // returns { role, token }

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/students', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch students.');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await axios.delete(`/api/students/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert('Failed to delete student.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Student Management</h2>
        {user.role === 'Admin' && (
          <button
            onClick={() => setShowForm(true)}
            className={styles.addButton}
          >
            Add Student
          </button>
        )}
      </div>

      <StudentTable
        students={students}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isAdmin={user.role === 'Admin'}
      />

      {showForm && (
        <StudentFormModal
          student={editingStudent}
          onClose={() => {
            setEditingStudent(null);
            setShowForm(false);
          }}
          onRefresh={fetchStudents}
        />
      )}
    </div>
  );
};

export default StudentsPage;
