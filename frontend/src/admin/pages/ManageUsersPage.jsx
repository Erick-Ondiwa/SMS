import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ManageUsersPage.module.css';
import { useNavigate } from 'react-router-dom';
import { getUserFromToken } from '../../utils/auth';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const currentUser = getUserFromToken();
  const isAdmin = currentUser?.roles?.includes('Admin');

  useEffect(() => {
    if (isAdmin) fetchUsers();
    else setError('Unauthorized access');
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${baseURL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError('❌ Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>User Management</h2>
          <p className={styles.subtitle}>All registered users in the system</p>
        </div>
        <div className={styles.actions}>
          <button onClick={() => navigate('/admin/roles')} className={styles.actionBtn}>
            🔐 Manage Roles
          </button>
          <button onClick={() => navigate('/admin/register')} className={styles.actionBtn}>
            ➕ Create New User
          </button>
        </div>
      </div>

      {loading && <p className={styles.info}>Loading users...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              // const joined = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—';
              const role = Array.isArray(u.roles) ? u.roles.join(', ') : '—';

              return (
                <tr key={u.userId}>
                  <td>{u.fullName}</td>
                  <td>{u.userName}</td>
                  <td>{u.email}</td>
                  <td>{role}</td>
                  <td>{u.phoneNumber || '—'}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsersPage;

