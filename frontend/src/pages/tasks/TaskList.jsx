import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Row, Col, Button, Select, Input, Space, Table, Tag, Avatar, message } from 'antd';
import {
  PlusOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TaskModal from '../../components/tasks/TaskModal';
import KanbanBoard from '../../components/tasks/KanbanBoard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import useTaskStore from '../../store/taskStore';
import useProjectStore from '../../store/projectStore';
import { usePermission } from '../../hooks/usePermission';
import { getTaskStatusColor, getPriorityColor } from '../../utils/constants';
import './TaskList.css';

const { Search } = Input;
const { Option } = Select;

const TaskList = () => {
  const [viewMode, setViewMode] = useState('table');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  
  const navigate = useNavigate();
  const { canAssignTask } = usePermission();
  const {
    tasks,
    filters,
    isLoading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setFilters,
  } = useTaskStore();
  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects();
    if (projectId) {
      setFilters({ projectId });
      fetchTasks(projectId);
    }
  }, [projectId, fetchProjects, fetchTasks, setFilters]);

  const handleCreateTask = async (values) => {
    if (!projectId) {
      message.error('Please select a project first');
      return;
    }

    const result = await createTask(projectId, values);
    if (result.success) {
      message.success('Task created successfully');
      setModalOpen(false);
    } else {
      message.error(result.error || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (values) => {
    if (!projectId || !selectedTask) return;

    const result = await updateTask(projectId, selectedTask.id, values);
    if (result.success) {
      message.success('Task updated successfully');
      setModalOpen(false);
      setSelectedTask(null);
    } else {
      message.error(result.error || 'Failed to update task');
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleDelete = async (taskId) => {
    if (!projectId) return;
    const result = await deleteTask(projectId, taskId);
    if (result.success) {
      message.success('Task deleted successfully');
    } else {
      message.error(result.error || 'Failed to delete task');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <a onClick={() => navigate(`/projects/${projectId}/tasks/${record.id}`)}>
          {text}
        </a>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        return <Tag color={getTaskStatusColor(status)}>{status?.replace('_', ' ')}</Tag>;
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => {
        return <Tag color={getPriorityColor(priority)}>{priority}</Tag>;
      },
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (assignee) =>
        assignee ? (
          <Avatar size="small" src={assignee.avatar} icon={<SearchOutlined />} />
        ) : (
          '-'
        ),
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => `${progress || 0}%`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const filteredTasks = tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.search && !task.title?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (isLoading && tasks.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h1 className="task-list-title">Tasks</h1>
        <Space>
          <Select
            value={filters.projectId || undefined}
            placeholder="Select Project"
            style={{ width: 200 }}
            onChange={(value) => {
              setFilters({ projectId: value });
              fetchTasks(value);
            }}
          >
            {projects.map((project) => (
              <Option key={project.id} value={project.id}>
                {project.name}
              </Option>
            ))}
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedTask(null);
              setModalOpen(true);
            }}
            disabled={!projectId}
          >
            Create Task
          </Button>
        </Space>
      </div>

      <div className="task-list-filters">
        <Space wrap>
          <Search
            placeholder="Search tasks..."
            allowClear
            style={{ width: 300 }}
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
          <Select
            value={filters.status || undefined}
            placeholder="Filter by Status"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setFilters({ status: value })}
          >
            <Option value="TODO">To Do</Option>
            <Option value="IN_PROGRESS">In Progress</Option>
            <Option value="REVIEW">Review</Option>
            <Option value="DONE">Done</Option>
          </Select>
          <Space>
            <Button
              type={viewMode === 'table' ? 'primary' : 'default'}
              icon={<UnorderedListOutlined />}
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
            <Button
              type={viewMode === 'kanban' ? 'primary' : 'default'}
              icon={<AppstoreOutlined />}
              onClick={() => setViewMode('kanban')}
            >
              Kanban
            </Button>
          </Space>
        </Space>
      </div>

      {!projectId ? (
        <EmptyState description="Please select a project to view tasks">
          <Button type="primary" onClick={() => navigate('/projects')}>
            Go to Projects
          </Button>
        </EmptyState>
      ) : filteredTasks.length === 0 ? (
        <EmptyState description="No tasks found">
          <Button
            type="primary"
            onClick={() => {
              setSelectedTask(null);
              setModalOpen(true);
            }}
          >
            Create Your First Task
          </Button>
        </EmptyState>
      ) : viewMode === 'table' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Table
            columns={columns}
            dataSource={filteredTasks}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </motion.div>
      ) : (
        <KanbanBoard tasks={filteredTasks} projectId={projectId} />
      )}

      <TaskModal
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setSelectedTask(null);
        }}
        onOk={selectedTask ? handleUpdateTask : handleCreateTask}
        task={selectedTask}
        projectId={projectId}
      />
    </div>
  );
};

export default TaskList;
