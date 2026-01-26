import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Row, Col, Card, Avatar, Tag, Table, Button } from 'antd';
import {
  ProjectOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/dashboard/StatCard';
import ProgressChart from '../../components/dashboard/ProgressChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { StatCardSkeleton } from '../../components/common/SkeletonLoader';
import useProjectStore from '../../store/projectStore';
import useTaskStore from '../../store/taskStore';
import useAuthStore from '../../store/authStore';
import { usePermission } from '../../hooks/usePermission';
import { ROLES, getTaskStatusColor } from '../../utils/constants';
import dayjs from 'dayjs';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { fetchProjects, projects, isLoading: projectsLoading } = useProjectStore();
  const { fetchTasks, tasks, isLoading: tasksLoading } = useTaskStore();
  const { isPM, isLeader } = usePermission();

  useEffect(() => {
    fetchProjects();
    // Fetch tasks for all projects
    projects.forEach((project) => {
      fetchTasks(project.id);
    });
  }, [fetchProjects, fetchTasks]);

  // Get all tasks across all projects
  const allTasks = tasks;
  const overdueTasks = allTasks.filter((task) => {
    if (!task.dueDate) return false;
    return dayjs(task.dueDate).isBefore(dayjs(), 'day') && task.status !== 'DONE';
  });

  const isLoading = projectsLoading || tasksLoading;

  // Calculate stats based on role
  const getStats = () => {
    const activeTasks = allTasks.filter((t) => t.status !== 'DONE');
    const completedTasks = allTasks.filter((t) => t.status === 'DONE');
    const inReviewTasks = allTasks.filter((t) => t.status === 'REVIEW');

    if (isPM()) {
      return [
        {
          title: 'Total Projects',
          value: projects.length,
          icon: <ProjectOutlined />,
          color: '#1E40AF',
        },
        {
          title: 'Active Tasks',
          value: activeTasks.length,
          icon: <FileTextOutlined />,
          color: '#22C55E',
        },
        {
          title: 'In Review',
          value: inReviewTasks.length,
          icon: <ExclamationCircleOutlined />,
          color: '#F59E0B',
        },
        {
          title: 'Overdue Tasks',
          value: overdueTasks.length,
          icon: <WarningOutlined />,
          color: '#EF4444',
        },
      ];
    } else if (isLeader()) {
      const myProjects = projects.filter((p) =>
        p.members?.some((m) => m.userId === user?.id && m.role === ROLES.LEADER)
      );
      const myTasks = allTasks.filter((t) =>
        myProjects.some((p) => p.id === t.projectId)
      );

      return [
        {
          title: 'My Projects',
          value: myProjects.length,
          icon: <ProjectOutlined />,
          color: '#1E40AF',
        },
        {
          title: 'My Tasks',
          value: myTasks.filter((t) => t.status !== 'DONE').length,
          icon: <FileTextOutlined />,
          color: '#22C55E',
        },
        {
          title: 'Tasks to Review',
          value: myTasks.filter((t) => t.status === 'REVIEW').length,
          icon: <ExclamationCircleOutlined />,
          color: '#F59E0B',
        },
        {
          title: 'Completed',
          value: myTasks.filter((t) => t.status === 'DONE').length,
          icon: <CheckCircleOutlined />,
          color: '#14B8A6',
        },
      ];
    } else {
      // Member dashboard
      const myTasks = allTasks.filter((t) => t.assigneeId === user?.id);

      return [
        {
          title: 'My Tasks',
          value: myTasks.filter((t) => t.status !== 'DONE').length,
          icon: <FileTextOutlined />,
          color: '#1E40AF',
        },
        {
          title: 'In Progress',
          value: myTasks.filter((t) => t.status === 'IN_PROGRESS').length,
          icon: <ClockCircleOutlined />,
          color: '#3B82F6',
        },
        {
          title: 'In Review',
          value: myTasks.filter((t) => t.status === 'REVIEW').length,
          icon: <ExclamationCircleOutlined />,
          color: '#F59E0B',
        },
        {
          title: 'Completed',
          value: myTasks.filter((t) => t.status === 'DONE').length,
          icon: <CheckCircleOutlined />,
          color: '#22C55E',
        },
      ];
    }
  };

  const stats = getStats();

  const progressData = projects.slice(0, 4).map((project) => {
    const projectTasks = allTasks.filter((t) => t.projectId === project.id);
    const completed = projectTasks.filter((t) => t.status === 'DONE').length;
    const total = projectTasks.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      label: project.name,
      value: progress,
      color: '#1E40AF',
    };
  });

  const overdueColumns = [
    {
      title: 'Task',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <a onClick={() => navigate(`/projects/${record.projectId}/tasks/${record.id}`)}>
          {text}
        </a>
      ),
    },
    {
      title: 'Project',
      dataIndex: 'project',
      key: 'project',
      render: (project) => project?.name || '-',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        return <Tag color={getTaskStatusColor(status)}>{status?.replace('_', ' ')}</Tag>;
      },
    },
  ];

  const recentActivity = [
    {
      title: 'New task created',
      description: 'Task "Design Dashboard" was created',
      avatar: <Avatar icon={<UserOutlined />} />,
      time: '2 hours ago',
      tag: <Tag color="blue">Task</Tag>,
    },
    {
      title: 'Project updated',
      description: 'Project "Alpha" status changed to In Progress',
      avatar: <Avatar icon={<UserOutlined />} />,
      time: '5 hours ago',
      tag: <Tag color="green">Project</Tag>,
    },
    {
      title: 'Member added',
      description: 'John Doe was added to Project Beta',
      avatar: <Avatar icon={<UserOutlined />} />,
      time: '1 day ago',
      tag: <Tag color="purple">Member</Tag>,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <h1 className="dashboard-title">Dashboard</h1>
        <Row gutter={[24, 24]} className="dashboard-stats">
          {[1, 2, 3, 4].map((i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <StatCardSkeleton />
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="dashboard-container"
    >
      <h1 className="dashboard-title">Dashboard</h1>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} className="dashboard-stats">
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <StatCard {...stat} />
          </Col>
        ))}
      </Row>

      {/* Charts and Activity */}
      <Row gutter={[24, 24]} className="dashboard-content">
        <Col xs={24} lg={16}>
          <ProgressChart title="Project Progress" data={progressData} />
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Recent Activity" className="activity-card">
            <div className="activity-list">
              {recentActivity.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="activity-item"
                >
                  <div style={{ display: 'flex', gap: '12px', padding: '12px 0' }}>
                    <div className="activity-avatar">
                      {item.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 500 }}>{item.title}</span>
                        {item.tag}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {item.description}
                      </div>
                      <div style={{ color: 'var(--text-tertiary)', fontSize: '12px', marginTop: '4px' }}>
                        {item.time}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Overdue Tasks (PM/Leader only) */}
      {(isPM() || isLeader()) && overdueTasks.length > 0 && (
        <Row gutter={[24, 24]} className="dashboard-content" style={{ marginTop: 24 }}>
          <Col xs={24}>
            <Card
              title={
                <span>
                  <WarningOutlined style={{ color: 'var(--error-color)', marginRight: 8 }} />
                  Overdue Tasks ({overdueTasks.length})
                </span>
              }
              extra={
                <Button type="link" onClick={() => navigate('/tasks')}>
                  View All Tasks
                </Button>
              }
            >
              <Table
                columns={overdueColumns}
                dataSource={overdueTasks}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                size="small"
              />
            </Card>
          </Col>
        </Row>
      )}
    </motion.div>
  );
};

export default Dashboard;
