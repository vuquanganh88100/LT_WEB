import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '../layout/AuthLayout';
import DashboardLayout from '../layout/DashboardLayout/DashboardLayout';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import HomePage from '../pages/Home/HomePage';
import DashboardPage from '../pages/Admin/Dashboard/DashboardPage';
import UsersPage from '../pages/Admin/Users/UsersPage';
import DepartmentAdmin from '../pages/Admin/Department/DepartmentAdmin';
import SubjectAdmin from '../pages/Admin/Subject/SubjectAdmin';
import DocumentAdmin from '../pages/Admin/Document/DocumentAdmin';
import SubjectPage from '../pages/Subject/SubjectPage';
import DocumentPage from '../pages/Document/Document';
import PostPage from '../pages/Post/Post';
import PostDetail from '../pages/Post/PostDetail';
import { appPath } from '../config/appPath';
import { PostAdmin } from '../pages/Admin/Post/PostAdmin';
import PostAdminDetail from '../pages/Admin/Post/PostAdminDetail';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to={appPath.home} replace />} />

            {/* Auth Routes */}
            <Route path={appPath.login} element={
                <AuthLayout>
                    <LoginPage />
                </AuthLayout>
            } />
            <Route path={appPath.register} element={
                <AuthLayout>
                    <RegisterPage />
                </AuthLayout>
            } />

            {/* Home Page - Accessible to both guests and logged-in users */}
            <Route path={appPath.home} element={<HomePage />} />

            {/* Knowledge/Blog Pages */}
            <Route path="/knowledge" element={<PostPage />} />
            <Route path="/knowledge/post/:postId" element={<PostDetail />} />

            {/* Faculty document pages - placeholder routes */}
            <Route path="/documents/:faculty" element={
                <div style={{ padding: '20px', marginTop: '64px' }}>
                    <h1>Tài liệu khoa</h1>
                    <p>Trang tài liệu khoa sẽ được phát triển sau.</p>
                </div>
            } />

            {/* Subject page - displays subjects by department */}
            <Route path="/subjects/:departmentId" element={<SubjectPage />} />
            
            {/* Document page - displays documents for a subject */}
            <Route path="/subject/:subjectId/documents" element={<DocumentPage />} />

            {/* User Dashboard */}
            <Route path={appPath.userDashboard} element={
                <div style={{ padding: '20px', marginTop: '64px' }}>
                    <h1>User Dashboard</h1>
                    <p>This is the user dashboard page. Add your user dashboard content here.</p>
                </div>
            } />

            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={<DashboardLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="departments" element={<DepartmentAdmin />} />
                <Route path="posts" element={<PostAdmin />} />
                <Route path="posts/:postId" element={<PostAdminDetail />} />
                <Route path="documents" element={<DocumentAdmin />} />
               
                <Route path="subjects" element={<SubjectAdmin />} />

            </Route>

            {/* Redirect adminDashboard to new structure */}
            <Route path={appPath.adminDashboard} element={<Navigate to="/admin/dashboard" replace />} />

            {/* 404 Not Found */}
            <Route path={appPath.notFound} element={
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    fontSize: '24px',
                    color: '#666'
                }}>
                    404 - Trang không tồn tại
                </div>
            } />
        </Routes>
    );
};

export default AppRoutes;
