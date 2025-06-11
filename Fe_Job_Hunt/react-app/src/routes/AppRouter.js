import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '../layout/AuthLayout';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import { appPath } from '../config/appPath';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to={appPath.login} replace />} />
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

            {/* User Dashboard */}
            <Route path={appPath.userDashboard} element={
                <div style={{ padding: '20px' }}>
                    <h1>User Dashboard</h1>
                    <p>This is the user dashboard page. Add your user dashboard content here.</p>
                </div>
            } />

            {/* Admin Dashboard */}
            <Route path={appPath.adminDashboard} element={
                <div style={{ padding: '20px' }}>
                    <h1>Admin Dashboard</h1>
                    <p>This is the admin dashboard page. Add your admin dashboard content here.</p>
                </div>
            } />

            {/* Super Admin Dashboard */}
            <Route path={appPath.superAdminDashboard} element={
                <div style={{ padding: '20px' }}>
                    <h1>Super Admin Dashboard</h1>
                    <p>This is the super admin dashboard page. Add your super admin dashboard content here.</p>
                </div>
            } />

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
