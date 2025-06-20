import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ManageRoles.module.css';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7009';

const ManageRoles = () => {
  const [users, setUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const roles = ['Student', 'Teacher', 'Parent', 'Admin'];

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setMessage('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = (userId, role) => {
    setSelectedRoles(prev => ({ ...prev, [userId]: role }));
  };

  const assignRole = async (userId) => {
    const role = selectedRoles[userId];
    if (!role) {
      setMessage('Please select a role before assigning.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${baseURL}/api/Admin/roles`, { userId, role }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(`✅ Role "${role}" assigned to user ${userId}`);
    } catch (err) {
      console.error('Error assigning role:', err);
      setMessage('❌ Failed to assign role. Try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Manage Roles</h2>

      {/* <button className={styles.backButton} onClick={() => navigate('/admin/dashboard')}>
        ← Back
      </button> */}


      {message && <div className={styles.message}>{message}</div>}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Current Role(s)</th>
              <th>Assign New Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td> {user.FirstName}</td>
                <td>{user.email}</td>
                <td>{user.roles?.length > 0 ? user.roles.join(', ') : 'None'}</td>
                <td>
                  <select
                    value={selectedRoles[user.id] || ''}
                    onChange={e => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="">-- Select Role --</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className={styles.button}
                    onClick={() => assignRole(user.id)}
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageRoles;
