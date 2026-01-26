import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from 'antd';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import useSocketStore from '../../store/socketStore';
import { chatAPI } from '../../services/api';
import './ChatWindow.css';

const ChatWindow = ({ projectId, taskId = null, title }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const { socket, on, off, joinRoom, leaveRoom, connected } = useSocketStore();

  useEffect(() => {
    fetchMessages();
  }, [projectId, taskId]);

  useEffect(() => {
    if (connected && socket) {
      const roomName = taskId ? `task_${taskId}` : `project_${projectId}`;
      joinRoom(roomName);

      const handleMessage = (message) => {
        setMessages((prev) => [...prev, message]);
      };

      on('new_message', handleMessage);

      return () => {
        leaveRoom(roomName);
        off('new_message', handleMessage);
      };
    }
  }, [connected, socket, projectId, taskId, joinRoom, leaveRoom, on, off]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = taskId
        ? await chatAPI.getTaskMessages(projectId, taskId)
        : await chatAPI.getMessages(projectId);
      setMessages(response.data || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (content) => {
    setSending(true);
    try {
      const data = { content };
      const response = taskId
        ? await chatAPI.sendTaskMessage(projectId, taskId, data)
        : await chatAPI.sendMessage(projectId, data);
      
      // Message will be added via socket event
      if (socket && connected) {
        socket.emit('send_message', {
          room: taskId ? `task_${taskId}` : `project_${projectId}`,
          message: response.data,
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="chat-window"
    >
      <Card
        title={title || 'Chat'}
        className="chat-window-card"
        bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '600px' }}
      >
        <MessageList messages={messages} loading={loading} />
        <MessageInput onSend={handleSend} loading={sending} />
      </Card>
    </motion.div>
  );
};

export default ChatWindow;
