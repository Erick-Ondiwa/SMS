import React, { useState, useEffect } from 'react';
import styles from './MarkAttendanceModal.module.css';
import axios from 'axios';

const MarkAttendanceModal = ({ courseId, onClose, onRefresh, onSaved }) => {
  const [students, setStudents] = useState([]);
  const [week, setWeek] = useState(1);
  const [marked, setMarked] = useState([]);

  const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${baseURL}/api/courses/${courseId}/enrollments`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const mapped = res.data.map(s => ({
    ...s,
    isPresent: true,
    fullName: s.fullName || `${s.firstName} ${s.lastName}`,
  }));

  setStudents(mapped);
  setMarked(mapped);
};

  const toggleAttendance = (studentId) => {
    setMarked(prev =>
      prev.map(s =>
        s.studentId === studentId ? { ...s, isPresent: !s.isPresent } : s
      )
    );
  };

  const saveAttendance = async () => {
    const token = localStorage.getItem('token');
    const body = {
      courseId,
      week: week,
      attendance: marked.map(s => ({
        studentId: s.studentId,
        isPresent: s.isPresent
      }))
    };
    await axios.post(`${baseURL}/api/attendance/mark`, body, {
      headers: { Authorization: `Bearer ${token}` }
    });
    onSaved?.();
    onRefresh();    
    onClose();
  };

  return (
    <div className={styles.modal}>
      <h3>Mark Attendance - Week {week}</h3>

      <label>Week:
        <select value={week} onChange={e => setWeek(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(w => (
            <option key={w} value={w}>Week {w}</option>
          ))}
        </select>
      </label>

      <table>
        <thead>
          <tr>
            <th>Adm No</th>
            <th>Name</th>
            <th>Present</th>
          </tr>
        </thead>
        <tbody>
          {marked.map(s => (
            <tr key={s.studentId}>
              <td>{s.admissionNumber}</td>
              <td>{s.fullName}</td>
              <td>
                <input
                  type="checkbox"
                  checked={s.isPresent}
                  onChange={() => toggleAttendance(s.studentId)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.actions}>
        <button onClick={saveAttendance}>✅ Save</button>
        <button onClick={onClose}>❌ Cancel</button>
      </div>
    </div>
  );
};

export default MarkAttendanceModal;
