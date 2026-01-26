import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Row, Col, Card, Button, Input, Select, Tag, Space, Empty } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AnimatedCard from '../../components/common/AnimatedCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import useProjectStore from '../../store/projectStore';
import { getProjectStatusColor } from '../../utils/constants';
import './ProjectList.css';

const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;

const ProjectList = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();
  const { fetchProjects, projects, isLoading, createProject } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };


  if (isLoading) {
    return (
      <div className="project-list-container">
        <div className="project-list-header">
          <h1 className="project-list-title">Projects</h1>
        </div>
        <Row gutter={[24, 24]}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={i}>
              <CardSkeleton />
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <div className="project-list-container">
      <div className="project-list-header">
        <h1 className="project-list-title">Projects</h1>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate('/projects/new')}
            className="create-project-button"
          >
            Create Project
          </Button>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        className="project-list-filters"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Space size="middle" wrap>
          <Search
            placeholder="Search projects..."
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
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="completed">Completed</Option>
            <Option value="on_hold">On Hold</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
          <Space>
            <Button
              type={viewMode === 'grid' ? 'primary' : 'default'}
              icon={<AppstoreOutlined />}
              onClick={() => setViewMode('grid')}
            />
            <Button
              type={viewMode === 'list' ? 'primary' : 'default'}
              icon={<UnorderedListOutlined />}
              onClick={() => setViewMode('list')}
            />
          </Space>
        </Space>
      </motion.div>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <EmptyState description="No projects found">
          <Button type="primary" onClick={() => navigate('/projects/new')}>
            Create Your First Project
          </Button>
        </EmptyState>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {viewMode === 'grid' ? (
            <Row gutter={[24, 24]}>
              {filteredProjects.map((project, index) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={project.id || index}>
                  <motion.div variants={itemVariants}>
                    <AnimatedCard
                      hover
                      className="project-card"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      <div className="project-card-header">
                        <Tag color={getProjectStatusColor(project.status)}>
                          {project.status?.toUpperCase() || 'ACTIVE'}
                        </Tag>
                      </div>
                      <Meta
                        title={project.name || 'Untitled Project'}
                        description={
                          <div>
                            <p className="project-description">
                              {project.description || 'No description'}
                            </p>
                            <div className="project-meta">
                              <Space>
                                <TeamOutlined />
                                <span>{project.memberCount || 0} members</span>
                              </Space>
                              <Space>
                                <CalendarOutlined />
                                <span>{new Date(project.createdAt || Date.now()).toLocaleDateString()}</span>
                              </Space>
                            </div>
                          </div>
                        }
                      />
                    </AnimatedCard>
                  </motion.div>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="project-list-view">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id || index}
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                >
                  <Card
                    className="project-list-item"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <div className="project-list-item-content">
                      <div className="project-list-item-info">
                        <h3>{project.name || 'Untitled Project'}</h3>
                        <p>{project.description || 'No description'}</p>
                        <Space>
                          <Tag color={getStatusColor(project.status)}>
                            {project.status?.toUpperCase() || 'ACTIVE'}
                          </Tag>
                          <span>
                            <TeamOutlined /> {project.memberCount || 0} members
                          </span>
                        </Space>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ProjectList;
