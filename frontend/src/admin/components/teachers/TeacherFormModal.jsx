import React, { useState, useEffect } from 'react';
import styles from './TeacherFormModal.module.css';
import axios from 'axios';
import { getUserFromToken } from '../../../utils/Auth';

const TeacherFormModal = ({ teacher, onClose, onRefresh }) => {
  const { user } = getUserFromToken();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    address: '',
    photoUrl: ''
  });

  useEffect(() => {
    if (teacher) {
      setFormData({
        firstName: teacher.firstName || '',
        lastName: teacher.lastName || '',
        email: teacher.email || '',
        phoneNumber: teacher.phoneNumber || '',
        department: teacher.department || '',
        address: teacher.address || '',
        photoUrl: teacher.photoUrl || ''
      });
    }
  }, [teacher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (teacher) {
        await axios.put(`/api/teachers/${teacher.teacherId}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      } else {
        await axios.post('/api/teachers', formData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      }

      onClose();
      onRefresh();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving teacher.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>{teacher ? 'Edit Teacher' : 'Add Teacher'}</h2>
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
          />
          <input
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
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
              {teacher ? 'Update' : 'Add'}
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
