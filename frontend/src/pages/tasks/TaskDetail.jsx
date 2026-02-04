import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Space,
  Avatar,
  Progress,
  message,
  Modal,
  Select,
  Divider,
  Empty,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  BugOutlined,
} from '@ant-design/icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import useTaskStore from '../../store/taskStore';
import { TaskStatus, TaskPriority, TaskType } from '../../utils/enums';
import dayjs from 'dayjs';
import './TaskDetail.css';

const { Option } = Select;

const TaskDetail = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const {
    selectedTask,
    fetchTaskById,
    updateTaskStatus,
    deleteTask,
    isLoading,
  } = useTaskStore();

  useEffect(() => {
    if (projectId && taskId) {
      fetchTaskById(projectId, taskId);
    }
  }, [projectId, taskId]);

  const handleStatusChange = async () => {
    if (!selectedStatus) return;

    const result = await updateTaskStatus(projectId, taskId, selectedStatus);
    if (result.success) {
      message.success('Task status updated successfully');
      setStatusModalOpen(false);
      fetchTaskById(projectId, taskId);
    } else {
      message.error(result.error || 'Failed to update task status');
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: 'Delete Task',
      content: 'Are you sure you want to delete this task? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        const result = await deleteTask(projectId, taskId);
        if (result.success) {
          message.success('Task deleted successfully');
          navigate(`/projects/${projectId}/tasks`);
        } else {
          message.error(result.error || 'Failed to delete task');
        }
      },
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case TaskStatus.TODO:
        return <ClockCircleOutlined />;
      case TaskStatus.IN_PROGRESS:
        return <SyncOutlined spin />;
      case TaskStatus.REVIEW:
        return <ExclamationCircleOutlined />;
      case TaskStatus.DONE:
        return <CheckCircleOutlined />;
      case TaskStatus.REJECT:
        return <ExclamationCircleOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'default';
      case TaskStatus.IN_PROGRESS:
        return 'processing';
      case TaskStatus.REVIEW:
        return 'warning';
      case TaskStatus.DONE:
        return 'success';
      case TaskStatus.REJECT:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusName = (status) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'TODO';
      case TaskStatus.IN_PROGRESS:
        return 'IN PROGRESS';
      case TaskStatus.REVIEW:
        return 'REVIEW';
      case TaskStatus.DONE:
        return 'DONE';
      case TaskStatus.REJECT:
        return 'REJECTED';
      default:
        return 'UNKNOWN';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return 'blue';
      case TaskPriority.MEDIUM:
        return 'orange';
      case TaskPriority.HIGH:
        return 'red';
      case TaskPriority.CRITICAL:
        return 'purple';
      default:
        return 'default';
    }
  };

  const getPriorityName = (priority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return 'LOW';
      case TaskPriority.MEDIUM:
        return 'MEDIUM';
      case TaskPriority.HIGH:
        return 'HIGH';
      case TaskPriority.CRITICAL:
        return 'CRITICAL';
      default:
        return 'UNKNOWN';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case TaskType.BUG:
        return <BugOutlined />;
      case TaskType.TASK:
        return <CheckCircleOutlined />;
      case TaskType.STORY:
        return <UserOutlined />;
      case TaskType.EPIC:
        return <CalendarOutlined />;
      default:
        return <CheckCircleOutlined />;
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case TaskType.TASK:
        return 'TASK';
      case TaskType.BUG:
        return 'BUG';
      case TaskType.STORY:
        return 'STORY';
      case TaskType.EPIC:
        return 'EPIC';
      default:
        return 'UNKNOWN';
    }
  };

  if (isLoading && !selectedTask) {
    return <LoadingSpinner />;
  }

  if (!selectedTask) {
    return <EmptyState description="Task not found" />;
  }

  return (
    <div className="task-detail-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="task-detail-header">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(`/projects/${projectId}/tasks`)}
          >
            Back to Tasks
          </Button>
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/projects/${projectId}/tasks/${taskId}/edit`)}
            >
              Edit
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Space>
        </div>

        {/* Main Content */}
        <Card className="task-detail-card">
          <div className="task-detail-title">
            <Space size="middle">
              <Tag
                icon={getTypeIcon(selectedTask.type)}
                color={selectedTask.type === TaskType.BUG ? 'red' : 'blue'}
              >
                {getTypeName(selectedTask.type)}
              </Tag>
              <h1>{selectedTask.title}</h1>
            </Space>
          </div>

          <div className="task-detail-tags">
            <Space size="middle">
              <Tag
                icon={getStatusIcon(selectedTask.status)}
                color={getStatusColor(selectedTask.status)}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSelectedStatus(selectedTask.status);
                  setStatusModalOpen(true);
                }}
              >
                {getStatusName(selectedTask.status)}
              </Tag>
              <Tag color={getPriorityColor(selectedTask.priority)}>
                {getPriorityName(selectedTask.priority)}
              </Tag>
            </Space>
          </div>

          <Divider />

          <Descriptions column={2} bordered>
            <Descriptions.Item label="Description" span={2}>
              {selectedTask.description || 'No description'}
            </Descriptions.Item>
            <Descriptions.Item label="Assigned To">
              {selectedTask.assignedTo ? (
                <Space>
                  <Avatar
                    size="small"
                    src={selectedTask.assignedTo.avatar}
                    icon={<UserOutlined />}
                  />
                  <span>{selectedTask.assignedTo.name}</span>
                </Space>
              ) : (
                <span style={{ color: '#999' }}>Unassigned</span>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Reporter">
              {selectedTask.reporterUser ? (
                <Space>
                  <Avatar
                    size="small"
                    src={selectedTask.reporterUser.avatar}
                    icon={<UserOutlined />}
                  />
                  <span>{selectedTask.reporterUser.name}</span>
                </Space>
              ) : (
                <span style={{ color: '#999' }}>Unknown</span>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Progress">
              <Progress
                percent={selectedTask.progress || 0}
                size="small"
                status={
                  selectedTask.status === TaskStatus.DONE ? 'success' : 'active'
                }
              />
            </Descriptions.Item>
            <Descriptions.Item label="Estimated Hours">
              {selectedTask.estimate_hour
                ? `${selectedTask.estimate_hour}h`
                : 'Not set'}
            </Descriptions.Item>
            <Descriptions.Item label="Due Date">
              {selectedTask.due_date ? (
                <Space>
                  <CalendarOutlined />
                  {dayjs(selectedTask.due_date).format('MMMM D, YYYY')}
                </Space>
              ) : (
                <span style={{ color: '#999' }}>No due date</span>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              <Space>
                <ClockCircleOutlined />
                {dayjs(selectedTask.created_at).format('MMMM D, YYYY HH:mm')}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              <Space>
                <ClockCircleOutlined />
                {dayjs(selectedTask.updated_at).format('MMMM D, YYYY HH:mm')}
              </Space>
            </Descriptions.Item>
          </Descriptions>

          {/* Parent Task */}
          {selectedTask.parentTask && (
            <>
              <Divider>Parent Task</Divider>
              <Card
                size="small"
                hoverable
                onClick={() =>
                  navigate(`/projects/${projectId}/tasks/${selectedTask.parentTask.id}`)
                }
                className="parent-task-card"
              >
                <Space>
                  <Tag
                    icon={getStatusIcon(selectedTask.parentTask.status)}
                    color={getStatusColor(selectedTask.parentTask.status)}
                  >
                    {getStatusName(selectedTask.parentTask.status)}
                  </Tag>
                  <span>{selectedTask.parentTask.title}</span>
                </Space>
              </Card>
            </>
          )}

          {/* Subtasks */}
          {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
            <>
              <Divider>Subtasks ({selectedTask.subtasks.length})</Divider>
              <div className="subtasks-list">
                {selectedTask.subtasks.map((subtask) => (
                  <Card
                    key={subtask.id}
                    size="small"
                    hoverable
                    onClick={() =>
                      navigate(`/projects/${projectId}/tasks/${subtask.id}`)
                    }
                    className="subtask-card"
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div className="subtask-header">
                        <Space>
                          <Tag
                            icon={getStatusIcon(subtask.status)}
                            color={getStatusColor(subtask.status)}
                          >
                            {getStatusName(subtask.status)}
                          </Tag>
                          <Tag color={getPriorityColor(subtask.priority)}>
                            {getPriorityName(subtask.priority)}
                          </Tag>
                        </Space>
                      </div>
                      <h4>{subtask.title}</h4>
                      {subtask.assignedTo && (
                        <Space size="small">
                          <Avatar
                            size="small"
                            src={subtask.assignedTo.avatar}
                            icon={<UserOutlined />}
                          />
                          <span>{subtask.assignedTo.name}</span>
                        </Space>
                      )}
                    </Space>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Comments Section (placeholder) */}
          {selectedTask.comments && selectedTask.comments.length > 0 && (
            <>
              <Divider>Comments ({selectedTask.comments.length})</Divider>
              <div className="comments-section">
                {selectedTask.comments.map((comment) => (
                  <Card key={comment.id} size="small" className="comment-card">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Space>
                        <Avatar
                          size="small"
                          src={comment.user?.avatar}
                          icon={<UserOutlined />}
                        />
                        <span style={{ fontWeight: 500 }}>{comment.user?.name}</span>
                        <span style={{ color: '#999', fontSize: '12px' }}>
                          {dayjs(comment.created_at).format('MMMM D, YYYY HH:mm')}
                        </span>
                      </Space>
                      <p>{comment.content}</p>
                    </Space>
                  </Card>
                ))}
              </div>
            </>
          )}
        </Card>
      </motion.div>

      {/* Status Update Modal */}
      <Modal
        title="Update Task Status"
        open={statusModalOpen}
        onOk={handleStatusChange}
        onCancel={() => setStatusModalOpen(false)}
        okText="Update"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <p>Select new status for this task:</p>
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            style={{ width: '100%' }}
          >
            <Option value={TaskStatus.TODO}>
              <Tag icon={<ClockCircleOutlined />} color="default">
                TODO
              </Tag>
            </Option>
            <Option value={TaskStatus.IN_PROGRESS}>
              <Tag icon={<SyncOutlined spin />} color="processing">
                IN PROGRESS
              </Tag>
            </Option>
            <Option value={TaskStatus.REVIEW}>
              <Tag icon={<ExclamationCircleOutlined />} color="warning">
                REVIEW
              </Tag>
            </Option>
            <Option value={TaskStatus.DONE}>
              <Tag icon={<CheckCircleOutlined />} color="success">
                DONE
              </Tag>
            </Option>
            <Option value={TaskStatus.REJECT}>
              <Tag icon={<ExclamationCircleOutlined />} color="error">
                REJECTED
              </Tag>
            </Option>
          </Select>
        </Space>
      </Modal>
    </div>
  );
};

export default TaskDetail;
