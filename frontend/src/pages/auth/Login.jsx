import { useState } from 'react';
import { motion } from 'framer-motion';
import { Form, Input, Button, Divider, App } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthLayout from '../../layouts/AuthLayout';
import useAuthStore from '../../store/authStore';
import './Auth.css';

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { message } = App.useApp();
  const { t } = useTranslation();

  const onFinish = async (values) => {
    setLoading(true);
    const result = await login(values);
    setLoading(false);

    if (result.success) {
      message.success(t('auth.loginSuccessful'));
      navigate('/dashboard');
    } else {
      message.error(result.error || t('auth.loginFailed'));
    }
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AuthLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 variants={itemVariants} className="auth-title">
          {t('common.welcomeBack')}
        </motion.h2>
        <motion.p variants={itemVariants} className="auth-subtitle">
          {t('common.signInToContinue')}
        </motion.p>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          autoComplete="off"
        >
          <motion.div variants={itemVariants}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: t('auth.pleaseInputEmail') },
                { type: 'email', message: t('auth.pleaseInputValidEmail') },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder={t('common.email')}
                className="auth-input"
              />
            </Form.Item>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Form.Item
              name="password"
              rules={[{ required: true, message: t('auth.pleaseInputPassword') }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t('common.password')}
                className="auth-input"
              />
            </Form.Item>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="auth-button"
              >
                {t('common.signIn')}
              </Button>
            </Form.Item>
          </motion.div>
        </Form>

        <motion.div variants={itemVariants}>
          <Divider>{t('common.or')}</Divider>
          <div className="auth-footer">
            <span>{t('common.dontHaveAccount')}</span>
            <Link to="/register" className="auth-link">
              {t('common.signUp')}
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
};

export default Login;
