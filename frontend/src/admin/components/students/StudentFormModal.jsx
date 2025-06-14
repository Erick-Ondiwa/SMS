import React, { useState, useEffect } from 'react';
import styles from './StudentFormModal.module.css';
import axios from 'axios';
import { getUserFromToken } from '../../../utils/Auth';

const StudentFormModal = ({ student, onClose, onRefresh }) => {
  const { user } = getUserFromToken();

  console.log(user)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    admissionNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    phoneNumber: '',
    photoUrl: ''
  });

  useEffect(() => {
    if (student) {
      const nameParts = (student.fullName || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setFormData({
        firstName,
        lastName,
        admissionNumber: student.admissionNumber || '',
        dateOfBirth: student.dateOfBirth?.split('T')[0] || '',
        gender: student.gender || '',
        address: student.address || '',
        phoneNumber: student.phoneNumber || '',
        photoUrl: student.photoUrl || ''
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`.trim()
      };

      if (student) {
        await axios.put(`/api/students/${student.studentId}`, payload, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      } else {
        await axios.post('/api/students', payload, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      }

      onClose();
      onRefresh();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving the student.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>{student ? 'Edit Student' : 'Add Student'}</h2>
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
            name="admissionNumber"
            placeholder="Admission Number"
            value={formData.admissionNumber}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
          <input
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
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
              {student ? 'Update' : 'Add'}
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

export default StudentFormModal;


