import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Button, Avatar, Space, message } from 'antd';
import { 
  BookOutlined, 
  ReadOutlined, 
  UserOutlined, 
  HomeOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { appPath } from '../../config/appPath';
import './NavBarLayout.css';

const { Header } = Layout;

function NavBarLayout() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  
  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUserInfo = localStorage.getItem('user_info');
    
    if (token && storedUserInfo) {
      setIsLoggedIn(true);
      try {
        setUserInfo(JSON.parse(storedUserInfo));
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    setIsLoggedIn(false);
    setUserInfo(null);
    message.success('Đăng xuất thành công!');
    navigate(appPath.login);
  };

  const universityDocumentsMenu = (
    <Menu>
      <Menu.Item key="faculty-engineering">
        <Link to="/documents/engineering">Khoa Kỹ thuật</Link>
      </Menu.Item>
      <Menu.Item key="faculty-economics">
        <Link to="/documents/economics">Khoa Kinh tế</Link>
      </Menu.Item>
      <Menu.Item key="faculty-medicine">
        <Link to="/documents/medicine">Khoa Y</Link>
      </Menu.Item>
      <Menu.Item key="faculty-it">
        <Link to="/documents/it">Khoa Công nghệ thông tin</Link>
      </Menu.Item>
      <Menu.Item key="faculty-science">
        <Link to="/documents/science">Khoa Khoa học tự nhiên</Link>
      </Menu.Item>
      <Menu.Item key="faculty-social">
        <Link to="/documents/social">Khoa Khoa học xã hội</Link>
      </Menu.Item>
    </Menu>
  );

  // User menu items based on login status
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Hồ sơ cá nhân</Link>
      </Menu.Item>
      {/* Show admin dashboard for both admin and superadmin */}
      {(userInfo?.role?.includes(1) || userInfo?.role?.includes(2)) && (
        <Menu.Item key="admin-dashboard">
          <Link to={appPath.adminDashboard}>Dashboard</Link>
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="header">
      <div className="logo">
        <Link to={appPath.home}>
          <h1>EDU BLOG</h1>
        </Link>
      </div>
      <Menu theme="dark" mode="horizontal" className="main-menu">
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to={appPath.home}>Trang chủ</Link>
        </Menu.Item>
        <Menu.Item key="university-docs" icon={<BookOutlined />}>
          <Dropdown overlay={universityDocumentsMenu} placement="bottomCenter">
            <span>Tài liệu đại học</span>
          </Dropdown>
        </Menu.Item>
        <Menu.Item key="knowledge" icon={<ReadOutlined />}>
          <Link to="/knowledge">Kiến thức</Link>
        </Menu.Item>
      </Menu>
      <div className="user-section">
        {isLoggedIn ? (
          // For logged-in users: show avatar dropdown
          <Dropdown overlay={userMenu} placement="bottomRight" arrow>
            <Button type="text" className="user-button" icon={
              <Avatar size="small" className="user-avatar">
                {userInfo?.firstName?.charAt(0) || userInfo?.userName?.charAt(0) || 'U'}
              </Avatar>
            }>
              {userInfo?.firstName || userInfo?.userName}
            </Button>
          </Dropdown>
        ) : (
          <Space className="login-section">
            <Button type="primary" onClick={() => navigate(appPath.login)}>
              Đăng nhập
            </Button>
            <Button onClick={() => navigate(appPath.register)}>
              Đăng ký
            </Button>
          </Space>
        )}
      </div>
    </Header>
  );
}

export default NavBarLayout;