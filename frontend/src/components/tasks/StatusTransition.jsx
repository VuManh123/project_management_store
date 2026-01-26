import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Select, message, Space } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import useTaskStore from '../../store/taskStore';
import { usePermission } from '../../hooks/usePermission';
import './StatusTransition.css';

const { Option } = Select;

const StatusTransition = ({ task, projectId }) => {
  const [selectedStatus, setSelectedStatus] = useState(task?.status);
  const { updateTaskStatus } = useTaskStore();
  const { canReviewTask } = usePermission();

  const workflowRules = {
    TODO: ['IN_PROGRESS'],
    IN_PROGRESS: ['REVIEW', 'TODO'],
    REVIEW: ['DONE', 'IN_PROGRESS'],
    DONE: [], // Cannot transition from DONE
  };

  const getAvailableTransitions = (currentStatus) => {
    return workflowRules[currentStatus] || [];
  };

  const handleStatusChange = async () => {
    if (!selectedStatus || selectedStatus === task.status) {
      message.warning('Please select a different status');
      return;
    }

    const availableTransitions = getAvailableTransitions(task.status);
    if (!availableTransitions.includes(selectedStatus)) {
      message.error(`Cannot transition from ${task.status} to ${selectedStatus}`);
      return;
    }

    const result = await updateTaskStatus(projectId, task.id, selectedStatus);
    if (result.success) {
      message.success('Status updated successfully');
      setSelectedStatus(result.task.status);
    } else {
      message.error(result.error || 'Failed to update status');
    }
  };

  const availableTransitions = getAvailableTransitions(task?.status);

  if (!task || availableTransitions.length === 0) {
    return (
      <div className="status-transition">
        <p>No status transitions available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="status-transition"
    >
      <Space>
        <span>Current Status: <strong>{task.status?.replace('_', ' ')}</strong></span>
        <Select
          value={selectedStatus}
          onChange={setSelectedStatus}
          style={{ width: 150 }}
          placeholder="Select new status"
        >
          {availableTransitions.map((status) => (
            <Option key={status} value={status}>
              {status.replace('_', ' ')}
            </Option>
          ))}
        </Select>
        <Button
          type="primary"
          icon={<CheckOutlined />}
          onClick={handleStatusChange}
          disabled={!selectedStatus || selectedStatus === task.status}
        >
          Update Status
        </Button>
      </Space>
      <div className="status-transition-info">
        <small>Available transitions: {availableTransitions.join(', ')}</small>
      </div>
    </motion.div>
  );
};

export default StatusTransition;
