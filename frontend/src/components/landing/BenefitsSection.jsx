import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'antd';
import {
  ThunderboltOutlined,
  EyeOutlined,
  RiseOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import './BenefitsSection.css';

const BenefitsSection = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      key: 'efficiency',
      icon: <ThunderboltOutlined />,
    },
    {
      key: 'visibility',
      icon: <EyeOutlined />,
    },
    {
      key: 'scalability',
      icon: <RiseOutlined />,
    },
    {
      key: 'support',
      icon: <CustomerServiceOutlined />,
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
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.section
      className="benefits-section"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="benefits-container">
        <motion.div className="benefits-header" variants={itemVariants}>
          <h2 className="benefits-title">{t('landing.benefits.title')}</h2>
          <p className="benefits-subtitle">{t('landing.benefits.subtitle')}</p>
        </motion.div>

        <Row gutter={[32, 32]}>
          {benefits.map((benefit) => (
            <Col xs={24} sm={12} lg={6} key={benefit.key}>
              <motion.div variants={itemVariants}>
                <div className="benefit-card">
                  <div className="benefit-icon">{benefit.icon}</div>
                  <h3 className="benefit-title">
                    {t(`landing.benefits.items.${benefit.key}.title`)}
                  </h3>
                  <p className="benefit-description">
                    {t(`landing.benefits.items.${benefit.key}.description`)}
                  </p>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </motion.section>
  );
};

export default BenefitsSection;

