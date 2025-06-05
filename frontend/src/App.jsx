import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPasswordForm from './components/Auth/ForgotPasswordForm';

import ParentDashboardPage from './pages/ParentDashboardPage.jsx';
import StudentDashboardPage from './pages/StudentDashboardPage.jsx';
import TeacherDashboardPage from './pages/TeacherDashboardPage.jsx';

import AdminDashboardPage from './admin/pages/AdminDashboardPage';
import ManageRolesPage from './admin/pages/ManageRolesPage.jsx';

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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;


// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Landing from './pages/Landing';
// import Register from './pages/Register';
// import Login from './pages/Login';
// import ForgotPasswordForm from './components/Auth/ForgotPasswordForm';

// // User dashboards
// import ParentDashboardPage from './pages/ParentDashboardPage.jsx';
// import StudentDashboardPage from './pages/StudentDashboardPage.jsx';
// import TeacherDashboardPage from './pages/TeacherDashboardPage.jsx';

// import AdminDashboardPage from './admin/pages/AdminDashboardPage';
// import ManageRolesPage from './admin/pages/ManageRolesPage.jsx';


// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Landing />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/forgot-password" element={<ForgotPasswordForm />} />

//         {/* User dashboards */}
//         <Route path="/student/dashboard" element={<StudentDashboardPage />} />
//         <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
//         <Route path="/parent/dashboard" element={<ParentDashboardPage />} />

        

//         <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
//         <Route path="/admin/roles" element={<ManageRolesPage />} />


//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;