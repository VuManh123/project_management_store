import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Modal, Form, Select, Table, Button, Space, Tag, Avatar, message } from 'antd';
import { UserAddOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { projectAPI } from '../../services/api';
import useProjectStore from '../../store/projectStore';
import { usePermission } from '../../hooks/usePermission';
import { ROLES } from '../../utils/constants';
import './MemberModal.css';

const { Option } = Select;

const MemberModal = ({ open, onCancel, projectId, project }) => {
  const [form] = Form.useForm();
  const [members, setMembers] = useState(project?.members || []);
  const [loading, setLoading] = useState(false);
  const { fetchProjectById } = useProjectStore();
  const { canManageProject } = usePermission();

  useEffect(() => {
    if (project) {
      setMembers(project.members || []);
    }
  }, [project]);

  const handleAddMember = async (values) => {
    setLoading(true);
    try {
      await projectAPI.addMember(projectId, values);
      message.success('Member added successfully');
      form.resetFields();
      await fetchProjectById(projectId);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }

    setLoading(true);
    try {
      await projectAPI.removeMember(projectId, memberId);
      message.success('Member removed successfully');
      await fetchProjectById(projectId);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to remove member');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (memberId, newRole) => {
    setLoading(true);
    try {
      await projectAPI.updateMemberRole(projectId, memberId, { role: newRole });
      message.success('Member role updated successfully');
      await fetchProjectById(projectId);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      PM: 'purple',
      LEADER: 'blue',
      MEMBER: 'default',
    };
    return colors[role] || 'default';
  };

  const columns = [
    {
      title: 'Member',
      key: 'member',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserAddOutlined />} />
          <div>
            <div>{record.name || record.email}</div>
            <small style={{ color: 'var(--text-tertiary)' }}>{record.email}</small>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role, record) => {
        if (!canManageProject(project)) {
          return <Tag color={getRoleColor(role)}>{role}</Tag>;
        }

        return (
          <Select
            value={role}
            onChange={(newRole) => handleUpdateRole(record.userId || record.id, newRole)}
            style={{ width: 120 }}
            size="small"
          >
            <Option value={ROLES.PM}>PM</Option>
            <Option value={ROLES.LEADER}>Leader</Option>
            <Option value={ROLES.MEMBER}>Member</Option>
          </Select>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) =>
        canManageProject(project) ? (
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveMember(record.userId || record.id)}
            loading={loading}
          >
            Remove
          </Button>
        ) : null,
    },
  ];

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <Modal
      title="Manage Members"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
      className="member-modal"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={modalVariants}
        transition={{ duration: 0.2 }}
      >
        {canManageProject(project) && (
          <Form
            form={form}
            layout="inline"
            onFinish={handleAddMember}
            style={{ marginBottom: 24, padding: 16, background: 'var(--bg-tertiary)', borderRadius: 8 }}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Select
                placeholder="Select user by email"
                style={{ width: 200 }}
                showSearch
                mode="tags"
                tokenSeparators={[',']}
              >
                {/* Options would come from available users API */}
              </Select>
            </Form.Item>
            <Form.Item
              name="role"
              initialValue={ROLES.MEMBER}
              rules={[{ required: true }]}
            >
              <Select style={{ width: 120 }}>
                <Option value={ROLES.PM}>PM</Option>
                <Option value={ROLES.LEADER}>Leader</Option>
                <Option value={ROLES.MEMBER}>Member</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} icon={<UserAddOutlined />}>
                Add Member
              </Button>
            </Form.Item>
          </Form>
        )}

        <Table
          columns={columns}
          dataSource={members}
          rowKey={(record) => record.userId || record.id}
          pagination={false}
          loading={loading}
        />
      </motion.div>
    </Modal>
  );
};

export default MemberModal;
