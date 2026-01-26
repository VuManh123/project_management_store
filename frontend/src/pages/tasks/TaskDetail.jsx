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
  Divider,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import TaskModal from '../../components/tasks/TaskModal';
import StatusTransition from '../../components/tasks/StatusTransition';
import WorkflowHistory from '../../components/tasks/WorkflowHistory';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useTaskStore from '../../store/taskStore';
import { usePermission } from '../../hooks/usePermission';
import { getTaskStatusColor, getPriorityColor } from '../../utils/constants';
import dayjs from 'dayjs';
import './TaskDetail.css';

const TaskDetail = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const { selectedTask, fetchTaskById, updateTask, deleteTask, isLoading } = useTaskStore();
  const { canEditTask, canDeleteTask } = usePermission();

  useEffect(() => {
    if (projectId && taskId) {
      fetchTaskById(projectId, taskId);
    }
  }, [projectId, taskId, fetchTaskById]);

  const handleUpdate = async (values) => {
    const result = await updateTask(projectId, taskId, values);
    if (result.success) {
      message.success('Task updated successfully');
      setModalOpen(false);
    } else {
      message.error(result.error || 'Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await deleteTask(projectId, taskId);
      if (result.success) {
        message.success('Task deleted successfully');
        navigate(`/projects/${projectId}/tasks`);
      } else {
        message.error(result.error || 'Failed to delete task');
      }
    }
  };


  if (isLoading && !selectedTask) {
    return <LoadingSpinner />;
  }

  if (!selectedTask) {
    return <div>Task not found</div>;
  }

  return (
    <div className="task-detail-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(`/projects/${projectId}/tasks`)}
          style={{ marginBottom: 16 }}
        >
          Back to Tasks
        </Button>

        <Card
          title={
            <div className="task-detail-header">
              <h1>{selectedTask.title}</h1>
              <Space>
                <Tag color={getTaskStatusColor(selectedTask.status)}>
                  {selectedTask.status?.replace('_', ' ')}
                </Tag>
                <Tag color={getPriorityColor(selectedTask.priority)}>
                  {selectedTask.priority}
                </Tag>
              </Space>
            </div>
          }
          extra={
            <Space>
              {canEditTask(selectedTask) && (
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setModalOpen(true)}
                >
                  Edit
                </Button>
              )}
              {canDeleteTask(selectedTask) && (
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              )}
            </Space>
          }
        >
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Description" span={2}>
              {selectedTask.description || 'No description'}
            </Descriptions.Item>
            <Descriptions.Item label="Assignee">
              {selectedTask.assignee ? (
                <Space>
                  <Avatar src={selectedTask.assignee.avatar} icon={<UserOutlined />} />
                  <span>{selectedTask.assignee.name}</span>
                </Space>
              ) : (
                'Unassigned'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Due Date">
              {selectedTask.dueDate ? (
                <Space>
                  <CalendarOutlined />
                  {dayjs(selectedTask.dueDate).format('YYYY-MM-DD HH:mm')}
                </Space>
              ) : (
                'No due date'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Progress" span={2}>
              <Progress percent={selectedTask.progress || 0} />
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {dayjs(selectedTask.createdAt).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {dayjs(selectedTask.updatedAt).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <div className="task-detail-actions">
            <h3>Status Management</h3>
            <StatusTransition task={selectedTask} projectId={projectId} />
          </div>

          <Divider />

          <div className="task-detail-history">
            <h3>Workflow History</h3>
            <WorkflowHistory taskId={taskId} />
          </div>
        </Card>
      </motion.div>

      <TaskModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleUpdate}
        task={selectedTask}
        projectId={projectId}
      />
    </div>
  );
};

export default TaskDetail;
