import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'antd';
import LanguageSwitcher from '../common/LanguageSwitcher';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="landing-footer">
      <div className="footer-container">
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={6}>
            <h4 className="footer-title">{t('landing.footer.product')}</h4>
            <ul className="footer-links">
              <li>
                <a href="#features">{t('landing.footer.links.features')}</a>
              </li>
              <li>
                <a href="#pricing">{t('landing.footer.links.pricing')}</a>
              </li>
            </ul>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <h4 className="footer-title">{t('landing.footer.company')}</h4>
            <ul className="footer-links">
              <li>
                <a href="#about">{t('landing.footer.links.about')}</a>
              </li>
              <li>
                <a href="#contact">{t('landing.footer.links.contact')}</a>
              </li>
            </ul>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <h4 className="footer-title">{t('landing.footer.resources')}</h4>
            <ul className="footer-links">
              <li>
                <a href="#blog">{t('landing.footer.links.blog')}</a>
              </li>
              <li>
                <a href="#docs">{t('landing.footer.links.documentation')}</a>
              </li>
            </ul>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <h4 className="footer-title">{t('landing.footer.legal')}</h4>
            <ul className="footer-links">
              <li>
                <a href="#privacy">{t('landing.footer.links.privacy')}</a>
              </li>
              <li>
                <a href="#terms">{t('landing.footer.links.terms')}</a>
              </li>
            </ul>
          </Col>
        </Row>
        <div className="footer-bottom">
          <div className="footer-language">
            <LanguageSwitcher />
          </div>
          <p className="footer-copyright">{t('landing.footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

