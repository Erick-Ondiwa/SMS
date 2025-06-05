import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const RedirectIfAuthenticated = ({ children }) => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const exp = decoded.exp * 1000;

      if (Date.now() > exp) {
        // Token expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return children;
      }

      const roles = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const roleArray = Array.isArray(roles) ? roles : [roles];

      if (roleArray.includes("Admin")) return <Navigate to="/admin/dashboard" />;
      if (roleArray.includes("Teacher")) return <Navigate to="/teacher/dashboard" />;
      if (roleArray.includes("Parent")) return <Navigate to="/parent/dashboard" />;
      if (roleArray.includes("Student")) return <Navigate to="/student/dashboard" />;
    } catch (err) {
      // Invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  return children;
};

export default RedirectIfAuthenticated;
