import React from 'react';
import { Layout, Typography, Row, Col, Divider } from 'antd';
import { Link } from 'react-router-dom';
import './FooterLayout.css';

const { Footer } = Layout;
const { Title, Paragraph } = Typography;

const FooterLayout = () => {
  return (
    <Footer className="footer-container">
      <div className="footer-content">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Title level={4} className="footer-title">Về chúng tôi</Title>
            <Paragraph className="footer-text">
              Blog Chia Sẻ Khóa Học là nền tảng chia sẻ tài liệu và kiến thức học tập dành cho sinh viên đại học.
            </Paragraph>
          </Col>
          <Col xs={24} md={8}>
            <Title level={4} className="footer-title">Liên kết nhanh</Title>
            <ul className="footer-links">
              <li><Link to="/knowledge">Kiến thức</Link></li>
              <li><Link to="/documents/engineering">Tài liệu đại học</Link></li>
              <li><Link to="/register">Đăng ký</Link></li>
            </ul>
          </Col>
          <Col xs={24} md={8}>
            <Title level={4} className="footer-title">Liên hệ</Title>
            <Paragraph className="footer-text">
              Email: contact@example.com<br />
              Điện thoại: (123) 456-7890
            </Paragraph>
          </Col>
        </Row>
        <Divider className="footer-divider" />
        <Paragraph className="footer-copyright">
          Blog Chia Sẻ Khóa Học © {new Date().getFullYear()} - Đồ án
        </Paragraph>
      </div>
    </Footer>
  );
};

export default FooterLayout;