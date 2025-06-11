import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  message
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons';
import './DepartmentAdmin.css';
import { getAllDepartment, updateDepartment, addDepartment } from '../../../services/DepartmentService';
import ConfirmationModal from '../../../components/ConfirmationModal';
import useConfirmationModal from '../../../hooks/useConfirmationModal';
import useNotify from '../../../hooks/useNotify';

const DepartmentAdmin = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState(null);
  const notify=useNotify()
  // Use our custom hook for confirmation modal
  const { modalState, showModal, hideModal } = useConfirmationModal();

  // Lấy thông tin người dùng từ localStorage
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

  // Kiểm tra quyền admin và fetch dữ liệu phòng ban
  useEffect(() => {
    if (!userInfo) return;

    const isAdmin = userInfo?.role?.includes(1) || userInfo?.role?.includes(2);
    if (!isAdmin) {
      notify.error('Bạn không có quyền truy cập trang này');
      return;
    }

    fetchDepartments();
  }, [userInfo]);

  const fetchDepartments = () => {
    setLoading(true);
    getAllDepartment(
      {},
      (data) => {
        setDepartments(data);
        setLoading(false);
      },
      (error) => {
        console.error('Lỗi khi fetch department:', error);
        
        let errorMessage = 'Không thể tải danh sách phòng ban';
        if (error && error.response && error.response.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        }
        
        notify.error(errorMessage);
        setLoading(false);
      }
    );
  };

  // Mở modal để thêm/sửa
  const showDepartmentModal = (department = null) => {
    setCurrentDepartment(department);
    if (department) {
      form.setFieldsValue({ name: department.name });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (currentDepartment) {
        updateDepartment(
          currentDepartment.departmentId,
          values, 
          (data) => {
            const updated = departments.map(dep =>
              dep.departmentId === currentDepartment.departmentId ? { ...dep, ...values } : dep
            );
            setDepartments(updated);
            notify.success('Cập nhật phòng ban thành công');
            setIsModalVisible(false);
          },
          (error) => {
            console.error('Failed to update department:', error);
            
            let errorMessage = 'Không thể cập nhật phòng ban';
            if (error && error.response && error.response.data) {
              if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
              } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
              }
            }
            
            notify.error(errorMessage);
          }
        );
      } else {
        addDepartment(
          values, 
          (data) => {
            if (data && data.data) {
              setDepartments([...departments, data.data]);
            } else {
              const maxId = departments.reduce((max, dep) => Math.max(max, dep.departmentId), 0);
              const newDepartment = {
                departmentId: maxId + 1,
                ...values,
                createdAt: new Date().toISOString().split('T')[0]
              };
              setDepartments([...departments, newDepartment]);
            }
            notify.success('Thêm phòng ban thành công');
            setIsModalVisible(false);
          },
          (error) => {
            console.error('Failed to add department:', error);
            
            // Get error message safely
            let errorMessage = 'Không thể thêm phòng ban';
            if (error && error.response && error.response.data) {
              if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
              } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
              }
            }
            
            notify.error(errorMessage);
          }
        );
      }
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleDeleteDepartment = (id) => {
    showModal({
      title: 'Xác nhận xóa phòng ban',
      content: 'Bạn có chắc chắn muốn xóa phòng ban này không?',
      okType: 'danger',
      okText: 'Xóa',
      onConfirm: () => {
        setDepartments(departments.filter(dep => dep.departmentId !== id));
        message.success('Xóa phòng ban thành công');
      }
    });
  };

  const filteredDepartments = departments.filter(dep =>
    dep.name.toLowerCase().includes(searchText.toLowerCase())
  );

 const columns = [
  {
    title: 'ID',
    dataIndex: 'departmentId', 
    key: 'departmentId',
  },
  {
    title: 'Tên phòng ban',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Thao tác',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Button
          type="primary"
          icon={<EditOutlined />}
          size="small"
          onClick={() => showDepartmentModal(record)}
        >
          Sửa
        </Button>
        <Button
          danger
          icon={<DeleteOutlined />}
          size="small"
          onClick={() => handleDeleteDepartment(record.departmentId)} // sửa ở đây
        >
          Xóa
        </Button>
      </Space>
    ),
  },
];


  return (
    <div className="department-container">
      <div className="department-header">
        <h2>Quản lý phòng ban</h2>
        <Space>
          <Input
            placeholder="Tìm kiếm phòng ban..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showDepartmentModal()}
          >
            Thêm phòng ban
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredDepartments}
        rowKey="departmentId"
        loading={loading}
      />

      <Modal
        title={currentDepartment ? "Sửa thông tin phòng ban" : "Thêm phòng ban mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên phòng ban"
            rules={[{ required: true, message: 'Vui lòng nhập tên phòng ban!' }]}
          >
            <Input placeholder="Nhập tên phòng ban" />
          </Form.Item>
        </Form>
      </Modal>

      <ConfirmationModal
        visible={modalState.visible}
        title={modalState.title}
        content={modalState.content}
        onConfirm={modalState.onConfirm}
        onCancel={hideModal}
        okText={modalState.okText}
        cancelText={modalState.cancelText}
        okType={modalState.okType}
      />
    </div>
  );
};

export default DepartmentAdmin;
