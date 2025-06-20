import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ManageUsersPage.module.css';
import { getUserFromToken } from '../../utils/Auth';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = getUserFromToken();
  const isAdmin = currentUser?.roles?.includes('Admin');

  useEffect(() => {
    if (isAdmin) fetchUsers();
    else setError('Unauthorized');
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${baseURL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>User Management</h2>
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
            {users.map(u => {
              // const fullName = `${u.firstName} ${u.lastName}`;
              const fullName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || '—';
              const joined = new Date(u.createdAt).toLocaleDateString();
              const role = u.roles?.join(', ') || '—';
              return (
                <tr key={u.userId}>
                  <td>{fullName}</td>
                  <td>{u.userName}</td>
                  <td>{u.email}</td>
                  <td>{role}</td>
                  <td>{u.phoneNumber || '—'}</td>
                  <td>{joined}</td>
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
