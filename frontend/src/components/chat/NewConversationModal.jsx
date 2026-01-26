import { useEffect, useState } from 'react';
import { Modal, Input, List, Avatar, Empty, Button } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import useChatStore from '../../store/chatStore';
import useAuthStore from '../../store/authStore';
import './NewConversationModal.css';

const NewConversationModal = ({ open, onCancel, onSuccess }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { users, fetchUsers, createConversation, isLoading } = useChatStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open, fetchUsers]);

  const handleUserSelect = (selectedUser) => {
    setSelectedUsers((prev) => {
      if (prev.some((u) => u.id === selectedUser.id)) {
        return prev.filter((u) => u.id !== selectedUser.id);
      }
      return [...prev, selectedUser];
    });
  };

  const handleCreate = async () => {
    if (selectedUsers.length === 0) return;

    const participantIds = selectedUsers.map((u) => u.id);
    const result = await createConversation(participantIds);
    
    if (result.success) {
      setSelectedUsers([]);
      setSearchTerm('');
      onSuccess(result.conversation);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (u.id === user?.id) return false; // Exclude current user
    const name = (u.name || u.email || '').toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  return (
    <Modal
      title="New Conversation"
      open={open}
      onCancel={onCancel}
      onOk={handleCreate}
      okText="Start Chat"
      okButtonProps={{ disabled: selectedUsers.length === 0, loading: isLoading }}
      width={500}
    >
      <div className="new-conversation-modal">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        {selectedUsers.length > 0 && (
          <div className="selected-users">
            <div className="selected-users-label">Selected:</div>
            <div className="selected-users-list">
              {selectedUsers.map((u) => (
                <div key={u.id} className="selected-user-tag">
                  <Avatar size="small" src={u.avatar} icon={<UserOutlined />} />
                  <span>{u.name || u.email}</span>
                  <Button
                    type="text"
                    size="small"
                    onClick={() => handleUserSelect(u)}
                    style={{ marginLeft: 8 }}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="users-list">
          {filteredUsers.length === 0 ? (
            <Empty description="No users found" />
          ) : (
            <List
              dataSource={filteredUsers}
              renderItem={(item) => (
                <List.Item
                  className={`user-item ${selectedUsers.some((u) => u.id === item.id) ? 'selected' : ''}`}
                  onClick={() => handleUserSelect(item)}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} icon={<UserOutlined />} />}
                    title={item.name || item.email}
                    description={item.email}
                  />
                  {selectedUsers.some((u) => u.id === item.id) && (
                    <PlusOutlined style={{ color: 'var(--primary-color)' }} />
                  )}
                </List.Item>
              )}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default NewConversationModal;
