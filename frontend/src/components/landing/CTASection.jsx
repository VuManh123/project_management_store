import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RocketOutlined } from '@ant-design/icons';
import './CTASection.css';

const CTASection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <motion.section
      className="cta-section"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="cta-container">
        <h2 className="cta-title">{t('landing.cta.title')}</h2>
        <p className="cta-subtitle">{t('landing.cta.subtitle')}</p>
        <Button
          type="primary"
          size="large"
          icon={<RocketOutlined />}
          onClick={() => navigate('/register')}
          className="cta-button"
        >
          {t('landing.cta.button')}
        </Button>
      </div>
    </motion.section>
  );
};

export default CTASection;

