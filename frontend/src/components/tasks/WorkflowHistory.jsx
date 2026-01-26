import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Timeline, Tag, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { taskAPI } from '../../services/api';
import { getTaskStatusColor } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import './WorkflowHistory.css';

dayjs.extend(relativeTime);

const WorkflowHistory = ({ taskId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch workflow history - adjust API call based on your backend
    const fetchHistory = async () => {
      try {
        // Mock data for now - replace with actual API call
        // const response = await taskAPI.getWorkflowHistory(taskId);
        // setHistory(response.data);
        
        // Mock data
        setHistory([
          {
            id: 1,
            fromStatus: null,
            toStatus: 'TODO',
            userId: '1',
            userName: 'John Doe',
            createdAt: new Date(Date.now() - 86400000),
          },
          {
            id: 2,
            fromStatus: 'TODO',
            toStatus: 'IN_PROGRESS',
            userId: '1',
            userName: 'John Doe',
            createdAt: new Date(Date.now() - 43200000),
          },
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch workflow history:', error);
        setLoading(false);
      }
    };

    if (taskId) {
      fetchHistory();
    }
  }, [taskId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (history.length === 0) {
    return <p>No workflow history available</p>;
  }


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="workflow-history"
    >
      <Timeline
        items={history.map((item) => ({
          children: (
            <div className="workflow-history-item">
              <div className="workflow-history-header">
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <strong>{item.userName}</strong>
                  {item.fromStatus ? (
                    <>
                      changed status from{' '}
                      <Tag color={getStatusColor(item.fromStatus)}>
                        {item.fromStatus.replace('_', ' ')}
                      </Tag>
                      to{' '}
                      <Tag color={getStatusColor(item.toStatus)}>
                        {item.toStatus.replace('_', ' ')}
                      </Tag>
                    </>
                  ) : (
                    <>
                      created task with status{' '}
                      <Tag color={getTaskStatusColor(item.toStatus)}>
                        {item.toStatus.replace('_', ' ')}
                      </Tag>
                    </>
                  )}
                </Space>
              </div>
              <div className="workflow-history-time">
                {dayjs(item.createdAt).fromNow()}
              </div>
            </div>
          ),
        }))}
      />
    </motion.div>
  );
};

export default WorkflowHistory;
