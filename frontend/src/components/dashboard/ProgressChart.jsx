import { motion } from 'framer-motion';
import { Card, Progress } from 'antd';
import './ProgressChart.css';

const ProgressChart = ({ title, data = [] }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <Card title={title} className="progress-chart-card">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="progress-chart-container"
      >
        {data.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="progress-item"
          >
            <div className="progress-item-header">
              <span className="progress-item-label">{item.label}</span>
              <span className="progress-item-value">{item.value}%</span>
            </div>
            <Progress
              percent={item.value}
              strokeColor={item.color}
              showInfo={false}
              className="progress-bar"
            />
          </motion.div>
        ))}
      </motion.div>
    </Card>
  );
};

export default ProgressChart;
