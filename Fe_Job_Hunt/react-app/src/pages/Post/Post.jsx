import React, { useState, useEffect } from 'react';
import { Layout, Tabs, Button, List, Card, Tag, Spin, message, Avatar, Row, Col, Typography, Divider } from 'antd';
import { PlusOutlined, UserOutlined, CalendarOutlined, EyeOutlined, LikeOutlined, CommentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AddPostForm from '../../components/post/AddPostForm';
import PostService, { getAllPost } from '../../services/PostService';
import NavBarLayout from '../../layout/NavBar/NavBarLayout';
import FooterLayout from '../../layout/Footer/FooterLayout';
import { appPath } from '../../config/appPath';
import './Post.css';

const { TabPane } = Tabs;
const { Content } = Layout;
const { Title, Paragraph } = Typography;


const PostPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1');
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [posts, setPosts] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [userInfo, setUserInfo] = useState(null)
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('user_info');
    if (storedUserInfo) {
      try {
        setUserInfo(JSON.parse(storedUserInfo));
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Set the first post as featured post
    if (posts.length > 0) {
      setFeaturedPost(posts[0]);
    }

    // Try to fetch real posts if API is available
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    getAllPost(
      {},
      (data) => {
        setPosts(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching documents:", error);
        message.error("Không thể tải tài liệu. Vui lòng thử lại sau.");
        setLoading(false);
      }
    );
  };
  const handleAddPost = () => {
    setIsAddingPost(true);
    setActiveTab('2');
  };

  const handleViewPostDetail = (post) => {
    console.log('Navigating to post:', post);
    let postToPass = { ...post };
    if (post.content && !post.content.includes('#') && !post.content.includes('```')) {
      const contentLines = post.content.split('\n\n');
      postToPass.content = contentLines.join('\n\n');
    }
    // Use post.id or post.postId, whichever exists
    const postId = post.postId || post.id;
    navigate(appPath.postDetail(postId), { state: { post: postToPass } });
  };

  const handlePostSuccess = () => {
    setIsAddingPost(false);
    setActiveTab('1');
    const newPost = {
      id: posts.length + 1,
      ...posts[0],
      title: "Bài viết mới đã được tạo",
      content: "Nội dung bài viết mới vừa được tạo thành công",
      status: "pending",
      publishDate: new Date().toISOString().split('T')[0]
    };
    setPosts([newPost, ...posts]);
    fetchPosts(); // Also try to fetch real data
  };


  const formatDate = (dateString) => {
    if (!dateString) return '';

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Invalid date

      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };



  const renderCategories = () => {
    // Default categories
    const defaultCategories = [
      'Giáo dục',
      'Công nghệ',
      'Kỹ năng học tập',
      'Sinh viên',
      'Việc làm',
      'Công nghệ thông tin',
      'Du học',
      'Trải nghiệm',
      'Kỹ năng mềm',
      'Phát triển cá nhân',
      'Nghiên cứu khoa học',
      'Học thuật'
    ];

    return (
      <div className="post-categories">
        <Title level={4}>Danh Mục</Title>
        <div className="category-tags">
          {defaultCategories.map((category, index) => (
            <Tag key={index} color="blue" className="category-tag">{category}</Tag>
          ))}
        </div>
      </div>
    );
  };

  const renderPostList = () => {
    if (loading) {
      return <div className="loading-container"><Spin size="large" /></div>;
    }

    return (
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
          xxl: 3,
        }}
        dataSource={posts}
        renderItem={(post) => (
          <List.Item>
            <Card
              className="post-card"
              cover={<div className="post-card-image"></div>}
            >
              <div className="post-card-meta">
                {post.categories && post.categories.length > 0 && (
                  <Tag color="blue">{post.categories[0]}</Tag>
                )}
              </div>
              <Title level={4} className="post-card-title">{post.title}</Title>
              <div className="post-card-author">
                <div className="author-info">
                  <Avatar size="small" icon={<UserOutlined />} />
                  <span>{post.authorName || "Tác giả"}</span>
                </div>
                <span className="post-card-date">
                  <CalendarOutlined />
                  {formatDate(post.createdAt)}
                </span>
              </div>
              <div className="post-content-preview">
                {post.content.length > 120
                  ? `${post.content.substring(0, 120)}...`
                  : post.content}
              </div>
              <div className="post-footer">
                <div className="post-stats">
                  <span><EyeOutlined /> {post.views || 69}</span>
                  <span><LikeOutlined /> {post.likes || 69}</span>
                  <span><CommentOutlined /> {post.comments || 69}</span>
                </div>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleViewPostDetail(post)}
                >
                  Xem chi tiết
                </Button>
              </div>
            </Card>
          </List.Item>
        )}
      />
    );
  };

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <NavBarLayout />

      <Content style={{ marginTop: 64 }}>
        <div className="blog-banner">
          <div className="blog-banner-content">
            <Title>Blog & Kiến Thức</Title>
            <Paragraph>
              Chia sẻ kiến thức, kinh nghiệm và thông tin hữu ích về học tập, nghiên cứu và đời sống sinh viên
            </Paragraph>
          </div>
        </div>

        <div className="post-page-container">
          <div className="post-header">
            <Title level={2}>Bài Viết</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddPost}
            >
              Tạo bài viết mới
            </Button>
          </div>

          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Danh sách bài viết" key="1">
              <Row gutter={24}>
                <Col xs={24} lg={18}>
                  <Title level={3}>Bài Viết Mới Nhất</Title>
                  {renderPostList()}
                </Col>
                <Col xs={24} lg={6}>
                  <div className="blog-sidebar">
                    {renderCategories()}
                    <Divider />
                  </div>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Tạo bài viết mới" key="2">
              <AddPostForm onSuccess={handlePostSuccess} userInfo={userInfo} />
            </TabPane>
          </Tabs>
        </div>
      </Content>

      <FooterLayout />
    </Layout>
  );
};

export default PostPage;