import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Modal, Form, message, Select, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import './SubjectAdmin.css';
import { getAllDepartment } from '../../../services/DepartmentService';
import { getAllSubject, getSubjectByDepartment, addSubject, updateSubject } from '../../../services/SubjectService';
import ConfirmationModal from '../../../components/ConfirmationModal';
import useConfirmationModal from '../../../hooks/useConfirmationModal';
import useNotify from '../../../hooks/useNotify';

const { Option } = Select;
const { TextArea } = Input;

const SubjectAdmin = () => {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState(null);

  // Use our custom hooks for confirmation modal and notifications
  const { modalState, showModal, hideModal } = useConfirmationModal();
  const notify = useNotify();

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
    if (userInfo === null) return;
    const isAdmin = userInfo?.role?.includes(1) || userInfo?.role?.includes(2);
    if (!isAdmin) {
      notify.error('Bạn không có quyền truy cập trang này');
      return;
    }

    loadSubjects();
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

        // Get error message safely
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

  const loadSubjects = () => {
    setLoading(true);
    getAllSubject(
      {},
      (data) => {
        setSubjects(data);
        setLoading(false);
      },
      (error) => {
        console.error('Lỗi khi fetch subject:', error);

        // Get error message safely
        let errorMessage = 'Không thể tải danh sách môn học';
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

  const showSubjectModal = (subject = null) => {
    setCurrentSubject(subject);
    if (subject) {
      form.setFieldsValue({
        code: subject.code,
        name: subject.title, // API returns 'title' instead of 'name'
        credit: subject.credit,
        description: subject.description,
        departmentId: subject.departmentId
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };
  const handleModalOk = () => {
    form.validateFields()
      .then(values => {
        const formattedValues = {
          ...values,
          title: values.name, // Convert name field to title for API
        };
        delete formattedValues.name; // Remove name field

        if (currentSubject) {
          updateSubject(
            currentSubject.subjectId,
            formattedValues,
            (data) => {
              // On success
              const updatedSubjects = subjects.map(subject =>
                subject.subjectId === currentSubject.subjectId ?
                  { ...subject, ...formattedValues } : subject
              );
              setSubjects(updatedSubjects);
              notify.success('Cập nhật môn học thành công');
              setIsModalVisible(false);
            },
            (error) => {
              // On error - with safe error handling
              console.error('Failed to update subject:', error);

              // Get error message safely
              let errorMessage = 'Không thể cập nhật môn học';
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
          // Add new subject using API
          addSubject(
            formattedValues,
            (data) => {
              notify.success('Thêm môn học thành công');
              setIsModalVisible(false);
              loadSubjects(); // GỌI API ĐỂ LOAD LẠI DỮ LIỆU
            },
            (error) => {
              // On error - with safe error handling
              console.error('Failed to add subject:', error);

              // Get error message safely
              let errorMessage = 'Không thể thêm môn học';
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
      })
      .catch(info => console.log('Validate Failed:', info));
  };

  const handleDeleteSubject = (subjectId) => {
    showModal({
      title: 'Xác nhận xóa môn học',
      content: 'Bạn có chắc chắn muốn xóa môn học này không?',
      okType: 'danger',
      okText: 'Xóa',
      onConfirm: () => {
        // Here you would typically call an API to delete the subject
        const updatedSubjects = subjects.filter(subject => subject.subjectId !== subjectId);
        setSubjects(updatedSubjects);
        notify.success('Xóa môn học thành công');
      }
    });
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find(dept => dept.departmentId === departmentId);
    return department ? department.name : 'N/A';
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.title.toLowerCase().includes(searchText.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (_, __, index) => index + 1,
      width: 80,
    },
    {
      title: 'Mã môn học',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tên môn học',
      dataIndex: 'title',
      key: 'name',
    },
    {
      title: 'Số tín chỉ',
      dataIndex: 'credit',
      key: 'credit',
    },
    {
      title: 'Phòng ban',
      dataIndex: 'departmentId',
      key: 'departmentId',
      render: departmentId => getDepartmentName(departmentId),
    },

    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => showSubjectModal(record)}>Sửa</Button>
          <Button danger icon={<DeleteOutlined />} size="small" onClick={() => handleDeleteSubject(record.subjectId)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="subject-container">
      <div className="subject-header">
        <h2>Quản lý môn học</h2>
        <Space>
          <Input
            placeholder="Tìm kiếm môn học..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showSubjectModal()}>
            Thêm môn học
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredSubjects}
        rowKey="subjectId"
        loading={loading}

      />

      <Modal
        title={currentSubject ? "Sửa thông tin môn học" : "Thêm môn học mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="code" label="Mã môn học" rules={[{ required: true, message: 'Vui lòng nhập mã môn học!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Tên môn học" rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="credit" label="Số tín chỉ" rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ!' }]}>
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="departmentId" label="Phòng ban" rules={[{ required: true, message: 'Vui lòng chọn phòng ban!' }]}>
            <Select placeholder="Chọn phòng ban">
              {departments.map(dept => (
                <Option key={dept.departmentId} value={dept.departmentId}>
                  {dept.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Confirmation Modal */}
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

export default SubjectAdmin;
