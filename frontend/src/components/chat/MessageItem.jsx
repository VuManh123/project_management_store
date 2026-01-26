import { motion } from 'framer-motion';
import { Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useAuthStore from '../../store/authStore';
import './MessageItem.css';

dayjs.extend(relativeTime);

const MessageItem = ({ message }) => {
  const user = useAuthStore((state) => state.user);
  const isOwn = message.userId === user?.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`message-item ${isOwn ? 'own' : ''}`}
    >
      <div className="message-content">
        {!isOwn && (
          <Avatar
            src={message.user?.avatar}
            icon={<UserOutlined />}
            className="message-avatar"
          />
        )}
        <div className="message-bubble">
          {!isOwn && <div className="message-author">{message.user?.name}</div>}
          <div className="message-text">{message.content}</div>
          <div className="message-time">{dayjs(message.createdAt).fromNow()}</div>
        </div>
        {isOwn && (
          <Avatar
            src={user?.avatar}
            icon={<UserOutlined />}
            className="message-avatar"
          />
        )}
      </div>
    </motion.div>
  );
};

export default MessageItem;
