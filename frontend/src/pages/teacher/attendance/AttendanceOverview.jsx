import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AttendanceOverview.module.css';
import MarkAttendanceModal from './MarkAttendanceModal';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const AttendanceOverview = ({ courseId, onMarkAttendance }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [students, setStudents] = useState([]);


  const WEEKS = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12

  useEffect(() => {
    if (courseId) {
      fetchAttendanceData();
    }
  }, [courseId]);

  const handleMarkAttendance = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${baseURL}/api/courses/${courseId}/enrollments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
      setShowForm(true);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };
  

  const fetchAttendanceData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${baseURL}/api/attendance/course/${courseId}/attendance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendanceData(res.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPresent = (record) => {
    return WEEKS.reduce(
      (total, week) => total + (record.weeks[week] === true ? 1 : 0),
      0
    );
  };

  return (
    <div className={styles.container}>
      <h2>📋 Attendance Overview</h2>

      {loading ? (
        <p>Loading attendance...</p>
      ) : attendanceData.length === 0 ? (
        <p>No attendance data available for this course.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Adm No</th>
              {WEEKS.map((week) => (
                <th key={week}>Week {week}</th>
              ))}
              <th>Total Present</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record) => {
              const totalPresent = calculateTotalPresent(record);
              const remark =
                totalPresent >= 10
                  ? 'Good'
                  : totalPresent >= 6
                  ? 'Fair'
                  : 'Poor';

              return (
                <tr key={record.studentId}>
                  <td>{record.admissionNumber}</td>
                  {WEEKS.map((week) => (
                    <td key={week}>
                      {record.weeks[week] === true
                        ? '✔️'
                        : record.weeks[week] === false
                        ? '❌'
                        : '-'}
                    </td>
                  ))}
                  <td>{totalPresent}</td>
                  <td>{remark}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <button className={styles.markBtn} onClick={handleMarkAttendance}>
        ✅ Mark Attendance
      </button>

      {showForm && (
      <MarkAttendanceModal
        courseId={courseId}
        students={students}
        onClose={() => {
          setShowForm(false);
          fetchAttendanceData();
        }}
      />
    )}
    </div>

  );
};

export default AttendanceOverview;

