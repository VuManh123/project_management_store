import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  DatePicker,
  Button,
  Card,
  message,
  Space,
  Typography,
  Divider,
  Tag,
  Row,
  Col,
} from 'antd';
import {
  ProjectOutlined,
  SaveOutlined,
  CloseOutlined,
  UserAddOutlined,
  PlusOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import useProjectStore from '../../store/projectStore';
import useAuthStore from '../../store/authStore';
import dayjs from 'dayjs';
import './ProjectCreate.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ProjectCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [memberEmails, setMemberEmails] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const { createProject } = useProjectStore();
  const { user } = useAuthStore();

  const handleAddEmail = () => {
    const email = emailInput.trim();
    if (!email) {
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      message.error('Please enter a valid email address');
      return;
    }

    // Check duplicate
    if (memberEmails.includes(email)) {
      message.warning('This email is already added');
      return;
    }

    // Check if adding own email
    if (email === user?.email) {
      message.warning('You are already the project manager');
      return;
    }

    setMemberEmails([...memberEmails, email]);
    setEmailInput('');
  };

  const handleRemoveEmail = (emailToRemove) => {
    setMemberEmails(memberEmails.filter((email) => email !== emailToRemove));
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const projectData = {
        name: values.name,
        description: values.description || '',
        status: 1, // Always ACTIVE for new projects
        start_date: values.start_date?.format('YYYY-MM-DD') || null,
        end_date: values.end_date?.format('YYYY-MM-DD') || null,
        member_emails: memberEmails, // Send emails instead of IDs
      };

      const result = await createProject(projectData);

      if (result.success) {
        message.success('Project created successfully!');
        navigate('/projects');
      } else {
        message.error(result.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Create project error:', error);
      message.error('An error occurred while creating the project');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/projects');
  };

  const handleEmailInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  return (
    <div className="project-create-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="project-create-content"
      >
        <div className="project-create-header">
          <Space direction="vertical" size="small">
            <Space>
              <ProjectOutlined className="project-create-icon" />
              <Title level={2} style={{ margin: 0 }}>
                Create New Project
              </Title>
            </Space>
            <Text type="secondary">
              Fill in the details below to create a new project. You will be the Project Manager.
            </Text>
          </Space>
        </div>

        <Card className="project-create-card">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="project-create-form"
          >
            <Form.Item
              label="Project Name"
              name="name"
              rules={[
                { required: true, message: 'Please enter project name' },
                { min: 2, message: 'Project name must be at least 2 characters' },
                { max: 255, message: 'Project name must not exceed 255 characters' },
              ]}
            >
              <Input
                placeholder="Enter project name"
                size="large"
                prefix={<ProjectOutlined />}
              />
            </Form.Item>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <CalendarOutlined />
                      <span>Start Date (Optional)</span>
                    </Space>
                  }
                  name="start_date"
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    size="large"
                    format="YYYY-MM-DD"
                    placeholder="Select start date"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <CalendarOutlined />
                      <span>End Date (Optional)</span>
                    </Space>
                  }
                  name="end_date"
                  dependencies={['start_date']}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const startDate = getFieldValue('start_date');
                        if (!value || !startDate || value.isAfter(startDate) || value.isSame(startDate, 'day')) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('End date must be after or equal to start date'));
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    size="large"
                    format="YYYY-MM-DD"
                    placeholder="Select end date"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Description (Optional)"
              name="description"
              rules={[
                { max: 5000, message: 'Description must not exceed 5000 characters' },
              ]}
            >
              <TextArea
                placeholder="Describe your project goals, deliverables, and key information..."
                rows={5}
                showCount
                maxLength={5000}
              />
            </Form.Item>

            <Divider orientation="left">
              <Space>
                <UserAddOutlined />
                <span>Add Team Members (Optional)</span>
              </Space>
            </Divider>

            <div className="member-input-section">
              <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                Enter team member email addresses. You can also add members later from the project details page.
              </Text>
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  placeholder="Enter email address (e.g., user@example.com)"
                  size="large"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyPress={handleEmailInputKeyPress}
                  prefix={<UserAddOutlined />}
                />
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={handleAddEmail}
                >
                  Add
                </Button>
              </Space.Compact>

              {memberEmails.length > 0 && (
                <div className="member-tags-container">
                  <Text strong style={{ marginBottom: 8, display: 'block' }}>
                    Team Members ({memberEmails.length}):
                  </Text>
                  <Space size={[8, 8]} wrap>
                    {memberEmails.map((email) => (
                      <Tag
                        key={email}
                        closable
                        onClose={() => handleRemoveEmail(email)}
                        closeIcon={<CloseCircleOutlined />}
                        color="blue"
                        className="member-tag"
                      >
                        {email}
                      </Tag>
                    ))}
                  </Space>
                </div>
              )}
            </div>

            <Divider />

            <Form.Item style={{ marginBottom: 0, textAlign: 'center' }}>
              <Space size="middle">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<SaveOutlined />}
                  loading={loading}
                  className="create-button"
                >
                  Create Project
                </Button>
                <Button
                  size="large"
                  icon={<CloseOutlined />}
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProjectCreate;
