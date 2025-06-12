import React, { useEffect, useState } from 'react';
import styles from './TeacherFormModal.module.css';
import axios from 'axios';
import { getUserFromToken } from '../../../utils/Auth';

const TeacherFormModal = ({ teacher, onClose, onRefresh }) => {
  const isEdit = Boolean(teacher);
  const { user } = getUserFromToken();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setForm({
        fullName: teacher.fullName || '',
        email: teacher.email || '',
        phoneNumber: teacher.phoneNumber || ''
      });
    }
  }, [teacher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName.trim()) return alert("Full name is required.");

    try {
      setLoading(true);
      if (isEdit) {
        await axios.put(`/api/teachers/${teacher.teacherId}`, form, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      } else {
        await axios.post('/api/teachers', form, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      }

      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{isEdit ? 'Edit Teacher' : 'Add Teacher'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Full Name
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </label>

          <label className={styles.label}>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Phone Number
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className={styles.input}
            />
          </label>

          <div className={styles.actions}>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
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
