import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Row, Col, Button, Space, Carousel } from 'antd';
import {
  BookOutlined,
  ReadOutlined,
  TeamOutlined,
  LoginOutlined,
  UserAddOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import NavBarLayout from '../../layout/NavBar/NavBarLayout';
import FooterLayout from '../../layout/Footer/FooterLayout';
import { appPath } from '../../config/appPath';
import './HomePage.css';
import { getAllDepartment } from '../../services/DepartmentService';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [departments, setDepartments] = useState([])
  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  useEffect(() => {
    getAllDepartment(
      {},
      (data) => {
        console.log("Departments fetched:", data);
        setDepartments(data);
      },
      (error) => {
        console.error("Lỗi khi fetch department:", error);
      }
    );
  }, []);
  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <NavBarLayout />

      <Content style={{ marginTop: 64 }}>
        {/* Banner Section */}
        <div className="home-banner">
          <Title level={1}>
            Tài liệu và Kiến thức Đại học
          </Title>
          <Paragraph>
            Nền tảng chia sẻ tài liệu học tập, kiến thức và kỹ năng cho sinh viên đại học.
            Khám phá tài liệu từ các khoa và học hỏi từ cộng đồng sinh viên.
          </Paragraph>
          <Button type="primary" size="large" style={{ marginTop: 20 }}>
            <Link to="/knowledge">Khám phá ngay</Link>
          </Button>
        </div>

        <div style={{ padding: '0 50px 50px' }}>
          {/* Features Section */}
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Title level={2} style={{ textAlign: 'center', margin: '40px 0' }}>
              Tìm kiếm tài liệu & kiến thức
            </Title>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} lg={8}>
                <Card
                  className="feature-card"
                  title="Tài liệu đại học"
                  hoverable
                  cover={
                    <div className="feature-icon">
                      <BookOutlined style={{ fontSize: 64, color: '#1890ff' }} />
                    </div>
                  }
                >
                  <p>Truy cập tài liệu học tập từ các khoa và ngành học khác nhau. Bao gồm sách, bài giảng, đề thi và nhiều tài liệu tham khảo khác.</p>
                  <Button type="primary" block>
                    <Link to="/documents/engineering">Xem tài liệu</Link>
                  </Button>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <Card
                  className="feature-card"
                  title="Kiến thức & Blog"
                  hoverable
                  cover={
                    <div className="feature-icon">
                      <ReadOutlined style={{ fontSize: 64, color: '#52c41a' }} />
                    </div>
                  }
                >
                  <p>Bài viết, hướng dẫn và chia sẻ kinh nghiệm từ cộng đồng. Học hỏi từ trải nghiệm của những người đi trước và nâng cao kỹ năng.</p>
                  <Button type="primary" block>
                    <Link to="/knowledge">Đọc bài viết</Link>
                  </Button>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <Card
                  className="feature-card"
                  title="Cộng đồng"
                  hoverable
                  cover={
                    <div className="feature-icon">
                      <TeamOutlined style={{ fontSize: 64, color: '#f5222d' }} />
                    </div>
                  }
                >
                  <p>Kết nối với sinh viên và giảng viên trong cộng đồng học tập. Tham gia thảo luận, đặt câu hỏi và chia sẻ kiến thức với mọi người.</p>
                  <Button type="primary" block>
                    Tham gia ngay
                  </Button>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Popular Faculties */}
          <div style={{ maxWidth: 1200, margin: '60px auto 0' }}>
            <Title level={2} style={{ textAlign: 'center', margin: '40px 0' }}>
              Khoa phổ biến
            </Title>

            <div className="departments-container">
              {/* Desktop view with space-between */}
              <div className="departments-desktop">
                <Row justify="space-between" gutter={[16, 16]}>
                  {departments.map((department, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={index} style={{ display: 'flex' }}>
                      <Card 
                        hoverable 
                        className="department-card" 
                        style={{ width: '100%' }}
                        onClick={() => navigate(`/subjects/${department.departmentId}`)}
                      >
                        <Card.Meta
                          title={department.name}
                        />
                        <Button type="link" style={{ padding: 0, marginTop: 10 }}>
                          Xem các môn học →
                        </Button>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
            {/* Login/Register Call-to-Action - Only shown for non-logged-in users */}
            {!isLoggedIn && (
              <div style={{
                background: 'linear-gradient(to right, #1890ff, #52c41a)',
                padding: '40px 20px',
                borderRadius: '8px',
                textAlign: 'center',
                margin: '60px 0 20px'
              }}>
                <Title level={3} style={{ color: 'white', marginBottom: '20px' }}>
                  Đăng nhập để truy cập đầy đủ nội dung
                </Title>
                <Paragraph style={{ color: 'white', fontSize: '16px', marginBottom: '30px' }}>
                  Hãy tham gia cùng cộng đồng để có thể truy cập và tải về tài liệu học tập, đóng góp kiến thức và kết nối với sinh viên khác.
                </Paragraph>
                <Space size="large">
                  <Button
                    type="primary"
                    size="large"
                    icon={<LoginOutlined />}
                    onClick={() => navigate(appPath.login)}
                    style={{ backgroundColor: 'white', color: '#1890ff', borderColor: 'white' }}
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    type="default"
                    size="large"
                    icon={<UserAddOutlined />}
                    onClick={() => navigate(appPath.register)}
                    style={{ borderColor: 'white', color: 'white' }}
                    ghost
                  >
                    Đăng ký tài khoản
                  </Button>
                </Space>
              </div>
            )}
          </div>
        </div>
      </Content>

      <FooterLayout />
    </Layout>
  );
};

export default HomePage;