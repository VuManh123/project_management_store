import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Input, Badge, Dropdown, Avatar, Space, Button } from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import NotificationDropdown from '../notifications/NotificationDropdown';
import './Header.css';

const { Header: AntHeader } = Layout;

const Header = ({ onMenuClick }) => {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader className="main-header">
      <div className="header-left">
        {onMenuClick && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={onMenuClick}
            className="header-menu-button"
          />
        )}
        <AnimatePresence>
          {searchExpanded ? (
            <motion.div
              key="expanded"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="header-search-expanded"
            >
              <Input
                placeholder="Search projects, tasks..."
                prefix={<SearchOutlined />}
                autoFocus
                onBlur={() => setSearchExpanded(false)}
                className="header-search-input"
              />
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchExpanded(true)}
              className="header-search-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SearchOutlined />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="header-right">
        <Space size="large">
          <NotificationDropdown />

          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ cursor: 'pointer' }}
            >
              <Space>
                <Avatar
                  src={user?.avatar}
                  icon={<UserOutlined />}
                  className="header-avatar"
                />
                <span className="header-username">{user?.name || 'User'}</span>
              </Space>
            </motion.div>
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header;
