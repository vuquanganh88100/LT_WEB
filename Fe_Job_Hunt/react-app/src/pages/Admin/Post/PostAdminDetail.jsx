import React, { useState, useEffect } from 'react';
import {
  Layout, Typography, Button, Tag, Avatar, Row, Col, Card, Divider, 
  Space, Tooltip, Popconfirm, Modal, Form, Input, Select, message,
  Descriptions, Timeline, Table
} from 'antd';
import {
  ArrowLeftOutlined, UserOutlined, CalendarOutlined, EyeOutlined, 
  LikeOutlined, CommentOutlined, EditOutlined, DeleteOutlined,
  CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined,
  HistoryOutlined, MessageOutlined, SettingOutlined
} from '@ant-design/icons';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import './PostAdminDetail.css';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Constants
const POST_STATUS = {
  draft: { color: 'default', text: 'Bản nháp', icon: <EditOutlined /> },
  pending: { color: 'gold', text: 'Chờ duyệt', icon: <ExclamationCircleOutlined /> },
  published: { color: 'green', text: 'Đã xuất bản', icon: <CheckCircleOutlined /> },
  rejected: { color: 'red', text: 'Từ chối', icon: <CloseCircleOutlined /> }
};

// Fake comments data
const fakeComments = [
  {
    id: 1,
    author: "Nguyễn Văn A",
    content: "Bài viết rất hay và bổ ích! Cảm ơn tác giả đã chia sẻ.",
    createdAt: "2023-12-01T10:30:00Z",
    status: "approved"
  },
  {
    id: 2,
    author: "Trần Thị B", 
    content: "Mình đã áp dụng những gì được chia sẻ và thấy hiệu quả rất tốt.",
    createdAt: "2023-12-01T14:15:00Z",
    status: "approved"
  },
  {
    id: 3,
    author: "Spam User",
    content: "Click here to win money!!! 🤑🤑🤑",
    createdAt: "2023-12-02T09:20:00Z",
    status: "pending"
  }
];

// Fake activity history
const fakeHistory = [
  {
    time: "2023-12-02T10:30:00Z",
    action: "Tạo bài viết",
    user: "Lê Minh C",
    details: "Bài viết được tạo với trạng thái 'Bản nháp'"
  },
  {
    time: "2023-12-02T11:00:00Z", 
    action: "Cập nhật nội dung",
    user: "Lê Minh C",
    details: "Thêm phần giới thiệu và cập nhật danh mục"
  },
  {
    time: "2023-12-02T11:30:00Z",
    action: "Gửi duyệt",
    user: "Lê Minh C", 
    details: "Chuyển trạng thái từ 'Bản nháp' sang 'Chờ duyệt'"
  }
];

