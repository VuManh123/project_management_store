import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dropdown, Badge, Empty, Button, Divider } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useNotificationStore from '../../store/notificationStore';
import useSocketStore from '../../store/socketStore';
import './NotificationDropdown.css';

dayjs.extend(relativeTime);

const NotificationDropdown = () => {
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
  } = useNotificationStore();
  const { socket, on, off } = useSocketStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (socket) {
      const cleanup = on('notification', (notification) => {
        addNotification(notification);
      });
      return cleanup;
    }
  }, [socket, on, off, addNotification]);

  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const getNotificationIcon = (type) => {
    const icons = {
      task_assigned: '📋',
      task_updated: '✏️',
      task_commented: '💬',
      project_updated: '📁',
      member_added: '👤',
      status_changed: '🔄',
    };
    return icons[type] || '🔔';
  };

  const notificationContent = (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h3>Notifications</h3>
        {unreadCount > 0 && (
          <Button
            type="link"
            size="small"
            onClick={handleMarkAllAsRead}
            icon={<CheckOutlined />}
          >
            Mark all as read
          </Button>
        )}
      </div>
      <Divider style={{ margin: '8px 0' }} />
      <div className="notification-list">
        {notifications.length === 0 ? (
          <Empty description="No notifications" style={{ padding: '20px' }} />
        ) : (
          <div>
            {notifications.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`notification-item ${!item.read ? 'unread' : ''}`}
                onClick={() => !item.read && markAsRead(item.id)}
              >
                <div style={{ display: 'flex', gap: '12px', padding: '12px 0' }}>
                  <div className="notification-icon">
                    {getNotificationIcon(item.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="notification-title">
                      <span>{item.title}</span>
                      {!item.read && (
                        <motion.button
                          className="mark-read-btn"
                          onClick={(e) => handleMarkAsRead(item.id, e)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <CheckOutlined />
                        </motion.button>
                      )}
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      <div>{item.message}</div>
                      <div className="notification-time">
                        {dayjs(item.createdAt).fromNow()}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      {notifications.length > 0 && (
        <div className="notification-footer">
          <Button type="link" block>
            View all notifications
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Dropdown
      popupRender={() => notificationContent}
      trigger={['click']}
      placement="bottomRight"
      classNames={{ root: 'notification-dropdown-overlay' }}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{ cursor: 'pointer' }}
      >
        <Badge count={unreadCount} size="small">
          <BellOutlined style={{ fontSize: '18px' }} />
        </Badge>
      </motion.div>
    </Dropdown>
  );
};

export default NotificationDropdown;
