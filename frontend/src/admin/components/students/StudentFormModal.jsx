import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './StudentFormModal.module.css';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const StudentFormModal = ({ student, onClose, onRefresh }) => {
  const isEditMode = !!student?.studentId;

  const [formData, setFormData] = useState({
    userId: student?.userId || '',
    fullName: student?.fullName || '',
    admissionNumber: student?.admissionNumber || '',
    dateOfBirth: student?.dateOfBirth?.slice(0, 10) || '',
    gender: student?.gender || '',
    phoneNumber: student?.phoneNumber || '',
    address: student?.address || '',
    parentId: student?.parentId || '',
    photoUrl: student?.photoUrl || '',
    programId: student?.programId || student?.academicProgram?.programId || '',
    yearOfStudy: student?.yearOfStudy || '',
    semester: student?.semester || ''
  });

  const [parents, setParents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (student) {
      setFormData(prev => ({
        ...prev,
        programId: student.programId || student.academicProgram?.programId || ''
      }));
    }
  
    fetchParents();
    fetchPrograms();
  }, [student]);
  
  const fetchParents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${baseURL}/api/parents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setParents(res.data);
    } catch (err) {
      console.error('Failed to fetch parents', err);
    }
  };
  
  const fetchPrograms = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${baseURL}/api/programs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrograms(res.data);
    } catch (err) {
      console.error('Failed to fetch programs', err);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (isEditMode) {
        await axios.put(`${baseURL}/api/students/${student.studentId}`, formData, { headers });
      } else {
        await axios.post(`${baseURL}/api/students`, formData, { headers });
      }

      onRefresh?.();
      onClose();
    } catch (err) {
      setError('❌ Failed to save student. Check required fields and try again.');
      console.error(err);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>
          {isEditMode ? 'Edit Student' : 'Add New Student'}
        </h2>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Full Name</label>
            <input
              name="fullName"
              value={formData.fullName}
              readOnly
              className={styles.inputField}
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
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Phone Number</label>
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              readOnly
              className={styles.inputField}
            />
          </div>

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
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Parent</label>
            <select
              name="parentId"
              value={formData.parentId}
              onChange={handleChange}
              className={styles.selectField}
            >
              <option value="">Select Parent</option>
              {parents.map((parent) => (
                <option key={parent.parentId} value={parent.parentId}>
                  {parent.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Program</label>
            <select
              name="programId"
              value={formData.programId}
              onChange={handleChange}
              className={styles.selectField}
              required
            >
              <option value="">Select Program</option>
              {programs.map(p => (
                <option key={p.programId} value={p.programId}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Year of Study</label>
            <input
              type="number"
              name="yearOfStudy"
              value={formData.yearOfStudy}
              onChange={handleChange}
              className={styles.inputField}
              min={1}
              max={10}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Semester</label>
            <input
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className={styles.inputField}
            />
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
    </div>
  );
};

export default StudentFormModal;
