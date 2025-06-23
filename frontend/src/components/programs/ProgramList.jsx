import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProgramFormModal from './ProgramFormModal';
import ProgramRow from './ProgramRow';
import styles from './ProgramList.module.css';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);

  const fetchPrograms = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${baseURL}/api/programs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrograms(res.data);
    } catch (err) {
      console.error('Failed to fetch programs:', err);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleEdit = (program) => {
    setEditingProgram(program);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this program?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/programs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchPrograms();
      } catch (err) {
        console.error('Error deleting program:', err);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Academic Programs</h2>
        <button
          onClick={() => {
            setEditingProgram(null);
            setShowModal(true);
          }}
          className={styles.addButton}
        >
          + Add Program
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Program Name</th>
              <th>Category</th>
              <th>Duration (Years)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <ProgramRow
                key={program.programId}
                program={program}
                onEdit={() => handleEdit(program)}
                onDelete={() => handleDelete(program.programId)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ProgramFormModal
          program={editingProgram}
          onClose={() => setShowModal(false)}
          onSave={() => {
            fetchPrograms();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ProgramList;
