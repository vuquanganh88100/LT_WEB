import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Row, Col, Empty, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import NavBarLayout from '../../layout/NavBar/NavBarLayout';
import FooterLayout from '../../layout/Footer/FooterLayout';
import { getSubjectByDepartment } from '../../services/SubjectService';
import './SubjectPage.css';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const SubjectPage = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [departmentName, setDepartmentName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (departmentId) {
      setLoading(true);
      getSubjectByDepartment(
        departmentId,
        (data) => {
          console.log("Subjects fetched:", data);
          setSubjects(data);
          // If department name is included in the response, set it
          if (data.length > 0 && data[0].department && data[0].department.name) {
            setDepartmentName(data[0].department.name);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching subjects:", error);
          setLoading(false);
        }
      );
    }
  }, [departmentId]);

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <NavBarLayout />

      <Content style={{ marginTop: 64, padding: '0 50px 50px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', margin: '40px 0 20px' }}>
            {departmentName ? `Các môn học của ${departmentName}` : 'Danh sách môn học'}
          </Title>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin size="large" />
            </div>
          ) : subjects.length > 0 ? (
            <Row gutter={[16, 16]}>
              {subjects.map((subject, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={index} style={{ display: 'flex' }}>
                  <Card 
                    hoverable 
                    className="subject-card" 
                    style={{ width: '100%' }}
                    onClick={() => {
                      // Navigate to subject detail page (to be implemented)
                      // navigate(`/subject/${subject.id}`);
                    }}
                  >
                    <Card.Meta
                      title={subject.title}
                      description={`Mã môn học: ${subject.code || 'N/A'}`}
                    />
                    <Paragraph style={{ marginTop: 10 }}>
                      {subject.description ? 
                        (subject.description.length > 100 ? 
                          `${subject.description.substring(0, 100)}...` : 
                          subject.description) : 
                        'Không có mô tả'
                      }
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty 
              description="Không tìm thấy môn học nào" 
              style={{ margin: '50px 0' }}
            />
          )}
        </div>
      </Content>

      <FooterLayout />
    </Layout>
  );
};

export default SubjectPage;