import { motion } from 'framer-motion';
import { Empty } from 'antd';

const EmptyState = ({ description = 'No data', image = Empty.PRESENTED_IMAGE_SIMPLE, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ padding: '40px 20px' }}
    >
      <Empty description={description} image={image}>
        {children}
      </Empty>
    </motion.div>
  );
};

export default EmptyState;
