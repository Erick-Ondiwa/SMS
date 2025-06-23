import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProgramFormModal.module.css';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const ProgramFormModal = ({ program, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    durationInYears: 4,
  });

  useEffect(() => {
    if (program) {
      setFormData({
        name: program.name,
        category: program.category,
        durationInYears: program.durationInYears,
      });
    }
  }, [program]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      if (program) {
        await axios.put(`${baseURL}/api/programs/${program.programId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${baseURL}/api/programs`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSave();
    } catch (err) {
      console.error('Error saving program:', err);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.title}>
          {program ? 'Edit Program' : 'Add New Program'}
        </h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            name="name"
            placeholder="Program Name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={styles.input}
            required
          >
            <option value="">Select Category</option>
            <option value="Science">Science</option>
            <option value="Art">Art</option>
          </select>

          <input
            type="number"
            name="durationInYears"
            placeholder="Duration in Years"
            value={formData.durationInYears}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgramFormModal;
