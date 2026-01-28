import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  ProjectOutlined,
  FileTextOutlined,
  MessageOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { usePermission } from '../../hooks/usePermission';
import { ROLES } from '../../utils/constants';
import './Sidebar.css';

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const { isPM, isLeader, isMember } = usePermission();

  // Base menu items - all users can see these
  const baseMenuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/projects',
      icon: <ProjectOutlined />,
      label: 'Projects',
    },
    {
      key: '/tasks',
      icon: <FileTextOutlined />,
      label: 'Tasks',
    },
  ];

  // Role-based menu items
  const roleBasedItems = [];

  // All authenticated users can access chat
  if (user) {
    roleBasedItems.push({
      key: '/chat',
      icon: <MessageOutlined />,
      label: 'Chat',
    });
  }

  // Combine menu items
  const menuItems = [...baseMenuItems, ...roleBasedItems];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="sidebar sidebar-responsive"
      width={250}
      collapsedWidth={80}
      breakpoint="lg"
    >
      <div className="sidebar-header">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="sidebar-logo">MC One</h2>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="sidebar-logo-icon">MC</div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </motion.button>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        className="sidebar-menu"
      />

      <div className="sidebar-footer">
        <Menu
          mode="inline"
          items={[
            {
              key: 'profile',
              icon: <UserOutlined />,
              label: collapsed ? '' : 'Profile',
            },
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: collapsed ? '' : 'Logout',
              danger: true,
              onClick: handleLogout,
            },
          ]}
          className="sidebar-footer-menu"
        />
      </div>
    </Sider>
  );
};

export default Sidebar;