const PostAdminDetail = () => {
  const location = useLocation();
  const { postId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState(fakeComments);
  const [history, setHistory] = useState(fakeHistory);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Get post data from navigation state or fake data
  useEffect(() => {
    const postData = location.state?.post || {
      id: postId,
      title: "Cơ hội việc làm cho sinh viên IT sau tốt nghiệp",
      content: `# Cơ hội việc làm cho sinh viên IT

## Tổng quan thị trường IT Việt Nam

Ngành **Công nghệ thông tin** đang phát triển mạnh mẽ tại Việt Nam với nhiều cơ hội việc làm hấp dẫn.

### Các vị trí hot nhất:

1. **Frontend Developer**
   - React, Vue.js, Angular
   - Mức lương: 8-25 triệu VND

2. **Backend Developer**
   - Node.js, Java, Python  
   - Mức lương: 10-30 triệu VND

3. **Full-stack Developer**
   - Kết hợp cả frontend và backend
   - Mức lương: 15-35 triệu VND

### Kỹ năng cần thiết:

- Thành thạo ít nhất 1 ngôn ngữ lập trình
- Hiểu biết về *database* và *API*
- Kỹ năng làm việc nhóm
- Tư duy logic và giải quyết vấn đề

> **Lời khuyên**: Hãy xây dựng portfolio mạnh với các dự án thực tế để tăng cơ hội được tuyển dụng.`,
      status: "pending",
      authorId: 42,
      authorName: "Lê Minh C",
      authorEmail: "leminhc@example.com",
      createdAt: "2023-11-10T09:20:00Z",
      updatedAt: "2023-11-10T09:20:00Z",
      views: 543,
      likes: 32,
      comments: 12,
      categories: ["Việc làm", "IT"],
      tags: ["career", "it-jobs", "vietnam", "salary"],
      featured: false,
      seoTitle: "Cơ hội việc làm IT 2024 - Mức lương và kỹ năng cần thiết",
      seoDescription: "Tìm hiểu về cơ hội việc làm trong ngành IT tại Việt Nam, mức lương trung bình và các kỹ năng cần thiết để thành công.",
      readTime: 5
    };
    setPost(postData);
  }, [location.state, postId]);

  const handleGoBack = () => {
    navigate('/admin/posts');
  };

  const handleStatusUpdate = async (newStatus, reason = '') => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPost(prev => ({
        ...prev,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        rejectionReason: newStatus === 'rejected' ? reason : undefined
      }));

      // Add to history
      const newHistoryItem = {
        time: new Date().toISOString(),
        action: `Cập nhật trạng thái`,
        user: "Admin",
        details: `Chuyển trạng thái sang '${POST_STATUS[newStatus].text}'${reason ? `. Lý do: ${reason}` : ''}`
      };
      setHistory(prev => [newHistoryItem, ...prev]);

      message.success(`Đã cập nhật trạng thái thành '${POST_STATUS[newStatus].text}'`);
      setStatusModalVisible(false);
      setRejectionReason('');
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Đã xóa bài viết thành công');
      navigate('/admin/posts');
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentStatusUpdate = (commentId, newStatus) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, status: newStatus }
          : comment
      )
    );
    message.success(`Đã ${newStatus === 'approved' ? 'duyệt' : 'từ chối'} bình luận`);
  };

  const handleCommentDelete = (commentId) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
    message.success('Đã xóa bình luận');
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  const renderContent = (content) => {
    if (!content) return null;
    
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
      const paragraphs = content.split('\n\n');
      return paragraphs.map((paragraph, index) => (
        <Paragraph key={index} style={{ marginBottom: '16px', lineHeight: '1.8' }}>
          {paragraph}
        </Paragraph>
      ));
    }
  };

  const renderPostStatus = (status) => {
    const statusConfig = POST_STATUS[status] || { 
      color: 'default', 
      text: 'Không xác định', 
      icon: null 
    };
    return (
      <Tag icon={statusConfig.icon} color={statusConfig.color} style={{ fontSize: '14px', padding: '4px 12px' }}>
        {statusConfig.text}
      </Tag>
    );
  };

  // Comments table columns
  const commentColumns = [
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
      width: 150
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      render: (text) => (
        <div style={{ maxWidth: 300, wordBreak: 'break-word' }}>
          {text}
        </div>
      )
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: formatDate
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'approved' ? 'green' : status === 'pending' ? 'gold' : 'red'}>
          {status === 'approved' ? 'Đã duyệt' : status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleCommentStatusUpdate(record.id, 'approved')}
              >
                Duyệt
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={() => handleCommentStatusUpdate(record.id, 'rejected')}
              >
                Từ chối
              </Button>
            </>
          )}
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleCommentDelete(record.id)}
          />
        </Space>
      )
    }
  ];

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-post-detail-container">
      <Content style={{ padding: '24px' }}>
        <div className="admin-post-detail-content">
          {/* Header */}
          <div className="admin-header">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={handleGoBack}
              className="back-button"
            >
              Quay lại danh sách
            </Button>
          </div>

          <Row gutter={24}>
            {/* Main Content */}
            <Col xs={24} lg={24}>
              <Card className="main-content-card">
                <div className="post-header">
                  <Title level={1} className="post-title">
                    {post.title}
                  </Title>
                  
                  <div className="post-meta">
                    <Space size="large">
                      <div className="author-info">
                        <Avatar icon={<UserOutlined />} />
                        <div>
                          <div className="author-name">{post.authorName}</div>
                          <div className="author-email">{post.authorEmail}</div>
                        </div>
                      </div>
                      
                      <div className="post-dates">
                        <div><CalendarOutlined /> Tạo: {formatDate(post.createdAt)}</div>
                        <div><CalendarOutlined /> Cập nhật: {formatDate(post.updatedAt)}</div>
                      </div>
                      
                      <div className="post-stats">
                        <span><EyeOutlined /> {post.views}</span>
                        <span><LikeOutlined /> {post.likes}</span>
                        <span><CommentOutlined /> {comments.length}</span>
                      </div>
                    </Space>
                  </div>

                  <div className="post-status-section">
                    {renderPostStatus(post.status)}
                    {post.featured && <Tag color="orange">Nổi bật</Tag>}
                  </div>
                </div>

                <Divider />

                <div className="post-content">
                  {renderContent(post.content)}
                </div>
              </Card>

              {/* Comments Management */}
              
            </Col>
          </Row>
        </div>
      </Content>

      {/* Status Management Modal */}
      <Modal
        title="Quản lý trạng thái bài viết"
        open={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        footer={null}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>Trạng thái hiện tại: {renderPostStatus(post.status)}</div>
          
          <Divider />
          
          <Space wrap>
            {post.status !== 'published' && (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleStatusUpdate('published')}
                loading={loading}
              >
                Duyệt & Xuất bản
              </Button>
            )}
            
            {post.status !== 'draft' && (
              <Button
                icon={<EditOutlined />}
                onClick={() => handleStatusUpdate('draft')}
                loading={loading}
              >
                Chuyển về bản nháp
              </Button>
            )}
            
            {post.status !== 'rejected' && (
              <div style={{ width: '100%' }}>
                <TextArea
                  placeholder="Lý do từ chối (tùy chọn)"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  style={{ marginBottom: 8 }}
                />
                <Button
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleStatusUpdate('rejected', rejectionReason)}
                  loading={loading}
                >
                  Từ chối
                </Button>
              </div>
            )}
          </Space>
        </Space>
      </Modal>
    </div>
  );
};

export default PostAdminDetail;