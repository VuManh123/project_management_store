import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import useSocketStore from '../../store/socketStore';
import useChatStore from '../../store/chatStore';
import useAuthStore from '../../store/authStore';
import './ChatWindow.css';

const UserChatWindow = ({ conversation }) => {
  const [sending, setSending] = useState(false);
  const { socket, on, off, joinRoom, leaveRoom, connected } = useSocketStore();
  const { messages, fetchMessages, sendMessage, addMessage } = useChatStore();
  const user = useAuthStore((state) => state.user);

  const conversationMessages = messages[conversation?.id] || [];

  useEffect(() => {
    if (conversation?.id) {
      fetchMessages(conversation.id);
    }
  }, [conversation?.id, fetchMessages]);

  useEffect(() => {
    if (connected && socket && conversation?.id) {
      const roomName = `conversation_${conversation.id}`;
      joinRoom(roomName);

      const handleMessage = (message) => {
        if (message.conversationId === conversation.id) {
          addMessage(conversation.id, message);
        }
      };

      on('new_message', handleMessage);

      return () => {
        leaveRoom(roomName);
        off('new_message', handleMessage);
      };
    }
  }, [connected, socket, conversation?.id, joinRoom, leaveRoom, on, off, addMessage]);

  const handleSend = async (content) => {
    if (!conversation?.id) return;

    setSending(true);
    try {
      const result = await sendMessage(conversation.id, content);
      
      if (result.success && socket && connected) {
        socket.emit('send_message', {
          room: `conversation_${conversation.id}`,
          message: result.message,
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const getConversationName = () => {
    if (conversation?.name) {
      return conversation.name;
    }
    const otherParticipant = conversation?.participants?.find((p) => p.id !== user?.id);
    return otherParticipant?.name || otherParticipant?.email || 'Unknown User';
  };

  const getConversationAvatar = () => {
    if (conversation?.name) {
      return null; // Group chat
    }
    const otherParticipant = conversation?.participants?.find((p) => p.id !== user?.id);
    return otherParticipant?.avatar;
  };

  if (!conversation) {
    return (
      <div className="chat-window-empty">
        <div>Select a conversation to start chatting</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="chat-window"
    >
      <Card
        title={
          <Space>
            <Avatar src={getConversationAvatar()} icon={<UserOutlined />} />
            <span>{getConversationName()}</span>
          </Space>
        }
        className="chat-window-card"
        bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '600px' }}
      >
        <MessageList messages={conversationMessages} loading={false} />
        <MessageInput onSend={handleSend} loading={sending} />
      </Card>
    </motion.div>
  );
};

export default UserChatWindow;
