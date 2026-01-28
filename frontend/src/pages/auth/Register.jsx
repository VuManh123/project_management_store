import { useState } from 'react';
import { motion } from 'framer-motion';
import { Form, Input, Button, Divider, App } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthLayout from '../../layouts/AuthLayout';
import useAuthStore from '../../store/authStore';
import './Auth.css';

const Register = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const { message } = App.useApp();
  const { t } = useTranslation();

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error(t('auth.passwordsDoNotMatch'));
      return;
    }

    setLoading(true);
    const { confirmPassword, ...registerData } = values;
    const result = await register(registerData);
    setLoading(false);

    if (result.success) {
      message.success(t('auth.registrationSuccessful'));
      navigate('/dashboard');
    } else {
      message.error(result.error || t('auth.registrationFailed'));
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
          {t('auth.createAccount')}
        </motion.h2>
        <motion.p variants={itemVariants} className="auth-subtitle">
          {t('auth.signUpToGetStarted')}
        </motion.p>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          autoComplete="off"
        >
          <motion.div variants={itemVariants}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: t('auth.pleaseInputName') }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={t('common.fullName')}
                className="auth-input"
              />
            </Form.Item>
          </motion.div>

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
              rules={[
                { required: true, message: t('auth.pleaseInputPassword') },
                { min: 6, message: t('auth.passwordMinLength') },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t('common.password')}
                className="auth-input"
              />
            </Form.Item>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: t('auth.pleaseConfirmPassword') },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t('auth.passwordsDoNotMatch')));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t('common.confirmPassword')}
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
                {t('common.signUp')}
              </Button>
            </Form.Item>
          </motion.div>
        </Form>

        <motion.div variants={itemVariants}>
          <Divider>{t('common.or')}</Divider>
          <div className="auth-footer">
            <span>{t('common.alreadyHaveAccount')}</span>
            <Link to="/login" className="auth-link">
              {t('common.signIn')}
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
};

export default Register;
