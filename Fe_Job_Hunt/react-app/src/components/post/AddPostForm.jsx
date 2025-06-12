import React, { useState, useRef } from 'react';
import { Form, Input, Button, Select, message, Row, Col, Typography, Space } from 'antd';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './AddPostForm.css';
import { addPost } from '../../services/PostService';

const { Option } = Select;
const { Title } = Typography;

// Initialize a markdown parser
const mdParser = new MarkdownIt();

// Categories for blog posts
const categories = [
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

const AddPostForm = ({ onSuccess ,userInfo}) => {
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);

  // Handle editor's change
  const handleEditorChange = ({ html, text }) => {
    setContent(text);
  };

  const handleSubmit = (values) => {
    setLoading(true);
        const postData = {
      title: values.title,
      content: content,
      status: 'pending',
      authorId: userInfo?.userId
    };

    addPost(
      postData,
      // Success callback
      (response) => {
        message.success('Bài viết đã được tạo thành công!');
        form.resetFields();
        setContent('');
        
        if (editorRef.current) {
          // Reset the editor content
          editorRef.current.setContent('');
        }
        
        // Call the success callback if provided
        if (onSuccess) {
          onSuccess();
        }
        setLoading(false);
      },
      // Error callback
      (error) => {
        console.error('Error creating post:', error);
        message.error('Không thể tạo bài viết. Vui lòng thử lại!');
        setLoading(false);
      }
    );
  };

  return (
    <div className="add-post-container">
      <Title level={2}>Tạo Bài Viết Mới</Title>
      <div className="form-helper-text">
        Viết bài chia sẻ kiến thức, kinh nghiệm hoặc thông tin hữu ích
      </div>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ status: 'pending' }}
        className="post-form"
      >
        <Row gutter={24}>
          <Col xs={24} md={24}>
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[
                { required: true, message: 'Vui lòng nhập tiêu đề bài viết!' },
                { max: 200, message: 'Tiêu đề không được vượt quá 200 ký tự!' }
              ]}
            >
              <Input placeholder="Nhập tiêu đề bài viết" size="large" />
            </Form.Item>

            <Form.Item
              label="Nội dung"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung bài viết!' }]}
            >
              <MdEditor
                ref={editorRef}
                style={{ height: '500px' }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleEditorChange}
                placeholder="Viết nội dung bài viết ở đây... Hỗ trợ định dạng Markdown."
                config={{
                  view: { menu: true, md: true, html: true },
                  canView: { menu: true, md: true, html: true, fullScreen: true, hideMenu: true }
                }}
              />
            </Form.Item>
          </Col>
          
        </Row>

        <Form.Item>
          <Space size="middle">
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              Đăng bài viết
            </Button>
            <Button type="default" size="large">
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddPostForm;