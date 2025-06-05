// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { getUserFromToken, isAuthenticated } from '../utils/Auth';

const ProtectedRoute = ({ allowedRoles }) => {
  const user = getUserFromToken();
  console.log('user', user);

  if (!isAuthenticated() || !user) {
    return <Navigate to="/login" replace />;
  }

  const roles = Array.isArray(user.roles) ? user.roles : [user.roles];
  console.log('role', roles);

  const isAuthorized = roles.some(role => allowedRoles.includes(role));
  console.log('isAuthorised', isAuthorized);  
  return isAuthorized ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
