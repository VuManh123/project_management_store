import { Skeleton } from 'antd';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ rows = 3, active = true, avatar = false, title = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Skeleton
        active={active}
        avatar={avatar}
        title={title}
        paragraph={{ rows }}
      />
    </motion.div>
  );
};

export const CardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Skeleton
        active
        avatar={false}
        title={{ width: '60%' }}
        paragraph={{ rows: 2 }}
        style={{ padding: '24px', background: 'white', borderRadius: '12px' }}
      />
    </motion.div>
  );
};

export const StatCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{ padding: '24px', background: 'white', borderRadius: '12px', height: '100%' }}
    >
      <Skeleton
        active
        title={{ width: '50%' }}
        paragraph={{ rows: 1, width: '30%' }}
      />
    </motion.div>
  );
};

export default SkeletonLoader;
