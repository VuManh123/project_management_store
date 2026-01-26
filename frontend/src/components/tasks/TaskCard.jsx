import { motion } from 'framer-motion';
import { Card, Tag, Avatar, Tooltip } from 'antd';
import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigate } from 'react-router-dom';
import { getTaskStatusColor, getPriorityColor } from '../../utils/constants';
import './TaskCard.css';

dayjs.extend(relativeTime);

const TaskCard = ({ task, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(task);
    } else {
      navigate(`/projects/${task.projectId}/tasks/${task.id}`);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="task-card"
        onClick={handleClick}
        size="small"
      >
        <div className="task-card-header">
          <Tag color={getTaskStatusColor(task.status)}>
            {task.status?.replace('_', ' ')}
          </Tag>
          <Tag color={getPriorityColor(task.priority)}>
            {task.priority}
          </Tag>
        </div>
        
        <h4 className="task-card-title">{task.title}</h4>
        
        {task.description && (
          <p className="task-card-description">{task.description}</p>
        )}

        <div className="task-card-footer">
          {task.assignee && (
            <Tooltip title={task.assignee.name}>
              <Avatar
                size="small"
                src={task.assignee.avatar}
                icon={<UserOutlined />}
              />
            </Tooltip>
          )}
          
          {task.dueDate && (
            <div className="task-card-due-date">
              <ClockCircleOutlined />
              <span>{dayjs(task.dueDate).fromNow()}</span>
            </div>
          )}

          {task.progress !== undefined && (
            <div className="task-card-progress">
              {task.progress}%
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default TaskCard;
