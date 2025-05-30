import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AssignRoles.module.css';

const AssignRoles = () => {
  const [users, setUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [message, setMessage] = useState('');

  const roles = ['Student', 'Teacher', 'Staff', 'Admin']; // Customize as needed

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); // if using JWT
        const response = await axios.get('https://localhost:7009/api/Admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = (userId, role) => {
    setSelectedRoles(prev => ({ ...prev, [userId]: role }));
  };

  const assignRole = async (userId) => {
    try {
      const role = selectedRoles[userId];
      if (!role) return;

      const token = localStorage.getItem('token');
      await axios.post('https://localhost:7009/api/Admin/assign-role', { userId, role }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage(`Role "${role}" assigned to user ${userId}`);
    } catch (err) {
      console.error('Error assigning role:', err);
      setMessage('Failed to assign role. Try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Assign Roles to Users</h2>
      {message && <div className={styles.message}>{message}</div>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Current Role</th>
            <th>Assign New Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.roles && user.roles.length > 0 ? user.roles.join(', ') : 'None'}</td>
              {/* <td>{user.role || 'None'}</td> */}
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
    </div>
  );
};

export default AssignRoles;
