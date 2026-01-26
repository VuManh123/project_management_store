import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, Card, Descriptions, Tag, Button, Space, Avatar, List, message } from 'antd';
import {
  ProjectOutlined,
  TeamOutlined,
  FileTextOutlined,
  SettingOutlined,
  PlusOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import MemberModal from '../../components/projects/MemberModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import useProjectStore from '../../store/projectStore';
import useTaskStore from '../../store/taskStore';
import { usePermission } from '../../hooks/usePermission';
import { ROLES, getProjectStatusColor } from '../../utils/constants';
import dayjs from 'dayjs';
import './ProjectDetail.css';

const { TabPane } = Tabs;

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const { selectedProject, fetchProjectById, isLoading } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { canManageProject, canAddMembers } = usePermission();

  useEffect(() => {
    if (id) {
      fetchProjectById(id);
      fetchTasks(id);
    }
  }, [id, fetchProjectById, fetchTasks]);

  const getStatusColor = (status) => {
    const colors = {
      active: 'green',
      completed: 'blue',
      on_hold: 'orange',
      cancelled: 'red',
    };
    return colors[status] || 'default';
  };

  const getRoleColor = (role) => {
    const colors = {
      PM: 'purple',
      LEADER: 'blue',
      MEMBER: 'default',
    };
    return colors[role] || 'default';
  };

  if (isLoading && !selectedProject) {
    return <LoadingSpinner />;
  }

  if (!selectedProject) {
    return <EmptyState description="Project not found" />;
  }

  const projectTasks = tasks.filter((t) => t.projectId === id);

  return (
    <div className="project-detail-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          title={
            <div className="project-detail-header">
              <h1>{selectedProject.name}</h1>
              <Tag color={getProjectStatusColor(selectedProject.status)}>
                {selectedProject.status?.toUpperCase()}
              </Tag>
            </div>
          }
          extra={
            canManageProject(selectedProject) && (
              <Button
                icon={<SettingOutlined />}
                onClick={() => navigate(`/projects/${id}/settings`)}
              >
                Settings
              </Button>
            )
          }
        >
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Description" span={2}>
              {selectedProject.description || 'No description'}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getProjectStatusColor(selectedProject.status)}>
                {selectedProject.status?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {dayjs(selectedProject.createdAt).format('YYYY-MM-DD')}
            </Descriptions.Item>
            <Descriptions.Item label="Members">
              {selectedProject.members?.length || 0} members
            </Descriptions.Item>
            <Descriptions.Item label="Tasks">
              {projectTasks.length} tasks
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Tabs defaultActiveKey="tasks" style={{ marginTop: 24 }}>
          <TabPane
            tab={
              <span>
                <FileTextOutlined />
                Tasks ({projectTasks.length})
              </span>
            }
            key="tasks"
          >
            <Card
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate(`/projects/${id}/tasks?projectId=${id}`)}
                >
                  Create Task
                </Button>
              }
            >
              {projectTasks.length === 0 ? (
                <EmptyState description="No tasks in this project">
                  <Button
                    type="primary"
                    onClick={() => navigate(`/projects/${id}/tasks?projectId=${id}`)}
                  >
                    Create First Task
                  </Button>
                </EmptyState>
              ) : (
                <List
                  dataSource={projectTasks}
                  renderItem={(task) => (
                    <List.Item
                      actions={[
                        <Button
                          type="link"
                          onClick={() => navigate(`/projects/${id}/tasks/${task.id}`)}
                        >
                          View
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        title={task.title}
                        description={task.description}
                      />
                      <Tag>{task.status?.replace('_', ' ')}</Tag>
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <TeamOutlined />
                Members ({selectedProject.members?.length || 0})
              </span>
            }
            key="members"
          >
            <Card
              extra={
                canAddMembers(selectedProject) && (
                  <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    onClick={() => setMemberModalOpen(true)}
                  >
                    Add Member
                  </Button>
                )
              }
            >
              {selectedProject.members?.length === 0 ? (
                <EmptyState description="No members in this project">
                  {canAddMembers(selectedProject) && (
                    <Button
                      type="primary"
                      onClick={() => setMemberModalOpen(true)}
                    >
                      Add First Member
                    </Button>
                  )}
                </EmptyState>
              ) : (
                <List
                  dataSource={selectedProject.members || []}
                  renderItem={(member) => (
                    <List.Item
                      actions={
                        canManageProject(selectedProject)
                          ? [
                              <Button
                                type="link"
                                onClick={() => setMemberModalOpen(true)}
                              >
                                Edit
                              </Button>,
                            ]
                          : []
                      }
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<ProjectOutlined />} />}
                        title={member.name || member.email}
                        description={member.email}
                      />
                      <Tag color={getRoleColor(member.role)}>
                        {member.role}
                      </Tag>
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </TabPane>
        </Tabs>
      </motion.div>

      <MemberModal
        open={memberModalOpen}
        onCancel={() => setMemberModalOpen(false)}
        projectId={id}
        project={selectedProject}
      />
    </div>
  );
};

export default ProjectDetail;
