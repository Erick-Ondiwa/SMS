import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './StudentResultsPage.module.css';
import { getUserFromToken } from '../../../utils/auth';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const StudentResultsPage = () => {
  const [allResults, setAllResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [stages, setStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState('');
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = getUserFromToken();

  useEffect(() => {
    fetchStudentResults();
    fetchStudentDetails();
  }, [user?.userId]);

  const fetchStudentDetails = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${baseURL}/api/students/user/${user.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudent(response.data);
    } catch (err) {
      setError('Unable to fetch your student profile.');
    } finally {
      setLoading(false);
    }
  };


  const fetchStudentResults = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${baseURL}/api/results/student/${user.userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const results = res.data;

      setAllResults(results);

      const uniqueStages = Array.from(new Set(
        results.map(r => `Y${r.yearOfStudy}S${r.semester}`)
      ));
      setStages(uniqueStages.sort());
      setSelectedStage(uniqueStages[0]);
    } catch (err) {
      setError('Failed to fetch results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStage) {
      const [year, semester] = selectedStage.replace('Y', '').split('S');
      const filtered = allResults.filter(
        r => r.yearOfStudy === parseInt(year) && r.semester === parseInt(semester)
      );
      setFilteredResults(filtered);
    }
  }, [selectedStage, allResults]);

  return (
    <div className={styles.container}>
      <h2>🎓 My Academic Results</h2>

      {loading && <p className={styles.info}>Loading your results...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {student && (
        <div className={styles.studentDetails}>
          <p><strong>Name:</strong> {student?.fullName}</p>
          <p><strong>Reg No:</strong> {student?.admissionNumber}</p>
          <p><strong>Program:</strong> {student?.academicProgram?.name}</p>
        </div>
      )}

      {stages.length > 0 && (
        <div className={styles.stageSelect}>
          <label htmlFor="stage">Select Stage: </label>
          <select id="stage" value={selectedStage} onChange={(e) => setSelectedStage(e.target.value)}>
            {stages.map(stage => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
        </div>
      )}

      {filteredResults.length > 0 ? (
        <table className={styles.resultsTable}>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Grade</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map(result => (
              <tr key={result.resultId}>
                <td>{result.courseCode}</td>
                <td>{result.courseTitle}</td>
                <td>{result.grade}</td>
                <td>{result.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.info}>No results for this stage.</p>
      )}
    </div>
  );
};

export default StudentResultsPage;

