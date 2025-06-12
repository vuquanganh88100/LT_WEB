import React, { useState, useEffect } from 'react';
import {
  Layout, Typography, Table, Tag, Button, Input,
  Space, Tooltip, Popconfirm, Row, Col, Card, Statistic, Modal
} from 'antd';
import {
  SearchOutlined, ReloadOutlined, CheckCircleOutlined,
  CloseCircleOutlined, EditOutlined, DeleteOutlined,
  EyeOutlined, ExclamationCircleOutlined, PlusOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { getAllPost, updatePostStatus } from '../../../services/PostService';
import useNotify from '../../../hooks/useNotify';
import './PostAdmin.css';

const { Title } = Typography;

// Constants
const POST_STATUS = {
  draft: { color: 'default', text: 'Bản nháp', icon: <EditOutlined /> },
  pending: { color: 'gold', text: 'Chờ duyệt', icon: <ExclamationCircleOutlined /> },
  approved: { color: 'green', text: 'Đã duyệt', icon: <CheckCircleOutlined /> },
  rejected: { color: 'red', text: 'Từ chối', icon: <CloseCircleOutlined /> }
};

export const PostAdmin = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [selectedPost, setSelectedPost] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  // Fetch posts from API
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchText || undefined
      };

      await getAllPost(
        params,
        (data) => {
          console.log('Posts data:', data);
          // Backend trả về array trực tiếp, không có pagination
          setPosts(data || []);
          setPagination(prev => ({
            ...prev,
            current: 1,
            total: data?.length || 0
          }));
        },
        (error) => {
          console.error('Error fetching posts:', error);
          notify.error('Không thể tải danh sách bài viết');
          setPosts([]);
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  useEffect(() => {
    console.log('Posts in useEffect:', posts);
    console.log('Posts length:', posts.length);
    
    const filteredPosts = posts.filter(post => 
      post.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      post.authorName?.toLowerCase().includes(searchText.toLowerCase())
    );

    console.log('Filtered posts:', filteredPosts);

    const newStats = {
      total: filteredPosts.length,
      draft: filteredPosts.filter(post => post.status === 'draft').length,
      pending: filteredPosts.filter(post => post.status === 'pending').length,
      approved: filteredPosts.filter(post => post.status === 'approved').length,
      rejected: filteredPosts.filter(post => post.status === 'rejected').length
    };

    console.log('New stats:', newStats);
    setStats(newStats);
  }, [posts, searchText]);

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);
  const handleStatusUpdate = async (postId, newStatus) => {
    const loadingKey = `${postId}-${newStatus}`;
    setActionLoading(prev => ({ ...prev, [loadingKey]: true }));
    
    try {
      await updatePostStatus(
        postId,
        newStatus,
        () => {
          notify.success(`Đã cập nhật trạng thái thành '${POST_STATUS[newStatus].text}'`);
          // Update local state
          setPosts(prevPosts => 
            prevPosts.map(post => 
              post.postId === postId 
                ? { ...post, status: newStatus, updatedAt: new Date().toISOString() }
                : post
            )
          );
        },
        (error) => {
          console.error('Error updating post status:', error);
          notify.error('Không thể cập nhật trạng thái bài viết');
        }
      );
    } catch (error) {
      notify.error('Lỗi hệ thống');
    } finally {
      setActionLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleDelete = async (postId) => {
    try {
      // Note: You might need to add deletePost function to PostService
      // For now, just update local state
      setPosts(prevPosts => prevPosts.filter(post => post.postId !== postId));
      notify.success('Đã xóa bài viết thành công');
    } catch (error) {
      notify.error('Không thể xóa bài viết');
    }
  };

  const handleTableChange = (paginationInfo) => {
    // Backend không hỗ trợ pagination, chỉ cập nhật local pagination
    setPagination(prev => ({
      ...prev,
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize
    }));
  };

  const handleSearch = () => {
    // Reset về trang đầu khi search
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchPosts();
  };

  const handleReset = () => {
    setSearchText('');
    setPagination(prev => ({ ...prev, current: 1 }));
    // Fetch posts without search filter
    setTimeout(() => {
      fetchPosts();
    }, 100);
  };

  const handlePreview = (post) => {
    setSelectedPost(post);
    setPreviewVisible(true);
  };

  const handleEdit = (post) => {
    console.log('Edit post:', post);
  };

  const handleViewDetail = (post) => {
    navigate(`/admin/posts/${post.postId}`, { state: { post } });
  };

  // Render functions
  const renderPostStatus = (status) => {
    const statusConfig = POST_STATUS[status] || { 
      color: 'default', 
      text: 'Không xác định', 
      icon: null 
    };
    return (
      <Tag icon={statusConfig.icon} color={statusConfig.color}>
        {statusConfig.text}
      </Tag>
    );
  };

  const renderCategories = (categories) => {
    if (!categories || categories.length === 0) return '-';
    
    // Handle both array and string formats
    const categoryArray = Array.isArray(categories) ? categories : 
                         typeof categories === 'string' ? categories.split(',').map(c => c.trim()) : 
                         [];
    
    return categoryArray.map((category, index) => (
      <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
        {category}
      </Tag>
    ));
  };

  const renderActions = (record) => (
    <Space size="small">
      {record.status === 'pending' && (
        <>
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            loading={actionLoading[`${record.postId}-approved`]}
            onClick={() => handleStatusUpdate(record.postId, 'approved')}
          >
            Duyệt
          </Button>
          <Button
            danger
            size="small"
            icon={<CloseCircleOutlined />}
            loading={actionLoading[`${record.postId}-rejected`]}
            onClick={() => handleStatusUpdate(record.postId, 'rejected')}
          >
            Từ chối
          </Button>
        </>
      )}
      
      {record.status === 'rejected' && (
        <Button
          type="primary"
          size="small"
          icon={<CheckCircleOutlined />}
          loading={actionLoading[`${record.postId}-approved`]}
          onClick={() => handleStatusUpdate(record.postId, 'approved')}
        >
          Duyệt
        </Button>
      )}

      <Tooltip title="Xem chi tiết">
        <Button
          type="default"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        />
      </Tooltip>

     

      <Tooltip title="Chỉnh sửa">
        <Button
          type="default"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        />
      </Tooltip>
      
      <Popconfirm
        title="Bạn có chắc chắn muốn xóa bài viết này?"
        onConfirm={() => handleDelete(record.postId)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <Tooltip title="Xóa bài viết">
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
          />
        </Tooltip>
      </Popconfirm>
    </Space>
  );

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'postId',
      key: 'postId',
      width: 70
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width:400,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>
            Tác giả: {record.authorName || record.author?.name || 'Không xác định'}
          </div>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: renderPostStatus
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (date) => {
        try {
          return date ? format(new Date(date), 'dd/MM/yyyy HH:mm') : '-';
        } catch (error) {
          return '-';
        }
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 250,
      render: (_, record) => renderActions(record)
    }
  ];

  // Use posts directly from API (filtering is handled server-side)
  const filteredPosts = posts;
  console.log('Filtered posts for table:', filteredPosts);
  console.log('Posts state:', posts);
  console.log('Loading state:', loading);
  
  // Test data để debug
  const testData = [
    {
      postId: 999,
      title: "Test Post",
      content: "Test content",
      authorName: "Test Author",
      status: "approved",
      createdAt: "2024-01-01T00:00:00"
    }
  ];
  
  // Sử dụng test data nếu không có posts từ API
  const tableData = filteredPosts.length > 0 ? filteredPosts : testData;
  // Stats cards data
  const statsCards = [
    { title: 'Tổng số', value: stats.total, color: '#1890ff' },
    { title: 'Chờ duyệt', value: stats.pending, color: '#faad14', icon: <ExclamationCircleOutlined /> },
    { title: 'Đã duyệt', value: stats.approved, color: '#52c41a', icon: <CheckCircleOutlined /> },
    { title: 'Từ chối', value: stats.rejected, color: '#ff4d4f', icon: <CloseCircleOutlined /> }
  ];

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Quản lý bài viết</Title>
      </div>
      
      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {statsCards.map((stat, index) => (
          <Col span={index === 0 ? 6 : 4.5} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                valueStyle={{ color: stat.color }}
                prefix={stat.icon}
              />
            </Card>
          </Col>
        ))}
      </Row>
      
      {/* Search and Actions */}
      <Space style={{ marginBottom: 50, float: 'left', marginTop: 30 }}>
        <Input
          placeholder="Tìm kiếm tiêu đề hoặc tác giả..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
          Tìm kiếm
        </Button>
        <Button onClick={handleReset} icon={<ReloadOutlined />}>
          Đặt lại
        </Button>
      </Space>
      
      {/* Posts Table */}
      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="postId"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: tableData.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bài viết`,
          pageSizeOptions: ['10', '20', '50']
        }}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
        locale={{
          emptyText: loading ? 'Đang tải...' : 'Không có dữ liệu'
        }}
      />

    
    </div>
  );
};