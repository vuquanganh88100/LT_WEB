import React, { useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Layout, Typography, Button, Tag, Avatar, Row, Col, Card, Divider, Input, Form, message, List } from 'antd';
import { ArrowLeftOutlined, UserOutlined, CalendarOutlined, EyeOutlined, LikeOutlined, CommentOutlined, SendOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import NavBarLayout from '../../layout/NavBar/NavBarLayout';
import FooterLayout from '../../layout/Footer/FooterLayout';
import './PostDetail.css';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const PostDetail = () => {
  const location = useLocation();
  const { postId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([
    
  ]);
  
  // Get post data from navigation state or use default
  const post = location.state?.post || {
    id: postId,
    title: "Bài viết không tìm thấy",
    content: "Không thể tải nội dung bài viết.",
    authorName: "Không xác định",
    publishDate: new Date().toISOString().split('T')[0],
    views: 0,
    likes: 0,
    comments: comments.length,
    categories: []
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmitComment = async (values) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newComment = {
        id: comments.length + 1,
        author: "Người dùng hiện tại", // Thay bằng tên user thực tế
        content: values.comment,
        createdAt: new Date().toISOString(),
        avatar: null
      };
      
      setComments([...comments, newComment]);
      form.resetFields();
      message.success('Bình luận đã được thêm thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra khi thêm bình luận!');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const formatCommentDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Vừa xong';
      if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours} giờ trước`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays} ngày trước`;
      
      return date.toLocaleDateString('vi-VN');
    } catch (error) {
      return dateString;
    }
  };

  const renderContent = (content) => {
    if (!content) return null;
    
    // Check if content contains markdown syntax
    const hasMarkdown = content.includes('#') || content.includes('```') || content.includes('**') || content.includes('*') || content.includes('[');
    
    if (hasMarkdown) {
      return (
        <div className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      );
    } else {
      // For plain text, split into paragraphs
      const paragraphs = content.split('\n\n');
      
      return paragraphs.map((paragraph, index) => (
        <Paragraph key={index} style={{ marginBottom: '16px', lineHeight: '1.8' }}>
          {paragraph}
        </Paragraph>
      ));
    }
  };

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <NavBarLayout />
      
      <Content style={{ marginTop: 64, padding: '24px 0' }}>
        <div className="post-detail-container">
          <div className="post-detail-header">
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleGoBack}
              className="back-button"
            >
              Quay lại
            </Button>
          </div>

          <Row gutter={24}>
            <Col xs={24} lg={24}>
              <Card className="post-detail-card">
                <div className="post-detail-meta">
                  {post.categories && post.categories.length > 0 && (
                    <div className="post-categories">
                      {post.categories.map((category, index) => (
                        <Tag key={index} color="blue">{category}</Tag>
                      ))}
                    </div>
                  )}
                </div>

                <Title level={1} className="post-detail-title">
                  {post.title}
                </Title>

                <div className="post-detail-author-info">
                  <div className="author-section">
                    <Avatar size="large" icon={<UserOutlined />} />
                    <div className="author-details">
                      <Text strong>{post.authorName || "Tác giả"}</Text>
                      <div className="post-meta">
                        <span>
                          <CalendarOutlined />
                          {formatDate(post.createdAt || post.publishDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="post-stats">
                    <span><EyeOutlined /> {post.views || 0}</span>
                    <span><LikeOutlined /> {post.likes || 0}</span>
                    <span><CommentOutlined /> {comments.length}</span>
                  </div>
                </div>

                <Divider />

                <div className="post-detail-content">
                  {renderContent(post.content)}
                </div>
              </Card>

              {/* Comments Section */}
              <Card title={`Bình luận (${comments.length})`} className="comments-section">
                {/* Comment Form */}
                <Form form={form} onFinish={handleSubmitComment} className="comment-form">
                  <Form.Item
                    name="comment"
                    rules={[
                      { required: true, message: 'Vui lòng nhập bình luận!' },
                      { min: 5, message: 'Bình luận phải có ít nhất 5 ký tự!' }
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Viết bình luận của bạn..."
                      showCount
                      maxLength={500}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      icon={<SendOutlined />}
                      className="submit-comment-btn"
                      loading={loading}
                      disabled={loading}
                    >
                      {loading ? 'Đang gửi...' : 'Gửi bình luận'}
                    </Button>
                  </Form.Item>
                </Form>

                <Divider />

                {/* Comments List */}
                <List
                  className="comments-list"
                  itemLayout="horizontal"
                  dataSource={comments}
                  locale={{
                    emptyText: (
                      <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
                        <CommentOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                        <div>Chưa có bình luận nào</div>
                        <div style={{ fontSize: '14px', marginTop: '8px' }}>
                          Hãy là người đầu tiên bình luận về bài viết này!
                        </div>
                      </div>
                    )
                  }}
                  renderItem={(comment) => (
                    <List.Item className="comment-item">
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            icon={<UserOutlined />} 
                            size="large"
                          />
                        }
                        title={
                          <div className="comment-header">
                            <Text strong className="comment-author">
                              {comment.author}
                            </Text>
                            <Text className="comment-time">
                              {formatCommentDate(comment.createdAt)}
                            </Text>
                          </div>
                        }
                        description={
                          <div className="comment-content">
                            {comment.content}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>

      <FooterLayout />
    </Layout>
  );
};

export default PostDetail;