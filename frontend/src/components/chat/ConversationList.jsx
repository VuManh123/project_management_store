import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { List, Avatar, Input, Empty, Badge } from 'antd';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useChatStore from '../../store/chatStore';
import useAuthStore from '../../store/authStore';
import './ConversationList.css';

dayjs.extend(relativeTime);

const ConversationList = ({ onSelectConversation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { conversations, fetchConversations, isLoading } = useChatStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const getConversationName = (conversation) => {
    if (conversation.name) {
      return conversation.name; // Group chat
    }
    // 1-1 chat - get the other participant's name
    const otherParticipant = conversation.participants?.find((p) => p.id !== user?.id);
    return otherParticipant?.name || otherParticipant?.email || 'Unknown User';
  };

  const getConversationAvatar = (conversation) => {
    if (conversation.name) {
      // Group chat - use first letter or icon
      return conversation.name.charAt(0).toUpperCase();
    }
    // 1-1 chat - get the other participant's avatar
    const otherParticipant = conversation.participants?.find((p) => p.id !== user?.id);
    return otherParticipant?.avatar;
  };

  const getLastMessage = (conversation) => {
    return conversation.lastMessage?.content || 'No messages yet';
  };

  const filteredConversations = conversations.filter((conv) => {
    const name = getConversationName(conv).toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="conversation-list">
      <div className="conversation-list-header">
        <h2>Messages</h2>
        <Input
          placeholder="Search conversations..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="conversation-search"
        />
      </div>

      <div className="conversation-list-content">
        {filteredConversations.length === 0 ? (
          <Empty description="No conversations" style={{ padding: '40px' }} />
        ) : (
          <List
            dataSource={filteredConversations}
            loading={isLoading}
            renderItem={(conversation) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 4 }}
              >
                <List.Item
                  className="conversation-item"
                  onClick={() => onSelectConversation(conversation)}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge count={conversation.unreadCount || 0} size="small">
                        <Avatar
                          src={getConversationAvatar(conversation)}
                          icon={<UserOutlined />}
                          size="large"
                        />
                      </Badge>
                    }
                    title={
                      <div className="conversation-title">
                        <span>{getConversationName(conversation)}</span>
                        {conversation.lastMessage && (
                          <span className="conversation-time">
                            {dayjs(conversation.lastMessage.createdAt).fromNow()}
                          </span>
                        )}
                      </div>
                    }
                    description={
                      <div className="conversation-preview">
                        {getLastMessage(conversation)}
                      </div>
                    }
                  />
                </List.Item>
              </motion.div>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default ConversationList;
