import styles from './AdminDashboard.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [error, setError] = useState('');

  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    staff: 0,
    courses: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      const decoded = jwtDecode(token);
      const roles = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      if (!roles?.includes('Admin')) {
        return navigate('/unauthorized');
      }
    } catch (error) {
      navigate('/login');
    }

    fetchDashboardData();
    fetchActivities();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [studentsRes, teachersRes, staffRes, coursesRes] = await Promise.all([
        axios.get(`${baseURL}/api/students`, { headers }),
        axios.get(`${baseURL}/api/teachers`, { headers }),
        // axios.get(`${baseURL}/api/staff`, { headers }), // Adjust if staff is under another endpoint
        // axios.get(`${baseURL}/api/courses`, { headers }),
      ]);

      setStats({
        students: studentsRes.data.length,
        teachers: teachersRes.data.length,
        // staff: staffRes.data.length,
        // courses: coursesRes.data.length
      });
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoadingActivities(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(`${baseURL}/api/activity-logs`, { headers });
      setActivities(response.data || []);
    } catch (err) {
      console.error('Failed to load activities:', err);
      setError('Unable to fetch recent activities.');
    } finally {
      setLoadingActivities(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>Admin Panel</h2>
        <nav className={styles.nav}>
          <ul>
            <li><a href="/admin/dashboard">Dashboard</a></li>
            <li><a href="/admin/users">User Management</a></li>
            <li><a href="/admin/roles">Role Management</a></li>
            <li><a href="/admin/students">Students</a></li>
            <li><a href="/admin/teachers">Teachers</a></li>
          </ul>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Welcome Admin</h1>
          <button onClick={handleLogout} className={styles.logout}>Logout</button>
        </header>

        <div className={styles.mainContent}>
          <section className={styles.overview}>
            <h2>Overview</h2>
            <p>Monitor user activity, manage roles, and keep your school data up to date.</p>
          </section>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Students</h3>
              <p>{stats.students}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Teachers</h3>
              <p>{stats.teachers}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Staff</h3>
              <p>{stats.staff}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Courses</h3>
              <p>{stats.courses}</p>
            </div>
          </div>

          <div className={styles.activitySection}>
            <h3>Recent Activities</h3>
            {loadingActivities ? (
              <p>Loading...</p>
            ) : error ? (
              <p className={styles.error}>{error}</p>
            ) : (
              <ul>
                {activities.map((act, index) => (
                  <li key={index}>
                    🕓 {new Date(act.timestamp).toLocaleString()} — {act.description}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.quickActions}>
            <button className={styles.actionButton}>➕ Add New User</button>
            <button className={styles.actionButton}>📚 Create Course</button>
            <button className={styles.actionButton}>👩‍🏫 Assign Teacher</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;


// import styles from './AdminDashboard.module.css';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { jwtDecode } from 'jwt-decode';

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [activities, setActivities] = useState([]);
//   const [loadingActivities, setLoadingActivities] = useState(false);
//   const [error, setError] = useState('');

//   const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) return navigate('/login');

//     try {
//       const decoded = jwtDecode(token);
//       const roles = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
//       if (!roles?.includes('Admin')) {
//         return navigate('/unauthorized');
//       }
//     } catch (error) {
//       navigate('/login');
//     }
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/login');
//   };

//   return (
//     <div className={styles.dashboard}>
//       <aside className={styles.sidebar}>
//         <h2 className={styles.logo}>Admin Panel</h2>
//         <nav className={styles.nav}>
//           <ul>
//             <li><a href="/admin/dashboard">Dashboard</a></li>
//             <li><a href="/admin/users">User Management</a></li>
//             <li><a href="/admin/roles">Role Management</a></li>
//             <li><a href="/admin/students">Students</a></li>
//             <li><a href="/admin/teachers">Teachers</a></li>
//           </ul>
//         </nav>
//       </aside>

//       <main className={styles.main}>
//         <header className={styles.header}>
//           <h1>Welcome Admin</h1>
//           <button onClick={handleLogout} className={styles.logout}>Logout</button>
//         </header>

//         <div className={styles.mainContent}>

//         <section className={styles.overview}>
//           <h2>Overview</h2>
//           <p>Monitor user activity, manage roles, and keep your school data up to date.</p>
//         </section>


//           {/* Stat Cards */}
//           <div className={styles.statsGrid}>
//             <div className={styles.statCard}>
//               <h3>Students</h3>
//               <p>620</p>
//             </div>
//             <div className={styles.statCard}>
//               <h3>Teachers</h3>
//               <p>45</p>
//             </div>
//             <div className={styles.statCard}>
//               <h3>Staff</h3>
//               <p>10</p>
//             </div>
//             <div className={styles.statCard}>
//               <h3>Courses</h3>
//               <p>38</p>
//             </div>
//           </div>

//           {/* Recent Activity */}
//           <div className={styles.activitySection}>
//             <h3>Recent Activities</h3>
//             <ul>
//               {activities.map((act, index) => (
//                 <li key={index}>
//                   🕓 {new Date(act.timestamp).toLocaleString()} — {act.description}
//                 </li>
//               ))}
//             </ul>
//           </div>


//           {/* Quick Actions */}
//           <div className={styles.quickActions}>
//             <button className={styles.actionButton}>➕ Add New User</button>
//             <button className={styles.actionButton}>📚 Create Course</button>
//             <button className={styles.actionButton}>👩‍🏫 Assign Teacher</button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;
