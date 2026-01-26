import { motion } from 'framer-motion';
import { Card } from 'antd';

const AnimatedCard = ({
  children,
  hover = true,
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  transition = { duration: 0.3 },
  whileHover = { y: -4, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)' },
  ...cardProps
}) => {
  const MotionCard = motion(Card);

  return (
    <MotionCard
      initial={initial}
      animate={animate}
      transition={transition}
      whileHover={hover ? whileHover : undefined}
      style={{ borderRadius: '12px', overflow: 'hidden' }}
      {...cardProps}
    >
      {children}
    </MotionCard>
  );
};

export default AnimatedCard;
