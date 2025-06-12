import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Typography, Spin } from 'antd';
import {
  UserOutlined,
  DashboardOutlined,
  BookOutlined,
  FileOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import './DashboardLayout.css';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('user_info');
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
    setLoading(false);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    navigate('/login');
  };

  // Check if user is admin or superadmin
  const isSuperAdmin = userInfo?.role?.includes(1);
  const isAdmin = userInfo?.role?.includes(2);

  if (loading) {
    return <Spin size="large" className="dashboard-loading" />;
  }

  // Redirect if not admin or superadmin
  if (!isAdmin && !isSuperAdmin) {
    navigate('/login');
    return null;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="dashboard-sider"
      >
        <div className="logo-container">
          {!collapsed ? (
            <Title level={4} style={{ color: 'white', margin: '16px 0', textAlign: 'center' }}>
              EDU BLOG
            </Title>
          ) : (
            <Title level={4} style={{ color: 'white', margin: '16px 0', textAlign: 'center' }}>
              EB
            </Title>
          )}
        </div>
        <Menu theme="dark" selectedKeys={[location.pathname]} mode="inline">
          <Menu.Item key="/admin/dashboard" icon={<DashboardOutlined />}>
            <Link to="/admin/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="/admin/posts" icon={<FileOutlined />}>
            <Link to="/admin/posts">Quản lý bài viết</Link>
          </Menu.Item>
          <Menu.Item key="/admin/documents" icon={<BookOutlined />}>
            <Link to="/admin/documents">Quản lý tài liệu</Link>
          </Menu.Item>

          {/* Only show user management for superadmin */}
          {isSuperAdmin && (
            <>
              <Menu.Item key="/admin/departments" icon={<TeamOutlined />}>
                <Link to="/admin/departments">Quản lý phòng ban</Link>
              </Menu.Item>
              <Menu.Item key="/admin/subjects" icon={<BookOutlined />}>
                <Link to="/admin/subjects">Quản lý môn học</Link>
              </Menu.Item>
            </>
          )}
         

          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            Đăng xuất
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="dashboard-header">
          <div className="dashboard-user-info">
            <Avatar size="small" icon={<UserOutlined />} />
            <Text style={{ color: '#333', marginLeft: '8px' }}>
              {userInfo?.firstName || userInfo?.userName}
              <span className="user-role">
                {isSuperAdmin ? '(Super Admin)' : '(Admin)'}
              </span>
            </Text>
          </div>
        </Header>
        <Content className="dashboard-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;