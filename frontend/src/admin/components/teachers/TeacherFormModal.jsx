import React, { useState, useEffect } from 'react';
import styles from './TeacherFormModal.module.css';
import axios from 'axios';
import { getUserFromToken } from '../../../utils/Auth';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const TeacherFormModal = ({ teacher = {}, onClose, onRefresh }) => {
  const currentUser = getUserFromToken();

  // Determine if we're editing based on presence of teacherId or passed flag
  const [isEditMode, setIsEditMode] = useState(!!teacher.teacherId);

  const [formData, setFormData] = useState({
    userId: teacher.userId || '',
    teacherId: teacher.teacherId,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    address: '',
    photoUrl: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Prefill the form
  useEffect(() => {
    if (teacher) {
      const fullNameParts = teacher.fullName?.split(' ') || [];
      const firstName = teacher.firstName || fullNameParts[0] || '';
      const lastName = teacher.lastName || fullNameParts.slice(1).join(' ') || '';

      setFormData({
        userId: teacher.userId || '',
        teacherId: teacher.teacherId,
        firstName,
        lastName,
        email: teacher.email || '',
        phoneNumber: teacher.phoneNumber || '',
        department: teacher.department || '',
        address: teacher.address || '',
        photoUrl: teacher.photoUrl || ''
      });

      // Toggle to edit mode if meaningful data exists
      if (teacher.teacherId || teacher.firstName || teacher.lastName || teacher.email) {
        setIsEditMode(true);
      }
    }
  }, [teacher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    // Prepare payload with full name
    const payload = {
      ...formData,
      fullName: `${formData.firstName} ${formData.lastName}`.trim()
    };

    try {
      if (isEditMode) {
        await axios.put(`${baseURL}/api/teachers/${teacher.teacherId}`, payload, { headers });
        setSuccessMessage('✅ Teacher updated successfully.');
      } else {
        await axios.post(`${baseURL}/api/teachers`, payload, { headers });
        setSuccessMessage('✅ Teacher registered successfully.');
        setIsEditMode(true); // Now switch mode for any further edits
      }

      onRefresh?.();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setErrorMessage('❌ Failed to save teacher. Please try again.');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>{isEditMode ? 'Edit Teacher' : 'Add New Teacher'}</h2>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <input
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
          />
          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
          <input
            name="photoUrl"
            placeholder="Photo URL"
            value={formData.photoUrl}
            onChange={handleChange}
          />

          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>
              {isEditMode ? 'Update Teacher' : 'Add Teacher'}
            </button>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherFormModal;
