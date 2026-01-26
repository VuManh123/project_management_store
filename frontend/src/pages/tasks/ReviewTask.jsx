import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Space, Descriptions, Tag, message, Divider } from 'antd';
import {
  ArrowLeftOutlined,
  CheckOutlined,
  CloseOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useTaskStore from '../../store/taskStore';
import { usePermission } from '../../hooks/usePermission';
import dayjs from 'dayjs';
import './ReviewTask.css';

const ReviewTask = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { selectedTask, fetchTaskById, updateTaskStatus, isLoading } = useTaskStore();
  const { canReviewTask } = usePermission();

  useEffect(() => {
    if (projectId && taskId) {
      fetchTaskById(projectId, taskId);
    }
  }, [projectId, taskId, fetchTaskById]);

  const handleApprove = async () => {
    if (!canReviewTask()) {
      message.error('You do not have permission to review tasks');
      return;
    }

    setLoading(true);
    try {
      const result = await updateTaskStatus(projectId, taskId, 'DONE');
      if (result.success) {
        message.success('Task approved and marked as done');
        navigate(`/projects/${projectId}/tasks/${taskId}`);
      } else {
        message.error(result.error || 'Failed to approve task');
      }
    } catch (error) {
      message.error('Failed to approve task');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!canReviewTask()) {
      message.error('You do not have permission to review tasks');
      return;
    }

    setLoading(true);
    try {
      const result = await updateTaskStatus(projectId, taskId, 'IN_PROGRESS');
      if (result.success) {
        message.success('Task rejected and returned to in progress');
        navigate(`/projects/${projectId}/tasks/${taskId}`);
      } else {
        message.error(result.error || 'Failed to reject task');
      }
    } catch (error) {
      message.error('Failed to reject task');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading && !selectedTask) {
    return <LoadingSpinner />;
  }

  if (!selectedTask) {
    return <div>Task not found</div>;
  }

  if (selectedTask.status !== 'REVIEW') {
    return (
      <div>
        <p>This task is not in review status.</p>
        <Button onClick={() => navigate(`/projects/${projectId}/tasks/${taskId}`)}>
          Back to Task
        </Button>
      </div>
    );
  }

  return (
    <div className="review-task-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(`/projects/${projectId}/tasks/${taskId}`)}
          style={{ marginBottom: 16 }}
        >
          Back to Task
        </Button>

        <Card
          title={
            <div>
              <FileTextOutlined style={{ marginRight: 8 }} />
              Review Task: {selectedTask.title}
            </div>
          }
        >
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Title" span={2}>
              {selectedTask.title}
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>
              {selectedTask.description || 'No description'}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color="warning">REVIEW</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Assignee">
              {selectedTask.assignee?.name || 'Unassigned'}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {dayjs(selectedTask.createdAt).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {dayjs(selectedTask.updatedAt).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <div className="review-task-reports">
            <h3>Submitted Reports</h3>
            <p>Reports submitted by the assignee will appear here.</p>
            {/* Reports list would go here */}
          </div>

          <Divider />

          <div className="review-task-actions">
            <Space>
              <Button
                type="primary"
                size="large"
                icon={<CheckOutlined />}
                onClick={handleApprove}
                loading={loading}
              >
                Approve & Mark as Done
              </Button>
              <Button
                danger
                size="large"
                icon={<CloseOutlined />}
                onClick={handleReject}
                loading={loading}
              >
                Reject & Return to In Progress
              </Button>
            </Space>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ReviewTask;
