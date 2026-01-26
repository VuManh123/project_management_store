import { useState } from 'react';
import { motion } from 'framer-motion';
import { Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ConversationList from '../../components/chat/ConversationList';
import UserChatWindow from '../../components/chat/UserChatWindow';
import NewConversationModal from '../../components/chat/NewConversationModal';
import useChatStore from '../../store/chatStore';
import './Chat.css';

const Chat = () => {
  const [newConversationOpen, setNewConversationOpen] = useState(false);
  const { selectedConversation, setSelectedConversation } = useChatStore();

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleNewConversationSuccess = (conversation) => {
    setSelectedConversation(conversation);
    setNewConversationOpen(false);
  };

  return (
    <div className="chat-page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="chat-page-header"
      >
        <h1>Messages</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setNewConversationOpen(true)}
        >
          New Conversation
        </Button>
      </motion.div>

      <Row gutter={[16, 16]} className="chat-page-content">
        <Col xs={24} md={8} lg={6}>
          <ConversationList onSelectConversation={handleSelectConversation} />
        </Col>
        <Col xs={24} md={16} lg={18}>
          <UserChatWindow conversation={selectedConversation} />
        </Col>
      </Row>

      <NewConversationModal
        open={newConversationOpen}
        onCancel={() => setNewConversationOpen(false)}
        onSuccess={handleNewConversationSuccess}
      />
    </div>
  );
};

export default Chat;
