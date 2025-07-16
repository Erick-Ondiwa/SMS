import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPasswordForm from './components/Auth/ForgotPasswordForm';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import StudentHomePage from './pages/student/StudentHomePage.jsx';
import MyCourses from './pages/student/course/MyCourses.jsx';
import StudentAssignmentsPage from './pages/student/assignment/StudentAssignmentPage.jsx';
import StudentResultsPage from './pages/student/result/StudentResultsPage.jsx';

// Teacher Pages
import TeachersDashboard from './pages/teacher/TeachersDashboard.jsx';
import TeacherHome from './pages/teacher/TeacherHome.jsx';
import TeacherCourses from './pages/teacher/course/TeacherCourses.jsx';
import AttendanceOverview from './pages/teacher/attendance/AttendanceOverview.jsx';
import MarkAttendanceModal from './pages/teacher/attendance/MarkAttendanceModal.jsx';
import AssignmentsPage from './pages/teacher/assignment/AssignmentsPage.jsx';
import TeacherResultsPage from './pages/teacher/results/TeacherResultsPage.jsx';
// import TeacherProfile from './pages/teacher/Profile';

// Program Pages
import ProgramList from './components/programs/ProgramList.jsx';

import ParentDashboardPage from './pages/ParentDashboardPage.jsx';

// Admin Pages
import AdminDashboardPage from './admin/pages/AdminDashboardPage';
import ManageRolesPage from './admin/pages/ManageRolesPage.jsx';
import TeachersPage from './admin/pages/TeachersPage.jsx';
import StudentsPage from './admin/pages/StudentsPage.jsx';
import DashboardHome from './admin/pages/AdminDashboardHome.jsx';
import ManageUsersPage from './admin/pages/ManageUsersPage.jsx';
import CoursesPage from './admin/pages/CoursePage.jsx';

import RedirectIfAuthenticated from './routes/RedirectIfAuthenticated.jsx';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ------------- Landing page --------------- */}
          <Route path="/" element={<Landing />} />

          {/* ---------------Auth Paths ---------------- */}
          <Route path="/login" element={ <Login />}/>
          <Route path="/register" element={<Register /> }/>
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />

         
          {/*  *********** Pages ************* */}
                  {/* -------Student Pages */}
          <Route path="/student" element={<StudentDashboard />}>
            <Route index element={<StudentHomePage />} />
            <Route path="dashboard" element={<StudentHomePage />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="assignments" element={<StudentAssignmentsPage />} />
            <Route path="results" element={<StudentResultsPage />} />
            
            {/* <Route path="attendance" element={<ViewAttendance />} />  */}
          </Route>
          
                  {/* -------Teacher Routes */}
            <Route path="/teacher" element={<TeachersDashboard />}>
              <Route index element={<TeacherHome />} />
              <Route path="dashboard" element={<TeacherHome />} />
              <Route path="my-courses" element={<TeacherCourses />} />
              <Route path="student-attendance" element={<AttendanceOverview />} />
              <Route path="mark-attendance" element={<MarkAttendanceModal />} />
              <Route path="assignments" element={<AssignmentsPage />} />
              <Route path="results" element={<TeacherResultsPage />} />
              {/* <Route path="profile" element={<TeacherProfile />} /> */}
            </Route>
                  {/* -------Parent Pages */}
          <Route path="/parent/dashboard" element={<ParentDashboardPage />} />

          {/* ----------------- Admin Routes --------------- */}

          <Route path="/admin" element={<AdminDashboardPage />}>
            <Route index element={<DashboardHome />} /> {/* Default landing */}
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="/admin/users" element={<ManageUsersPage />} />
            <Route path="roles" element={<ManageRolesPage />}/>
            <Route path="teachers"element={<TeachersPage />}/>
            <Route path="students"element={<StudentsPage />}/>
            <Route path="courses" element={<CoursesPage />} />
            <Route path="programs" element={<ProgramList />} />


            {/* Add more nested routes here */}
          </Route>
         

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
