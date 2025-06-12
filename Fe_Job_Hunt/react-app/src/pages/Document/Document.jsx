import React, { useState, useEffect } from 'react';
import {
  Layout, Typography, Tabs, List, Button,
  Modal, Form, Input, Select, Spin, Empty,
  message, Divider, Upload
} from 'antd';
import {
  PlusOutlined, FolderOutlined, UploadOutlined
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import NavBarLayout from '../../layout/NavBar/NavBarLayout';
import FooterLayout from '../../layout/Footer/FooterLayout';
import { getDocumentsBySubject, addDocument } from '../../services/DocumentService';
import './Document.css';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const DocumentPage = () => {
  const { subjectId } = useParams();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [fileList, setFileList] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
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

  // Lấy tài liệu theo môn học
  const fetchDocuments = () => {
    setLoading(true);
    getDocumentsBySubject(
      subjectId,
      (data) => {
        setDocuments(data);
        if (data.length && data[0].subject?.title) {
          setSubjectName(data[0].subject.title);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching documents:", error);
        message.error("Không thể tải tài liệu. Vui lòng thử lại sau.");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    if (subjectId) {
      fetchDocuments();
    }
  }, [subjectId]);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFileList([]);
  };
console.error(userInfo)
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setSubmitLoading(true);

      const documentData = {
        ...values,
        subjectId: parseInt(subjectId),
        status: 'pending',
        userId:userInfo?.userId
      };
      console.error(documentData)
      const files = fileList.map(file => file.originFileObj);
      addDocument(
        documentData,
        files,
        () => {
          message.success("Thêm tài liệu thành công!");
          handleCancel();
          fetchDocuments();
          setSubmitLoading(false);
        },
        () => {
          message.error("Không thể thêm tài liệu. Vui lòng thử lại sau.");
          setSubmitLoading(false);
        }
      );
    });
  };

  const handleFileChange = ({ fileList }) => setFileList(fileList);
  const openGoogleDrive = (folderId) => {
    window.open(`https://drive.google.com/drive/folders/${folderId}`, '_blank');
  };

  const renderDocumentList = (docs, emptyText, iconColor) =>
    docs.length > 0 ? (
      <List
        itemLayout="horizontal"
        dataSource={docs}
        renderItem={(item) => (
          <List.Item className="document-item" onClick={() => openGoogleDrive(item.folderId)}>
            <List.Item.Meta
              avatar={<FolderOutlined style={{ fontSize: 24, color: iconColor }} />}
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
    ) : (
      <Empty description={emptyText} />
    );

  const categorized = {
    reference: documents.filter(doc => doc.type === 'reference'),
    project: documents.filter(doc => doc.type === 'project'),
    exam: documents.filter(doc => doc.type === 'exam'),
  };

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <NavBarLayout />

      <Content style={{ marginTop: 64, padding: '0 50px 50px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '40px 0 20px'
          }}>
            <Title level={2}>
              {subjectName ? `Tài liệu ${subjectName}` : 'Tài liệu môn học'}
            </Title>
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
              Thêm tài liệu mới
            </Button>
          </div>

          <Divider />

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin size="large" />
            </div>
          ) : (
            <Tabs defaultActiveKey="reference">
              <TabPane tab="Tài liệu tham khảo" key="reference">
                {renderDocumentList(categorized.reference, "Không có tài liệu tham khảo", "#1890ff")}
              </TabPane>
              <TabPane tab="Đồ án / Bài tập lớn" key="project">
                {renderDocumentList(categorized.project, "Không có đồ án hoặc bài tập lớn", "#52c41a")}
              </TabPane>
              <TabPane tab="Đề thi / Kiểm tra" key="exam">
                {renderDocumentList(categorized.exam, "Không có đề thi hoặc kiểm tra", "#fa8c16")}
              </TabPane>
            </Tabs>
          )}
        </div>
      </Content>

      <FooterLayout />

      <Modal
        title="Thêm tài liệu mới"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>Hủy</Button>,
          <Button key="submit" type="primary" loading={submitLoading} onClick={handleSubmit}>Thêm</Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="document_form">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input placeholder="Nhập tiêu đề tài liệu" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại tài liệu"
            rules={[{ required: true, message: 'Vui lòng chọn loại tài liệu!' }]}
          >
            <Select placeholder="Chọn loại tài liệu">
              <Option value="reference">Tài liệu tham khảo</Option>
              <Option value="project">Đồ án / Bài tập lớn</Option>
              <Option value="exam">Đề thi / Kiểm tra</Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={4} placeholder="Nhập mô tả cho tài liệu (không bắt buộc)" />
          </Form.Item>
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleFileChange}
            multiple
          >
            <Button icon={<UploadOutlined />}>Chọn tệp</Button>
            <Text type="secondary" style={{ marginLeft: 8 }}>
              (Tùy chọn) Bạn có thể tải lên nhiều tệp
            </Text>
          </Upload>

        </Form>
      </Modal>
    </Layout>
  );
};

export default DocumentPage;
