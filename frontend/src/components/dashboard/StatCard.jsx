import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Card } from 'antd';
import './StatCard.css';

const StatCard = ({ title, value, icon, color = '#1E40AF', suffix = '', prefix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView && value !== undefined) {
      const controls = animate(0, value, {
        duration: 1.5,
        ease: 'easeOut',
        onUpdate: (latest) => {
          setDisplayValue(Math.round(latest));
        },
      });
      return controls.stop;
    }
  }, [isInView, value]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: 0.2,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Card className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
        <div className="stat-card-content">
          <div className="stat-card-info">
            <h3 className="stat-card-title">{title}</h3>
            <motion.div
              className="stat-card-value"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.3 }}
            >
              {prefix}
              {displayValue}
              {suffix}
            </motion.div>
          </div>
          <motion.div
            className="stat-card-icon"
            variants={iconVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            style={{ color }}
          >
            {icon}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;
