import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Row, Col, Card } from 'antd';
import {
  TeamOutlined,
  RocketOutlined,
  TrophyOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import './AboutSection.css';

const AboutSection = () => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: <TeamOutlined />,
      value: t('landing.about.stats.users'),
      label: t('landing.about.stats.usersLabel'),
    },
    {
      icon: <RocketOutlined />,
      value: t('landing.about.stats.projects'),
      label: t('landing.about.stats.projectsLabel'),
    },
    {
      icon: <TrophyOutlined />,
      value: t('landing.about.stats.companies'),
      label: t('landing.about.stats.companiesLabel'),
    },
    {
      icon: <GlobalOutlined />,
      value: t('landing.about.stats.countries'),
      label: t('landing.about.stats.countriesLabel'),
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
      className="about-section"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="about-container">
        <motion.div className="about-header" variants={itemVariants}>
          <h2 className="about-title">{t('landing.about.title')}</h2>
          <p className="about-subtitle">{t('landing.about.subtitle')}</p>
        </motion.div>

        <motion.div className="about-content" variants={itemVariants}>
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={12}>
              <div className="about-text">
                <h3 className="about-text-title">{t('landing.about.mission.title')}</h3>
                <p className="about-text-content">{t('landing.about.mission.content')}</p>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="about-text">
                <h3 className="about-text-title">{t('landing.about.vision.title')}</h3>
                <p className="about-text-content">{t('landing.about.vision.content')}</p>
              </div>
            </Col>
          </Row>
        </motion.div>

        <motion.div className="about-stats" variants={itemVariants}>
          <Row gutter={[24, 24]}>
            {stats.map((stat, index) => (
              <Col xs={12} sm={6} key={index}>
                <Card className="stat-card">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </Card>
              </Col>
            ))}
          </Row>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutSection;

