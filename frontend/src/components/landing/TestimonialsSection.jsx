import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Avatar, Rate } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      id: 1,
      company: t('landing.testimonials.item1.company'),
      name: t('landing.testimonials.item1.name'),
      role: t('landing.testimonials.item1.role'),
      content: t('landing.testimonials.item1.content'),
      rating: 5,
    },
    {
      id: 2,
      company: t('landing.testimonials.item2.company'),
      name: t('landing.testimonials.item2.name'),
      role: t('landing.testimonials.item2.role'),
      content: t('landing.testimonials.item2.content'),
      rating: 5,
    },
    {
      id: 3,
      company: t('landing.testimonials.item3.company'),
      name: t('landing.testimonials.item3.name'),
      role: t('landing.testimonials.item3.role'),
      content: t('landing.testimonials.item3.content'),
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
      className="testimonials-section"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="testimonials-container">
        <motion.div className="testimonials-header" variants={itemVariants}>
          <h2 className="testimonials-title">{t('landing.testimonials.title')}</h2>
          <p className="testimonials-subtitle">{t('landing.testimonials.subtitle')}</p>
        </motion.div>

        <Row gutter={[24, 24]} style={{ display: 'flex' }}>
          {testimonials.map((testimonial) => (
            <Col xs={24} md={8} key={testimonial.id} style={{ display: 'flex' }}>
              <motion.div variants={itemVariants} style={{ width: '100%', display: 'flex' }}>
                <Card className="testimonial-card" hoverable style={{ width: '100%' }}>
                  <div className="testimonial-rating">
                    <Rate disabled defaultValue={testimonial.rating} />
                  </div>
                  <p className="testimonial-content">"{testimonial.content}"</p>
                  <div className="testimonial-author">
                    <Avatar
                      size={48}
                      icon={<UserOutlined />}
                      className="testimonial-avatar"
                    />
                    <div className="testimonial-info">
                      <div className="testimonial-name">{testimonial.name}</div>
                      <div className="testimonial-role">{testimonial.role}</div>
                      <div className="testimonial-company">{testimonial.company}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;

