// src/pages/Auth/LoginPage.jsx
import React from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { loginService } from '../../services/AuthService';
import { appPath } from '../../config/appPath';
import useNotification from 'antd/es/notification/useNotification';
import useNotify from '../../hooks/useNotify';

const { Title } = Typography;

const LoginPage = () => {
    const notify = useNotify()
    const navigate = useNavigate();

    const onFinish = (values) => {
        loginService(
            {
                username: values.username,
                password: values.password
            },
            (response) => {
                console.log(response)
                localStorage.setItem('access_token', response.token);

                localStorage.setItem('user_info', JSON.stringify(response.userDto));

                message.success('Đăng nhập thành công!');

                const roleValue = response.userDto.role[0];
                console.log("User role:", roleValue);

                switch (roleValue) {
                    case 2: // Admin
                    case 1: // Superadmin
                        navigate(appPath.adminDashboard); // Both admin and superadmin share the same dashboard
                        break;
                    case 3: // Regular user
                        navigate(appPath.home); // Regular users go to home page
                        break;
                    default:
                        navigate(appPath.home);
                }
            },
            (error) => {
                console.error('Login failed:', error);
                message.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!');
                notify.error(error?.response?.data?.message || "Đăng nhập thất bại")
            }
        );
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('Vui lòng kiểm tra lại thông tin!');
    };


    return (
        <>
            <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
                Đăng nhập
            </Title>
            <Form
                name="login"
                layout="vertical"
                autoComplete="off"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    name="username"
                    label="Tên đăng nhập"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                >
                    <Input size="large" placeholder="Nhập tên đăng nhập" />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password size="large" placeholder="Nhập mật khẩu" />
                </Form.Item>
                <Form.Item style={{ marginTop: 16, textAlign: 'left' }}>
                    <a
                        href="#"
                        style={{
                            fontSize: 14, color: '#999999', textDecoration: 'none'
                        }}
                    >
                        Quên mật khẩu?
                    </a>
                </Form.Item>
                <Form.Item >
                    <Button type="primary" htmlType="submit" block size="large">
                        Đăng nhập
                    </Button>
                </Form.Item>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ color: '#666', fontSize: 14 }}>
                        Chưa có tài khoản?
                    </span>
                    <Link
                        style={{
                            color: '#1890ff',
                            textDecoration: 'none',
                            marginLeft: 4,
                            fontWeight: 500
                        }}
                        to="/register"
                    >
                        Đăng ký ngay
                    </Link>
                </div>
            </Form >
        </>
    );
};

export default LoginPage;