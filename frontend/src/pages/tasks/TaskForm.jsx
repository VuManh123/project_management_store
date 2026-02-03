import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Input,
  DatePicker,
  Button,
  Card,
  message,
  Select,
  InputNumber,
  Slider,
  Typography,
  Divider,
  Space,
  Row,
  Col,
  Spin,
} from 'antd';
import {
  SaveOutlined,
  CloseOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import useTaskStore from '../../store/taskStore';
import useProjectStore from '../../store/projectStore';
import { TaskStatus, TaskPriority, TaskType } from '../../utils/enums';
import dayjs from 'dayjs';
import './TaskForm.css';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const TaskForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { projectId, taskId } = useParams();
  const isEditMode = !!taskId;
  
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { createTask, updateTask, fetchTaskById, selectedTask, isLoading } = useTaskStore();
  const { fetchProjectById, selectedProject } = useProjectStore();

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId);
    }
    
    if (isEditMode && taskId) {
      fetchTaskById(projectId, taskId);
    }
  }, [projectId, taskId, isEditMode]);

  useEffect(() => {
    if (isEditMode && selectedTask) {
      form.setFieldsValue({
        title: selectedTask.title,
        description: selectedTask.description,
        type: selectedTask.type,
        status: selectedTask.status,
        priority: selectedTask.priority,
        assigned_to: selectedTask.assigned_to,
        progress: selectedTask.progress || 0,
        estimate_hour: selectedTask.estimate_hour,
        due_date: selectedTask.due_date ? dayjs(selectedTask.due_date) : null,
        parent_task_id: selectedTask.parent_task_id,
      });
      setProgress(selectedTask.progress || 0);
    }
  }, [isEditMode, selectedTask, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Debug: Check projectId
      console.log('Creating task with projectId:', projectId);
      console.log('Current URL params:', { projectId, taskId });
      
      const taskData = {
        title: values.title,
        description: values.description || '',
        type: values.type,
        status: values.status,
        priority: values.priority,
        assigned_to: values.assigned_to || null,
        progress: values.progress || 0,
        estimate_hour: values.estimate_hour || null,
        due_date: values.due_date?.format('YYYY-MM-DD') || null,
        parent_task_id: values.parent_task_id || null,
      };

      console.log('Task data:', taskData);

      let result;
      if (isEditMode) {
        result = await updateTask(projectId, taskId, taskData);
      } else {
        result = await createTask(projectId, taskData);
      }

      if (result.success) {
        message.success(`Task ${isEditMode ? 'updated' : 'created'} successfully!`);
        navigate(`/projects/${projectId}/tasks`);
      } else {
        message.error(result.error || `Failed to ${isEditMode ? 'update' : 'create'} task`);
      }
    } catch (error) {
      console.error(`${isEditMode ? 'Update' : 'Create'} task error:`, error);
      message.error(`An error occurred while ${isEditMode ? 'updating' : 'creating'} the task`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/projects/${projectId}/tasks`);
  };

  if (isLoading && isEditMode) {
    return (
      <div className="task-form-loading">
        <Spin size="large" />
      </div>
    );
  }

  const projectMembers = selectedProject?.members || [];
  const projectTasks = []; // TODO: Fetch project tasks for parent selection

  return (
    <div className="task-form-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="task-form-card">
          <div className="task-form-header">
            <Title level={2}>
              <CheckCircleOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
              {isEditMode ? 'Edit Task' : 'Create New Task'}
            </Title>
            <p className="task-form-subtitle">
              {isEditMode
                ? 'Update task information below'
                : 'Fill in the details to create a new task'}
            </p>
          </div>

          <Divider />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              type: TaskType.TASK,
              status: TaskStatus.TODO,
              priority: TaskPriority.MEDIUM,
              progress: 0,
            }}
          >
            <Row gutter={24}>
              <Col xs={24} lg={16}>
                {/* Title */}
                <Form.Item
                  name="title"
                  label="Task Title"
                  rules={[
                    { required: true, message: 'Please enter task title' },
                    { min: 2, message: 'Title must be at least 2 characters' },
                    { max: 255, message: 'Title must not exceed 255 characters' },
                  ]}
                >
                  <Input
                    placeholder="Enter task title"
                    size="large"
                    showCount
                    maxLength={255}
                  />
                </Form.Item>

                {/* Description */}
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    { max: 5000, message: 'Description must not exceed 5000 characters' },
                  ]}
                >
                  <TextArea
                    placeholder="Describe the task in detail..."
                    rows={6}
                    showCount
                    maxLength={5000}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={8}>
                {/* Type */}
                <Form.Item
                  name="type"
                  label="Type"
                  rules={[{ required: true, message: 'Please select task type' }]}
                >
                  <Select size="large" placeholder="Select type">
                    <Option value={TaskType.TASK}>Task</Option>
                    <Option value={TaskType.BUG}>Bug</Option>
                    <Option value={TaskType.STORY}>Story</Option>
                    <Option value={TaskType.EPIC}>Epic</Option>
                  </Select>
                </Form.Item>

                {/* Status */}
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true, message: 'Please select status' }]}
                >
                  <Select size="large" placeholder="Select status">
                    <Option value={TaskStatus.TODO}>TODO</Option>
                    <Option value={TaskStatus.IN_PROGRESS}>In Progress</Option>
                    <Option value={TaskStatus.REVIEW}>Review</Option>
                    <Option value={TaskStatus.DONE}>Done</Option>
                    <Option value={TaskStatus.REJECT}>Rejected</Option>
                  </Select>
                </Form.Item>

                {/* Priority */}
                <Form.Item
                  name="priority"
                  label="Priority"
                  rules={[{ required: true, message: 'Please select priority' }]}
                >
                  <Select size="large" placeholder="Select priority">
                    <Option value={TaskPriority.LOW}>Low</Option>
                    <Option value={TaskPriority.MEDIUM}>Medium</Option>
                    <Option value={TaskPriority.HIGH}>High</Option>
                    <Option value={TaskPriority.CRITICAL}>Critical</Option>
                  </Select>
                </Form.Item>

                {/* Assigned To */}
                <Form.Item
                  name="assigned_to"
                  label="Assign To"
                >
                  <Select
                    size="large"
                    placeholder="Select team member"
                    allowClear
                    showSearch
                    optionFilterProp="children"
                  >
                    {projectMembers.map((member) => (
                      <Option key={member.user_id} value={member.user_id}>
                        {member.user?.name || member.user?.email}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                {/* Progress */}
                <Form.Item
                  name="progress"
                  label={`Progress: ${progress}%`}
                >
                  <Slider
                    min={0}
                    max={100}
                    value={progress}
                    onChange={setProgress}
                    marks={{
                      0: '0%',
                      25: '25%',
                      50: '50%',
                      75: '75%',
                      100: '100%',
                    }}
                  />
                </Form.Item>

                {/* Estimated Hours */}
                <Form.Item
                  name="estimate_hour"
                  label="Estimated Hours"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    size="large"
                    min={0}
                    placeholder="Enter estimated hours"
                    addonAfter="hours"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                {/* Due Date */}
                <Form.Item
                  name="due_date"
                  label="Due Date"
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    size="large"
                    format="YYYY-MM-DD"
                    placeholder="Select due date"
                  />
                </Form.Item>

                {/* Parent Task (for subtasks) */}
                <Form.Item
                  name="parent_task_id"
                  label="Parent Task (Optional)"
                >
                  <Select
                    size="large"
                    placeholder="Select parent task"
                    allowClear
                    showSearch
                    optionFilterProp="children"
                  >
                    {projectTasks
                      .filter((t) => t.id !== taskId) // Exclude current task in edit mode
                      .map((task) => (
                        <Option key={task.id} value={task.id}>
                          {task.title}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            {/* Action Buttons */}
            <Form.Item>
              <Space size="middle">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  size="large"
                  loading={loading}
                  className="submit-button"
                >
                  {isEditMode ? 'Update Task' : 'Create Task'}
                </Button>
                <Button
                  icon={<CloseOutlined />}
                  size="large"
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

export default TaskForm;
