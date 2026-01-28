import { motion } from 'framer-motion';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { RocketOutlined } from '@ant-design/icons';
import './HeroSection.css';

const HeroSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.section
      className="hero-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="hero-container">
        <motion.div className="hero-content" variants={itemVariants}>
          <motion.h1 className="hero-title" variants={itemVariants}>
            {t('landing.hero.title')}
          </motion.h1>
          <motion.p className="hero-subtitle" variants={itemVariants}>
            {t('landing.hero.subtitle')}
          </motion.p>
          <motion.div className="hero-cta" variants={itemVariants}>
            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              onClick={() => navigate('/register')}
              className="hero-button-primary"
            >
              {t('landing.hero.ctaRegister')}
            </Button>
            <Button
              size="large"
              onClick={() => navigate('/login')}
              className="hero-button-secondary"
            >
              {t('landing.hero.ctaLogin')}
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          className="hero-visual"
          variants={itemVariants}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="hero-gradient-orb"></div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;

