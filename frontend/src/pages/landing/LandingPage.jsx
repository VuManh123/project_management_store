import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroSlider from '../../components/landing/HeroSlider';
import FeaturesSection from '../../components/landing/FeaturesSection';
import BenefitsSection from '../../components/landing/BenefitsSection';
import AboutSection from '../../components/landing/AboutSection';
import TestimonialsSection from '../../components/landing/TestimonialsSection';
import CTASection from '../../components/landing/CTASection';
import Footer from '../../components/landing/Footer';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';
import useLanguageStore from '../../store/languageStore';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { initLanguage } = useLanguageStore();

  useEffect(() => {
    initLanguage();
  }, [initLanguage]);

  return (
    <div className="landing-page">
      <motion.header
        className="landing-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-container">
          <div className="header-logo">
            <img src="/logo-mco.png" alt="MC One" className="logo-image" />
            <h1>MC One</h1>
          </div>
          <div className="header-actions">
            <LanguageSwitcher className="header-language-switcher" />
            <Button
              type="text"
              onClick={() => navigate('/login')}
              className="header-login-button"
            >
              {t('common.login')}
            </Button>
            <Button
              type="primary"
              onClick={() => navigate('/register')}
              className="header-register-button"
            >
              {t('common.register')}
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="landing-main">
        <HeroSlider />
        <FeaturesSection />
        <BenefitsSection />
        <AboutSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;

