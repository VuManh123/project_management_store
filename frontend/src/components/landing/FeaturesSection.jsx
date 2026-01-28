import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col } from 'antd';
import {
  ProjectOutlined,
  CheckSquareOutlined,
  TeamOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import './FeaturesSection.css';

const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      key: 'projectManagement',
      icon: <ProjectOutlined />,
    },
    {
      key: 'taskTracking',
      icon: <CheckSquareOutlined />,
    },
    {
      key: 'teamCollaboration',
      icon: <TeamOutlined />,
    },
    {
      key: 'realtimeChat',
      icon: <MessageOutlined />,
    },
  ];

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.section
      className="features-section"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="features-container">
        <motion.div className="features-header" variants={itemVariants}>
          <h2 className="features-title">{t('landing.features.title')}</h2>
          <p className="features-subtitle">{t('landing.features.subtitle')}</p>
        </motion.div>

        <Row gutter={[24, 24]} style={{ display: 'flex' }}>
          {features.map((feature) => (
            <Col xs={24} sm={12} lg={6} key={feature.key} style={{ display: 'flex' }}>
              <motion.div variants={itemVariants} style={{ width: '100%', display: 'flex' }}>
                <Card className="feature-card" hoverable style={{ width: '100%' }}>
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">
                    {t(`landing.features.items.${feature.key}.title`)}
                  </h3>
                  <p className="feature-description">
                    {t(`landing.features.items.${feature.key}.description`)}
                  </p>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </motion.section>
  );
};

export default FeaturesSection;

