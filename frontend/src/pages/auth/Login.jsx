import { useState } from 'react';
import { motion } from 'framer-motion';
import { Form, Input, Button, Divider, App } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import useAuthStore from '../../store/authStore';
import './Auth.css';

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { message } = App.useApp();

  const onFinish = async (values) => {
    setLoading(true);
    const result = await login(values);
    setLoading(false);

    if (result.success) {
      message.success('Login successful!');
      navigate('/dashboard');
    } else {
      message.error(result.error || 'Login failed');
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
          Welcome Back
        </motion.h2>
        <motion.p variants={itemVariants} className="auth-subtitle">
          Sign in to continue to your account
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
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                className="auth-input"
              />
            </Form.Item>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
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
                Sign In
              </Button>
            </Form.Item>
          </motion.div>
        </Form>

        <motion.div variants={itemVariants}>
          <Divider>or</Divider>
          <div className="auth-footer">
            <span>Don't have an account?</span>
            <Link to="/register" className="auth-link">
              Sign up
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
};

export default Login;
