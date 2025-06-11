import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Row, Col, Divider, Button, Space } from 'antd';
import { BookOutlined, ReadOutlined, TeamOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import NavBarLayout from '../../layout/NavBar/NavBarLayout';
import { appPath } from '../../config/appPath';
import './HomePage.css';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
    }
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
            
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card hoverable>
                  <Card.Meta 
                    title="Khoa Công nghệ thông tin" 
                    description="Sách, bài giảng, code mẫu và tài liệu tham khảo cho sinh viên CNTT."
                  />
                  <Button type="link" style={{ padding: 0, marginTop: 10 }}>
                    <Link to="/documents/it">Xem tài liệu →</Link>
                  </Button>
                </Card>
              </Col>
              
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card hoverable>
                  <Card.Meta 
                    title="Khoa Kinh tế" 
                    description="Tài liệu kinh tế học, quản trị kinh doanh, marketing và tài chính."
                  />
                  <Button type="link" style={{ padding: 0, marginTop: 10 }}>
                    <Link to="/documents/economics">Xem tài liệu →</Link>
                  </Button>
                </Card>
              </Col>
              
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card hoverable>
                  <Card.Meta 
                    title="Khoa Kỹ thuật" 
                    description="Tài liệu kỹ thuật, cơ khí, điện tử và các ngành kỹ thuật khác."
                  />
                  <Button type="link" style={{ padding: 0, marginTop: 10 }}>
                    <Link to="/documents/engineering">Xem tài liệu →</Link>
                  </Button>
                </Card>
              </Col>
              
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card hoverable>
                  <Card.Meta 
                    title="Khoa Y" 
                    description="Tài liệu y học, dược học và các ngành y tế liên quan."
                  />
                  <Button type="link" style={{ padding: 0, marginTop: 10 }}>
                    <Link to="/documents/medicine">Xem tài liệu →</Link>
                  </Button>
                </Card>
              </Col>
            </Row>
            
            <div style={{ textAlign: 'center', margin: '30px 0' }}>
              <Button type="primary">Xem tất cả khoa</Button>
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
      
      <Layout.Footer style={{ textAlign: 'center', background: '#001529', color: 'white', padding: '24px 50px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Title level={4} style={{ color: 'white' }}>Về chúng tôi</Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.65)' }}>
                Blog Chia Sẻ Khóa Học là nền tảng chia sẻ tài liệu và kiến thức học tập dành cho sinh viên đại học.
              </Paragraph>
            </Col>
            <Col xs={24} md={8}>
              <Title level={4} style={{ color: 'white' }}>Liên kết nhanh</Title>
              <ul style={{ listStyle: 'none', padding: 0, color: 'rgba(255,255,255,0.65)' }}>
                <li><Link to="/knowledge" style={{ color: 'rgba(255,255,255,0.65)' }}>Kiến thức</Link></li>
                <li><Link to="/documents/engineering" style={{ color: 'rgba(255,255,255,0.65)' }}>Tài liệu đại học</Link></li>
                <li><Link to={"/register"} style={{ color: 'rgba(255,255,255,0.65)' }}>Đăng ký</Link></li>
              </ul>
            </Col>
            <Col xs={24} md={8}>
              <Title level={4} style={{ color: 'white' }}>Liên hệ</Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.65)' }}>
                Email: contact@example.com<br />
                Điện thoại: (123) 456-7890
              </Paragraph>
            </Col>
          </Row>
          <Divider style={{ background: 'rgba(255,255,255,0.2)' }} />
          <Paragraph style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            Blog Chia Sẻ Khóa Học © {new Date().getFullYear()} - Đồ án
          </Paragraph>
        </div>
      </Layout.Footer>
    </Layout>
  );
};

export default HomePage;