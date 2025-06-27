import React, { useEffect, useState } from 'react';
import styles from './CoursePage.module.css';
import axios from 'axios';
import CourseTable from '../components/courses/CourseTable';
import CourseDetailsModal from '../components/courses/CourseDetailsModal';
import CourseFormModal from '../components/courses/CourseFormModal';
import { FiSearch } from 'react-icons/fi';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [filters, setFilters] = useState({
    courseCode: '',
    teacherId: '',
    sortBy: '',
  });

  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, sortOrder, courses]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${baseURL}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
      setFilteredCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${baseURL}/api/teachers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(res.data);
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...courses];

    if (filters.courseCode) {
      filtered = filtered.filter(c =>
        c.courseCode.toLowerCase().includes(filters.courseCode.toLowerCase())
      );
    }

    if (filters.teacherId) {
      filtered = filtered.filter(c => c.teacher?.teacherId === filters.teacherId);
    }

    if (filters.sortBy === 'semester') {
      filtered.sort((a, b) =>
        sortOrder === 'asc'
          ? a.semester.localeCompare(b.semester)
          : b.semester.localeCompare(a.semester)
      );
    } else if (filters.sortBy === 'level') {
      filtered.sort((a, b) =>
        sortOrder === 'asc'
          ? a.level.localeCompare(b.level)
          : b.level.localeCompare(a.level)
      );
    } else if (filters.sortBy === 'createdAt') {
      filtered.sort((a, b) =>
        sortOrder === 'asc'
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    setFilteredCourses(filtered);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowForm(true);
    setShowDetails(false);
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    setShowForm(true);
    setShowDetails(false);
  };

  const handleResetFilters = () => {
    setFilters({ courseCode: '', teacherId: '', sortBy: '' });
    setSortOrder('asc');
    setFilteredCourses(courses);
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setShowDetails(true);
    setShowForm(false);
  };

  const handleCloseForm = () => {
    setEditingCourse(null);
    setShowForm(false);
  };

  const handleCloseDetails = () => {
    setSelectedCourse(null);
    setShowDetails(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2>Course Management</h2>
        <button onClick={handleAddCourse} className={styles.addBtn}>
          + Add Course
        </button>
      </div>

      <div className={styles.controlRow}>
        <div className={styles.group}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search by Course Code..."
              value={filters.courseCode}
              onChange={(e) =>
                setFilters({ ...filters, courseCode: e.target.value })
              }
              className={styles.searchInput}
            />
            <button onClick={applyFilters} className={styles.searchBtn}>
              <FiSearch className={styles.searchIcon} />
            </button>
          </div>
        </div>

        <div className={styles.group}>
          <select
            value={filters.teacherId}
            onChange={(e) =>
              setFilters({ ...filters, teacherId: e.target.value })
            }
            className={styles.select}
          >
            <option value="">Filter by Teacher</option>
            {teachers.map((t) => (
              <option key={t.teacherId} value={t.teacherId}>
                {t.fullName}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.group}>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters({ ...filters, sortBy: e.target.value })
            }
            className={styles.select}
          >
            <option value="">Sort by</option>
            <option value="semester">Semester</option>
            <option value="level">Level</option>
            <option value="createdAt">Date Created</option>
          </select>

          <button
            className={styles.toggleBtn}
            onClick={() =>
              setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
            }
          >
            {sortOrder === 'asc' ? '⬆ Asc' : '⬇ Desc'}
          </button>

          <button className={styles.resetBtn} onClick={handleResetFilters}>
            🔄 Reset
          </button>
        </div>
      </div>

      <CourseTable
        courses={filteredCourses}
        onEdit={handleEdit}
        onViewDetails={handleViewDetails}
      />

      {showDetails && selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          onClose={handleCloseDetails}
          onRefresh={fetchCourses}
        />
      )}

      {showForm && (
        <CourseFormModal
          course={editingCourse}
          onClose={handleCloseForm}
          onRefresh={fetchCourses}
        />
      )}
    </div>
  );
};

export default CoursesPage;

