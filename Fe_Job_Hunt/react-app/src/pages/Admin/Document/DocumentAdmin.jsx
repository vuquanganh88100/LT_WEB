import React, { useState, useEffect } from 'react';
import {
  Layout, Typography, Table, Tag, Button, Input,
  Space, notify, Tooltip, Popconfirm, Row, Col, Card, Statistic
} from 'antd';
import {
  SearchOutlined, ReloadOutlined, CheckCircleOutlined,
  CloseCircleOutlined, FolderOutlined, DeleteOutlined,
  EyeOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import { getAllDocuments, updateDocumentStatus, deleteDocument } from '../../../services/DocumentService';
import { format } from 'date-fns';
import './DocumentAdmin.css';
import useNotify from '../../../hooks/useNotify';

const { Title } = Typography;

// Constants
const DOCUMENT_TYPES = {
  reference: { color: 'blue', text: 'Tài liệu tham khảo' },
  project: { color: 'green', text: 'Đồ án / BTL' },
  exam: { color: 'orange', text: 'Đề thi / Kiểm tra' }
};

const DOCUMENT_STATUS = {
  pending: { color: 'gold', text: 'Chờ duyệt', icon: <ExclamationCircleOutlined /> },
  approved: { color: 'green', text: 'Đã duyệt', icon: <CheckCircleOutlined /> },
  rejected: { color: 'red', text: 'Từ chối', icon: <CloseCircleOutlined /> }
};

const DocumentAdmin = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const notify=useNotify()

  // Fetch documents
  const fetchDocuments = async (page = 0, pageSize = 10) => {
    setLoading(true);
    try {
      await getAllDocuments(
        page,
        pageSize,
        'createdAt,desc',
        null,
        searchText,
        (data) => {
          setDocuments(data.content);
          setPagination(prev => ({
            ...prev,
            current: data.number + 1,
            total: data.totalElements
          }));
          
          // Calculate stats from current data
          setStats({
            total: data.totalElements,
            pending: data.content.filter(doc => doc.status === 'pending').length,
            approved: data.content.filter(doc => doc.status === 'approved').length,
            rejected: data.content.filter(doc => doc.status === 'rejected').length
          });
        },
        (error) => {
          console.error('Error fetching documents:', error);
          notify.error('Không thể tải danh sách tài liệu');
        }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Event handlers
  const handleTableChange = (pagination) => {
    fetchDocuments(pagination.current - 1, pagination.pageSize);
  };

  const handleStatusUpdate = async (documentId, newStatus) => {
    try {
      await updateDocumentStatus(
        documentId,
        newStatus,
        () => {
          notify.success('Cập nhật trạng thái thành công!');
          fetchDocuments();
        },
        (error) => {
          console.error('Error updating status:', error);
          notify.error('Không thể cập nhật trạng thái');
        }
      );
    } catch (error) {
      notify.error('Lỗi hệ thống');
    }
  };

  const handleDelete = async (documentId) => {
    try {
      await deleteDocument(
        documentId,
        () => {
          notify.success('Xóa tài liệu thành công!');
          fetchDocuments();
        },
        (error) => {
          console.error('Error deleting document:', error);
          notify.error('Không thể xóa tài liệu');
        }
      );
    } catch (error) {
      notify.error('Lỗi hệ thống');
    }
  };

  const handleSearch = () => {
    fetchDocuments(0);
  };

  const handleReset = () => {
    setSearchText('');
    fetchDocuments(0);
  };

  const openGoogleDrive = (folderId) => {
    window.open(`https://drive.google.com/drive/folders/${folderId}`, '_blank');
  };

  // Render functions
  const renderDocumentType = (type) => {
    const typeConfig = DOCUMENT_TYPES[type] || { color: 'default', text: 'Không xác định' };
    return <Tag color={typeConfig.color}>{typeConfig.text}</Tag>;
  };

  const renderDocumentStatus = (status) => {
    const statusConfig = DOCUMENT_STATUS[status] || { 
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

  const renderActions = (record) => (
    <Space size="small">
      {record.status === 'pending' && (
        <>
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => handleStatusUpdate(record.id, 'approved')}
          >
            Duyệt
          </Button>
          <Button
            danger
            size="small"
            icon={<CloseCircleOutlined />}
            onClick={() => handleStatusUpdate(record.id, 'rejected')}
          >
            Từ chối
          </Button>
        </>
      )}
      
      <Tooltip title="Xem tài liệu">
        <Button
          type="default"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => openGoogleDrive(record.folderId)}
        />
      </Tooltip>
      
      <Popconfirm
        title="Bạn có chắc chắn muốn xóa tài liệu này?"
        onConfirm={() => handleDelete(record.id)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <Tooltip title="Xóa tài liệu">
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
      dataIndex: 'id',
      key: 'id',
      width: 70
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <Space>
          <FolderOutlined style={{ color: '#1890ff' }} />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: renderDocumentType
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: renderDocumentStatus
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (date) => format(new Date(date), 'dd/MM/yyyy')
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      render: (_, record) => renderActions(record)
    }
  ];

  // Stats cards data
  const statsCards = [
    { title: 'Tổng số', value: stats.total, color: '#1890ff' },
    { title: 'Chờ duyệt', value: stats.pending, color: '#faad14', icon: <ExclamationCircleOutlined /> },
    { title: 'Đã duyệt', value: stats.approved, color: '#52c41a', icon: <CheckCircleOutlined /> },
    { title: 'Từ chối', value: stats.rejected, color: '#ff4d4f', icon: <CloseCircleOutlined /> }
  ];

  return (
    <div className="dashboard-container">
      <Title level={2}>Quản lý tài liệu</Title>
      
      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {statsCards.map((stat, index) => (
          <Col span={6} key={index}>
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
      <Space style={{ marginBottom: 50 , float:'left',marginTop:30}}>
        <Input
          placeholder="Tìm kiếm tiêu đề..."
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
      
      {/* Documents Table */}
      <Table
        columns={columns}
        dataSource={documents}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default DocumentAdmin;