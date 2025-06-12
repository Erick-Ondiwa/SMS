import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPasswordForm from './components/Auth/ForgotPasswordForm';

import ParentDashboardPage from './pages/ParentDashboardPage.jsx';
import StudentDashboardPage from './pages/StudentDashboardPage.jsx';
import TeacherDashboardPage from './pages/TeacherDashboardPage.jsx';

// Admin Pages
import AdminDashboardPage from './admin/pages/AdminDashboardPage';
import ManageRolesPage from './admin/pages/ManageRolesPage.jsx';
import TeachersPage from './admin/pages/TeachersPage.jsx';
import StudentsPage from './admin/pages/StudentsPage.jsx';

import RedirectIfAuthenticated from './routes/RedirectIfAuthenticated.jsx';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={
              // <RedirectIfAuthenticated>
                <Login />
              // </RedirectIfAuthenticated>
            }
          />

          <Route
            path="/register"
            element={
              // <RedirectIfAuthenticated>
                <Register />
              // </RedirectIfAuthenticated> 
            }
          />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />

          {/* Protected Routes */}
          <Route
            path="/student/dashboard"
            element={
              // <ProtectedRoute allowedRoles={['Student']}>
                <StudentDashboardPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/dashboard"
            element={
              // <ProtectedRoute allowedRoles={['Teacher']}>
                <TeacherDashboardPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/parent/dashboard"
            element={
              // <ProtectedRoute allowedRoles={['Parent']}>
                <ParentDashboardPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              // <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboardPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/admin/roles"
            element={
              // <ProtectedRoute allowedRoles={['Admin']}>
                <ManageRolesPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/admin/teachers"
            element={
              // <ProtectedRoute allowedRoles={['Admin']}>
                <TeachersPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              // <ProtectedRoute allowedRoles={['Admin']}>
                <StudentsPage />
              // </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
