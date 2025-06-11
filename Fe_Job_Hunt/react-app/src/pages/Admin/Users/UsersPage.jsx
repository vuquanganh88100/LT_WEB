import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Input, Modal, Form, Select, message } from 'antd';
import { 
  UserAddOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  LockOutlined,
  UnlockOutlined
} from '@ant-design/icons';
import './UsersPage.css';

const { Option } = Select;

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Get user info from localStorage to determine role
    const storedUserInfo = localStorage.getItem('user_info');
            console.log(storedUserInfo)

    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }

    // Check if superadmin
    const isSuperAdmin = userInfo?.role?.includes(2);
    if (!isSuperAdmin) {
      message.error('Bạn không có quyền truy cập trang này');
      // Redirect would go here
      return;
    }

    // Load dummy data
    loadUsers();
  }, [userInfo]);

  // Load dummy users data
  const loadUsers = () => {
    setLoading(true);
    // Simulating API call with dummy data
    setTimeout(() => {
      const dummyUsers = [
        {
          id: 1,
          username: 'nguyenvana',
          email: 'nguyenvana@example.com',
          fullName: 'Nguyễn Văn A',
          role: ['user'],
          status: 'active',
          createdAt: '2023-01-15'
        },
        {
          id: 2,
          username: 'tranthib',
          email: 'tranthib@example.com',
          fullName: 'Trần Thị B',
          role: ['admin'],
          status: 'active',
          createdAt: '2023-02-20'
        },
        {
          id: 3,
          username: 'levanc',
          email: 'levanc@example.com',
          fullName: 'Lê Văn C',
          role: ['user'],
          status: 'inactive',
          createdAt: '2023-03-10'
        },
        {
          id: 4,
          username: 'phamvand',
          email: 'phamvand@example.com',
          fullName: 'Phạm Văn D',
          role: ['admin', 'user'],
          status: 'active',
          createdAt: '2023-04-05'
        },
        {
          id: 5,
          username: 'hoangthie',
          email: 'hoangthie@example.com',
          fullName: 'Hoàng Thị E',
          role: ['superadmin'],
          status: 'active',
          createdAt: '2023-05-01'
        }
      ];
      setUsers(dummyUsers);
      setLoading(false);
    }, 1000);
  };

  // Handle showing modal for add/edit user
  const showUserModal = (user = null) => {
    setCurrentUser(user);
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        status: user.status
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Handle modal OK button
  const handleModalOk = () => {
    form.validateFields()
      .then(values => {
        if (currentUser) {
          // Edit existing user
          const updatedUsers = users.map(user => 
            user.id === currentUser.id ? { ...user, ...values } : user
          );
          setUsers(updatedUsers);
          message.success('Cập nhật người dùng thành công');
        } else {
          // Add new user
          const newUser = {
            id: users.length + 1,
            ...values,
            createdAt: new Date().toISOString().split('T')[0]
          };
          setUsers([...users, newUser]);
          message.success('Thêm người dùng thành công');
        }
        setIsModalVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  // Handle delete user
  const handleDeleteUser = (userId) => {
    Modal.confirm({
      title: 'Xác nhận xóa người dùng',
      content: 'Bạn có chắc chắn muốn xóa người dùng này không?',
      onOk() {
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        message.success('Xóa người dùng thành công');
      }
    });
  };

  // Handle lock/unlock user
  const handleToggleUserStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);
    message.success(`Người dùng đã được ${newStatus === 'active' ? 'kích hoạt' : 'khóa'}`);
  };

  // Filter users based on search text
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns
  const columns = [
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: roles => (
        <>
          {roles.map(role => {
            let color = 'green';
            if (role === 'admin') {
              color = 'blue';
            } else if (role === 'superadmin') {
              color = 'red';
            }
            return (
              <Tag color={color} key={role}>
                {role.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Bị khóa'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
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
            onClick={() => showUserModal(record)}
          >
            Sửa
          </Button>
          <Button 
            type={record.status === 'active' ? 'default' : 'primary'} 
            icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />} 
            size="small"
            onClick={() => handleToggleUserStatus(record.id, record.status)}
          >
            {record.status === 'active' ? 'Khóa' : 'Mở khóa'}
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDeleteUser(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="users-container">
      <div className="users-header">
        <h2>Quản lý người dùng</h2>
        <Space>
          <Input
            placeholder="Tìm kiếm người dùng..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <Button 
            type="primary" 
            icon={<UserAddOutlined />}
            onClick={() => showUserModal()}
          >
            Thêm người dùng
          </Button>
        </Space>
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredUsers} 
        rowKey="id"
        loading={loading}
      />

      {/* Add/Edit User Modal */}
      <Modal
        title={currentUser ? "Sửa thông tin người dùng" : "Thêm người dùng mới"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
          
          <Form.Item
            name="fullName"
            label="Họ tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>
          
          {!currentUser && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}
          
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select mode="multiple" placeholder="Chọn vai trò">
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
              <Option value="superadmin">Super Admin</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Bị khóa</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPage;