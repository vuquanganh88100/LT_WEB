import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Typography, Divider } from 'antd';
import { 
  UserOutlined, 
  FileOutlined, 
  BookOutlined, 
  EyeOutlined 
} from '@ant-design/icons';
import './DashboardPage.css';

const { Title } = Typography;

const DashboardPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 120,
    totalPosts: 45,
    totalDocuments: 78,
    totalViews: 5280
  });

  useEffect(() => {
    // Get user info from localStorage to determine role
    const storedUserInfo = localStorage.getItem('user_info');
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }

    // Here you would typically fetch real stats from your API
    // For now we're using dummy data
  }, []);

  // Check if user is superadmin
  const isSuperAdmin = userInfo?.role?.includes(2);

  // Recent posts data - dummy data
  const recentPosts = [
    {
      id: 1,
      title: 'Cách học hiệu quả môn Toán cao cấp',
      author: 'Nguyễn Văn A',
      date: '2023-06-15',
      status: 'published'
    },
    {
      id: 2,
      title: 'Tài liệu ôn thi Lập trình C++',
      author: 'Trần Thị B',
      date: '2023-06-14',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Kinh nghiệm thực tập tại công ty phần mềm',
      author: 'Lê Văn C',
      date: '2023-06-12',
      status: 'published'
    }
  ];

  // Recent users data - dummy data, only shown to superadmin
  const recentUsers = [
    {
      id: 1,
      name: 'Nguyễn Văn X',
      email: 'nguyenx@example.com',
      role: 'user',
      joinDate: '2023-06-10'
    },
    {
      id: 2,
      name: 'Trần Thị Y',
      email: 'trany@example.com',
      role: 'admin',
      joinDate: '2023-06-09'
    },
    {
      id: 3,
      name: 'Lê Văn Z',
      email: 'lez@example.com',
      role: 'user',
      joinDate: '2023-06-08'
    }
  ];

  // Columns for recent posts table
  const postsColumns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status === 'published' ? 'Đã xuất bản' : 'Chờ duyệt'}
        </Tag>
      ),
    },
  ];

  // Columns for recent users table
  const usersColumns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'blue' : 'green'}>
          {role === 'admin' ? 'Admin' : 'User'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'joinDate',
      key: 'joinDate',
    },
  ];

  return (
    <div className="dashboard-container">
      <Title level={2}>Tổng quan</Title>
      
      <Row gutter={16} className="stats-row">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số bài viết"
              value={stats.totalPosts}
              prefix={<FileOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số tài liệu"
              value={stats.totalDocuments}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Lượt xem"
              value={stats.totalViews}
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
        
        {/* Only show user statistics to superadmin */}
        {isSuperAdmin && (
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng số người dùng"
                value={stats.totalUsers}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
        )}
      </Row>

      <Divider />
      
      <Title level={3}>Bài viết gần đây</Title>
      <Table 
        dataSource={recentPosts} 
        columns={postsColumns} 
        rowKey="id"
        pagination={false}
      />
      
      {/* Only show users section to superadmin */}
      {isSuperAdmin && (
        <>
          <Divider />
          <Title level={3}>Người dùng mới</Title>
          <Table 
            dataSource={recentUsers} 
            columns={usersColumns} 
            rowKey="id"
            pagination={false}
          />
        </>
      )}
    </div>
  );
};

export default DashboardPage;