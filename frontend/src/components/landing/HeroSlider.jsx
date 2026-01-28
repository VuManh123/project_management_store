import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { RocketOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import './HeroSlider.css';

const HeroSlider = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: t('landing.hero.slide1.title'),
      subtitle: t('landing.hero.slide1.subtitle'),
      image: '/slide1.jpg',
    },
    {
      id: 2,
      title: t('landing.hero.slide2.title'),
      subtitle: t('landing.hero.slide2.subtitle'),
      image: '/slide2.jpg',
    },
    {
      id: 3,
      title: t('landing.hero.slide3.title'),
      subtitle: t('landing.hero.slide3.subtitle'),
      image: '/slide3.jpg',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="hero-slider">
      <AnimatePresence initial={false}>
        {slides.map((slide, index) => {
          if (index !== currentSlide) return null;

          return (
            <motion.div
              key={slide.id}
              className="hero-slide"
              initial={{ opacity: 0, x: 100, scale: 1.05 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.95 }}
              transition={{ 
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],
                opacity: { duration: 0.6 }
              }}
              style={{
                '--bg-image': `url(${slide.image})`,
              }}
            >
              <div className="hero-slide-overlay"></div>
              <div className="hero-slide-content">
                <motion.h1
                  className="hero-slide-title"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.3,
                    duration: 0.6,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  className="hero-slide-subtitle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.4,
                    duration: 0.6,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  {slide.subtitle}
                </motion.p>
                <motion.div
                  className="hero-slide-cta"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.5,
                    duration: 0.6,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <Button
                    type="primary"
                    size="large"
                    icon={<RocketOutlined />}
                    onClick={() => navigate('/register')}
                    className="hero-slide-button-primary"
                  >
                    {t('landing.hero.ctaRegister')}
                  </Button>
                  <Button
                    size="large"
                    onClick={() => navigate('/login')}
                    className="hero-slide-button-secondary"
                  >
                    {t('landing.hero.ctaLogin')}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button className="hero-slider-nav hero-slider-prev" onClick={goToPrevious}>
        <LeftOutlined />
      </button>
      <button className="hero-slider-nav hero-slider-next" onClick={goToNext}>
        <RightOutlined />
      </button>

      {/* Dots Indicator */}
      <div className="hero-slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-slider-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;

