// utils/auth.js
import { jwtDecode } from 'jwt-decode';

export const getToken = () => localStorage.getItem('token');

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    const roles =
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      decoded.role ||
      [];

    return {
      email: decoded.email || decoded.unique_name || '',
      firstName: decoded.firstName || '', 
      userName: decoded.userName || '',
      roles: Array.isArray(roles) ? roles : [roles],
      exp: decoded.exp,
      iat: decoded.iat,
      sub: decoded.sub,
    };
      
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
};
