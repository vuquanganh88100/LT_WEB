import React, { useState, useEffect } from 'react';
import { Layout, Tabs, Button, List, Card, Tag, Spin, message, Avatar, Row, Col, Typography, Divider } from 'antd';
import { PlusOutlined, UserOutlined, CalendarOutlined, EyeOutlined, LikeOutlined, CommentOutlined } from '@ant-design/icons';
import AddPostForm from '../../components/post/AddPostForm';
import PostService, { getAllPost } from '../../services/PostService';
import NavBarLayout from '../../layout/NavBar/NavBarLayout';
import FooterLayout from '../../layout/Footer/FooterLayout';
import './Post.css';

const { TabPane } = Tabs;
const { Content } = Layout;
const { Title, Paragraph } = Typography;

// Fake data for posts
const fakePosts = [
  {
    id: 1,
    title: "Tác động của AI đến giáo dục",
    content: "Trí tuệ nhân tạo đang thay đổi cách chúng ta tiếp cận học tập. Các công cụ AI như ChatGPT và Bard đang giúp sinh viên tiếp cận kiến thức theo cách mới mẻ và tương tác hơn. Tuy nhiên, cũng cần có sự cân nhắc về tính xác thực của thông tin và khả năng phát triển tư duy độc lập của người học...",
    status: "published",
    authorId: 27,
    authorName: "Nguyễn Văn A",
    publishDate: "2023-10-15",
    views: 1245,
    likes: 87,
    comments: 23,
    categories: ["Giáo dục", "Công nghệ"]
  },
  {
    id: 2,
    title: "Phương pháp học tập hiệu quả cho sinh viên năm nhất",
    content: "Bước vào đại học là một thay đổi lớn đối với nhiều sinh viên. Thay vì được giáo viên nhắc nhở thường xuyên, bạn cần tự quản lý việc học tập của mình. Bài viết này chia sẻ các phương pháp giúp bạn thích nghi nhanh chóng với môi trường học tập mới, từ cách lập kế hoạch học tập đến kỹ thuật ghi chú hiệu quả...",
    status: "published",
    authorId: 35,
    authorName: "Trần Thị B",
    publishDate: "2023-11-02",
    views: 987,
    likes: 65,
    comments: 18,
    categories: ["Kỹ năng học tập", "Sinh viên"]
  },
  {
    id: 3,
    title: "Cơ hội việc làm cho sinh viên IT sau tốt nghiệp",
    content: "Ngành Công nghệ thông tin đang phát triển mạnh mẽ tại Việt Nam với nhiều cơ hội việc làm hấp dẫn. Bài viết này phân tích xu hướng thị trường IT hiện tại, các vị trí việc làm hot nhất và mức lương trung bình. Đồng thời, chia sẻ các kỹ năng cần thiết để tăng cơ hội được tuyển dụng sau khi tốt nghiệp...",
    status: "published",
    authorId: 42,
    authorName: "Lê Minh C",
    publishDate: "2023-12-05",
    views: 1567,
    likes: 134,
    comments: 45,
    categories: ["Việc làm", "Công nghệ thông tin"]
  },
  {
    id: 4,
    title: "Kinh nghiệm tham gia chương trình trao đổi sinh viên quốc tế",
    content: "Chương trình trao đổi sinh viên quốc tế là cơ hội tuyệt vời để mở rộng tầm nhìn và trải nghiệm nền giáo dục khác. Bài viết này chia sẻ từ quá trình chuẩn bị hồ sơ, phỏng vấn, đến những trải nghiệm thực tế khi sống và học tập ở nước ngoài. Bạn sẽ tìm thấy những lời khuyên hữu ích để chuẩn bị tốt nhất cho hành trình của mình...",
    status: "published",
    authorId: 29,
    authorName: "Phạm Anh D",
    publishDate: "2024-01-20",
    views: 854,
    likes: 72,
    comments: 31,
    categories: ["Du học", "Trải nghiệm"]
  },
  {
    id: 5,
    title: "Phát triển kỹ năng mềm trong thời đại số",
    content: "Trong kỷ nguyên số, kỹ năng mềm trở nên quan trọng không kém kiến thức chuyên môn. Bài viết phân tích các kỹ năng mềm cần thiết cho sinh viên trong thời đại 4.0 như: giao tiếp trực tuyến hiệu quả, làm việc nhóm từ xa, quản lý thời gian và tự học. Đồng thời, giới thiệu các khóa học và tài nguyên miễn phí để phát triển những kỹ năng này...",
    status: "published",
    authorId: 38,
    authorName: "Hoàng Thị E",
    publishDate: "2024-02-10",
    views: 1102,
    likes: 93,
    comments: 27,
    categories: ["Kỹ năng mềm", "Phát triển cá nhân"]
  },
  {
    id: 6,
    title: "Nghiên cứu khoa học cho sinh viên đại học: Bắt đầu từ đâu?",
    content: "Nghiên cứu khoa học không chỉ dành cho giảng viên và nghiên cứu sinh. Sinh viên đại học cũng có thể và nên tham gia nghiên cứu sớm. Bài viết hướng dẫn cách tìm chủ đề nghiên cứu phù hợp, kết nối với giáo viên hướng dẫn, tìm kiếm tài liệu và viết đề xuất nghiên cứu. Những kinh nghiệm quý báu cho những ai muốn bắt đầu con đường nghiên cứu từ sớm...",
    status: "pending",
    authorId: 45,
    authorName: "Ngô Văn F",
    publishDate: "2024-03-05",
    views: 678,
    likes: 54,
    comments: 19,
    categories: ["Nghiên cứu khoa học", "Học thuật"]
  }
];

const PostPage = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [posts, setPosts] = useState(fakePosts); // Use fake data by default
  const [loading, setLoading] = useState(false);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [userInfo,setUserInfo]=useState(null)
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

  const handlePostSuccess = () => {
    setIsAddingPost(false);
    setActiveTab('1');
    // Add the new post to our fake data with a temporary ID
    const newPost = {
      id: posts.length + 1,
      ...posts[0], // Copy other properties from the first post
      title: "Bài viết mới đã được tạo",
      content: "Nội dung bài viết mới vừa được tạo thành công",
      status: "pending",
      publishDate: new Date().toISOString().split('T')[0]
    };
    setPosts([newPost, ...posts]);
    fetchPosts(); // Also try to fetch real data
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'green';
      case 'pending':
        return 'orange';
      case 'draft':
        return 'gray';
      default:
        return 'blue';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'published':
        return 'Đã xuất bản';
      case 'pending':
        return 'Chờ duyệt';
      case 'draft':
        return 'Bản nháp';
      default:
        return status;
    }
  };
  
  // Format date to show only year-month-day
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // If the date is already in YYYY-MM-DD format, return it as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Otherwise, try to parse and format the date
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
                  <span><EyeOutlined /> 69</span>
                  <span><LikeOutlined /> 69</span>
                  <span><CommentOutlined /> 69</span>
                </div>
                <Button type="primary" size="small">Xem chi tiết</Button>
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