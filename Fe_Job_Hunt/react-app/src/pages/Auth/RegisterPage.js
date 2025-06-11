// src/pages/Auth/RegisterPage.jsx
import React from 'react';
import { Form, Input, Button, Typography, message, Select, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { registerService } from '../../services/AuthService';
import useNotify from '../../hooks/useNotify';

const { Title } = Typography;

const RegisterPage = () => {
    const notify=useNotify();
    const navigate = useNavigate();
    const onFinish = (values) => {
        let gender=1
        if(values.gender==="Nam"){
            values.gender=0
        }
        registerService(
            {
                firstName: values.firstName,
                lastName:values.lastName,
                password:values.password,
                userName:values.username,
                email:values.email,
                gender: gender,
                role:[3]
            },
            (response)=>{
                notify.success("Đăng ký thành công")
            },
            (error)=>{
                notify.error(error?.response?.data?.message || "Đăng ký thất bại")
            }
        )
        
    }
    return (
        <>
            <Title level={3} style={{ textAlign: 'center', marginBottom: 14, marginTop: 8 }}>
                Đăng ký tài khoản
            </Title>
            <Form
                name="register"
                layout="vertical"
                autoComplete="off"
                onFinish={onFinish}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="firstName"
                            label="Họ"
                            rules={[
                                { required: true, message: 'Vui lòng nhập họ!' },
                                { min: 1, message: 'Họ phải có ít nhất 1 ký tự!' }
                            ]}
                        >
                            <Input size="large" placeholder="Nhập họ" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="lastName"
                            label="Tên"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên!' },
                                { min: 1, message: 'Tên phải có ít nhất 1 ký tự!' }
                            ]}
                        >
                            <Input size="large" placeholder="Nhập tên" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                >
                    <Input size="large" placeholder="Nhập email" />
                </Form.Item>

                <Form.Item
                    name="username"
                    label="Tên đăng nhập"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                        { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' }
                    ]}
                >
                    <Input size="large" placeholder="Nhập tên đăng nhập" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                    ]}
                >
                    <Input.Password size="large" placeholder="Nhập mật khẩu" />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Xác nhận mật khẩu"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password size="large" placeholder="Nhập lại mật khẩu" />
                </Form.Item>
                <Form.Item
                    name="gender"
                    label="Giới tính"
                    rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                    style={{ textAlign: 'left' }}
                >
                    <Select
                        placeholder="Chọn giới tính"
                        size="large"
                        style={{ width: '50%', height: '35px' }}
                    >
                        <Select.Option value="male">Nam</Select.Option>
                        <Select.Option value="female">Nữ</Select.Option>
                        <Select.Option value="other">Khác</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item style={{ marginBottom: 16 }}>
                    <Button type="primary" htmlType="submit" block size="large">
                        Đăng ký
                    </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                    <span style={{ color: '#666', fontSize: 14 }}>
                        Đã có tài khoản?
                    </span>
                    <a
                        href="#"
                        style={{
                            color: '#1890ff',
                            textDecoration: 'none',
                            marginLeft: 4,
                            fontWeight: 500
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/login');
                        }}
                    >
                        Đăng nhập ngay
                    </a>
                </div>
            </Form>
        </>
    );
};

export default RegisterPage;