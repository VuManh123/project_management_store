import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumb from '../common/Breadcrumb';
import useAuthStore from '../../store/authStore';
import useSocketStore from '../../store/socketStore';
import useNotificationStore from '../../store/notificationStore';
import './MainLayout.css';

const { Content } = Layout;

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const location = useLocation();
  const { isAuthenticated, token } = useAuthStore();
  const { connect, disconnect, connected, on } = useSocketStore();
  const { addNotification, fetchNotifications } = useNotificationStore();

  // Reset collapsed state on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992) {
        setSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-hide sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth <= 992) {
      setSidebarVisible(false);
    }
  }, [location.pathname]);

  // Initialize socket connection
  useEffect(() => {
    if (isAuthenticated && token) {
      connect();
    }

    return () => {
      if (connected) {
        disconnect();
      }
    };
  }, [isAuthenticated, token]);

  // Listen for real-time notifications
  useEffect(() => {
    if (connected) {
      const cleanup = on('notification', (notification) => {
        addNotification(notification);
      });

      // Fetch initial notifications
      fetchNotifications();

      return () => {
        if (cleanup) cleanup();
      };
    }
  }, [connected, on, addNotification, fetchNotifications]);

  // Listen for task updates
  useEffect(() => {
    if (connected) {
      const cleanup = on('task_updated', (data) => {
        // Task was updated, could refresh task list if needed
        console.log('Task updated:', data);
      });

      return () => {
        if (cleanup) cleanup();
      };
    }
  }, [connected, on]);

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -20,
    },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4,
  };

  return (
    <Layout className="main-layout">
      {sidebarVisible && (
        <>
          <Sidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />
          {/* Overlay for mobile when sidebar is open */}
          <div 
            className="sidebar-overlay" 
            onClick={() => setSidebarVisible(false)}
          />
        </>
      )}
      <Layout className="main-layout-content">
        <Header onMenuClick={() => setSidebarVisible(!sidebarVisible)} />
        <Content className="main-content">
          <Breadcrumb />
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
            className="page-container"
          >
            <Outlet />
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
