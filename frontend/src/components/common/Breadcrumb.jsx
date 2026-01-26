import { motion } from 'framer-motion';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useLocation, Link } from 'react-router-dom';
import './Breadcrumb.css';

const Breadcrumb = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);

  const breadcrumbNameMap = {
    dashboard: 'Dashboard',
    projects: 'Projects',
    tasks: 'Tasks',
    chat: 'Chat',
    login: 'Login',
    register: 'Register',
  };

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const name = breadcrumbNameMap[pathSnippets[index]] || pathSnippets[index];
    
    const isLast = index === pathSnippets.length - 1;
    
    return {
      key: url,
      title: isLast ? (
        <span>{name}</span>
      ) : (
        <Link to={url}>{name}</Link>
      ),
    };
  });

  const breadcrumbItems = [
    {
      title: (
        <Link to="/dashboard">
          <HomeOutlined /> Home
        </Link>
      ),
      key: 'home',
    },
    ...extraBreadcrumbItems,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="breadcrumb-container"
    >
      <AntBreadcrumb items={breadcrumbItems} />
    </motion.div>
  );
};

export default Breadcrumb;
