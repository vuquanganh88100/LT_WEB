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
import SubjectPage from '../pages/Subject/SubjectPage';
import DocumentPage from '../pages/Document/Document';
import { appPath } from '../config/appPath';

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

            {/* Knowledge Page - Will be implemented later */}
            <Route path="/knowledge" element={
                <div style={{ padding: '20px', marginTop: '64px' }}>
                    <h1>Kiến thức</h1>
                    <p>Trang kiến thức và blog sẽ được phát triển sau.</p>
                </div>
            } />

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
                <Route path="posts" element={
                    <div>
                        <h2>Quản lý bài viết</h2>
                        <p>Trang quản lý bài viết sẽ được phát triển sau.</p>
                    </div>
                } />
                <Route path="documents" element={
                    <div>
                        <h2>Quản lý tài liệu</h2>
                        <p>Trang quản lý tài liệu sẽ được phát triển sau.</p>
                    </div>
                } />
                <Route path="settings" element={
                    <div>
                        <h2>Cài đặt hệ thống</h2>
                        <p>Trang cài đặt hệ thống sẽ được phát triển sau.</p>
                    </div>
                } />
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
