import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Row,
  Col,
  Card,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Tooltip,
  Avatar,
  Progress,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  BugOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import AnimatedCard from '../../components/common/AnimatedCard';
import EmptyState from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import useTaskStore from '../../store/taskStore';
import { TaskStatus, TaskPriority, TaskType } from '../../utils/enums';
import './TaskList.css';

const { Search } = Input;
const { Option } = Select;

const TaskList = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const { fetchTasks, tasks, isLoading, clearTasks } = useTaskStore();

  useEffect(() => {
    if (projectId) {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterPriority !== 'all') params.priority = filterPriority;
      if (filterType !== 'all') params.type = filterType;

      fetchTasks(projectId, params);
    } else {
      // If no projectId, show message or redirect
      console.warn('TaskList: No projectId provided. Cannot fetch tasks.');
    }

    return () => clearTasks();
  }, [projectId, searchTerm, filterStatus, filterPriority, filterType]);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="task-list-container">
        <div className="task-list-header">
          <h1 className="task-list-title">Tasks</h1>
        </div>
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Col xs={24} sm={12} lg={8} key={i}>
              <CardSkeleton />
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h1 className="task-list-title">Tasks</h1>
        {projectId && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => navigate(`/projects/${projectId}/tasks/new`)}
              className="create-task-button"
            >
              Create Task
            </Button>
          </motion.div>
        )}
      </div>

      {!projectId && (
        <Card style={{ marginBottom: 24 }}>
          <EmptyState description="Please select a project to view and manage tasks">
            <Button type="primary" onClick={() => navigate('/projects')}>
              Go to Projects
            </Button>
          </EmptyState>
        </Card>
      )}

      {/* Filters */}
      <motion.div
        className="task-list-filters"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Space size="middle" wrap>
          <Search
            placeholder="Search tasks..."
            allowClear
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 150 }}
            placeholder="Status"
          >
            <Option value="all">All Status</Option>
            <Option value={TaskStatus.TODO}>TODO</Option>
            <Option value={TaskStatus.IN_PROGRESS}>In Progress</Option>
            <Option value={TaskStatus.REVIEW}>Review</Option>
            <Option value={TaskStatus.DONE}>Done</Option>
            <Option value={TaskStatus.REJECT}>Rejected</Option>
          </Select>
          <Select
            value={filterPriority}
            onChange={setFilterPriority}
            style={{ width: 150 }}
            placeholder="Priority"
          >
            <Option value="all">All Priority</Option>
            <Option value={TaskPriority.LOW}>Low</Option>
            <Option value={TaskPriority.MEDIUM}>Medium</Option>
            <Option value={TaskPriority.HIGH}>High</Option>
            <Option value={TaskPriority.CRITICAL}>Critical</Option>
          </Select>
          <Select
            value={filterType}
            onChange={setFilterType}
            style={{ width: 150 }}
            placeholder="Type"
          >
            <Option value="all">All Type</Option>
            <Option value={TaskType.TASK}>Task</Option>
            <Option value={TaskType.BUG}>Bug</Option>
            <Option value={TaskType.STORY}>Story</Option>
            <Option value={TaskType.EPIC}>Epic</Option>
          </Select>
        </Space>
      </motion.div>

      {/* Tasks Grid */}
      {tasks.length === 0 ? (
        <EmptyState description="No tasks found">
          {projectId && (
            <Button
              type="primary"
              onClick={() => navigate(`/projects/${projectId}/tasks/new`)}
            >
              Create Your First Task
            </Button>
          )}
        </EmptyState>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Row gutter={[16, 16]}>
            {tasks.map((task) => (
              <Col xs={24} sm={12} lg={8} key={task.id}>
                <motion.div variants={itemVariants}>
                  <AnimatedCard
                    hover
                    className="task-card"
                    onClick={() =>
                      navigate(`/projects/${projectId}/tasks/${task.id}`)
                    }
                  >
                    <div className="task-card-header">
                      <Space>
                        <Tag
                          icon={getTypeIcon(task.type)}
                          color={task.type === TaskType.BUG ? 'red' : 'blue'}
                        >
                          {getTypeName(task.type)}
                        </Tag>
                        <Tag
                          icon={getStatusIcon(task.status)}
                          color={getStatusColor(task.status)}
                        >
                          {getStatusName(task.status)}
                        </Tag>
                      </Space>
                      <Tag color={getPriorityColor(task.priority)}>
                        {getPriorityName(task.priority)}
                      </Tag>
                    </div>

                    <h3 className="task-title">{task.title}</h3>
                    <p className="task-description">
                      {task.description || 'No description'}
                    </p>

                    <div className="task-progress">
                      <span>Progress</span>
                      <Progress
                        percent={task.progress || 0}
                        size="small"
                        status={
                          task.status === TaskStatus.DONE
                            ? 'success'
                            : 'active'
                        }
                      />
                    </div>

                    <div className="task-card-footer">
                      <Space>
                        {task.assignedTo ? (
                          <Tooltip title={task.assignedTo.name}>
                            <Avatar
                              size="small"
                              src={task.assignedTo.avatar}
                              icon={<UserOutlined />}
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Unassigned">
                            <Avatar size="small" icon={<UserOutlined />} />
                          </Tooltip>
                        )}
                        {task.due_date && (
                          <Tooltip title="Due date">
                            <Space size={4}>
                              <CalendarOutlined />
                              <span className="task-due-date">
                                {new Date(task.due_date).toLocaleDateString()}
                              </span>
                            </Space>
                          </Tooltip>
                        )}
                      </Space>
                      {task.subtasks && task.subtasks.length > 0 && (
                        <Tag>{task.subtasks.length} subtasks</Tag>
                      )}
                    </div>
                  </AnimatedCard>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      )}
    </div>
  );
};

export default TaskList;
