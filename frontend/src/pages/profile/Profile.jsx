import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Form, Input, Button, Card, Avatar, App } from 'antd';
import { UserOutlined, MailOutlined, CameraOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../store/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './Profile.css';

const Profile = () => {
  const [form] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { t } = useTranslation();
  const { message } = App.useApp();
  const user = useAuthStore((state) => state.user);
  const getProfile = useAuthStore((state) => state.getProfile);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name || '',
        email: user.email || '',
      });
      setAvatarPreview(user.avatar || null);
    }
  }, [user, form]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      message.warning(t('profile.avatarHint'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.warning(t('profile.avatarHint'));
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    let result;

    if (avatarFile) {
      const formData = new FormData();
      formData.append('name', values.name.trim());
      formData.append('email', values.email.trim());
      formData.append('avatar', avatarFile);
      result = await updateProfile(formData);
    } else {
      const payload = {};
      if (values.name !== user?.name) payload.name = values.name.trim();
      if (values.email !== user?.email) payload.email = values.email.trim();
      if (Object.keys(payload).length === 0) {
        message.warning(t('profile.noChanges'));
        setSubmitting(false);
        return;
      }
      result = await updateProfile(payload);
    }

    setSubmitting(false);

    if (result.success) {
      message.success(t('profile.updateSuccess'));
      setAvatarFile(null);
    } else {
      message.error(result.error || t('profile.updateFailed'));
    }
  };

  const displayAvatar = avatarPreview || (user?.avatar ? user.avatar : null);

  if (isLoading && !user) {
    return (
      <div className="profile-page">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <motion.h1
        className="profile-title"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {t('profile.title')}
      </motion.h1>
      <motion.p
        className="profile-subtitle"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        {t('profile.subtitle')}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-wrapper">
              <Avatar
                size={120}
                src={displayAvatar}
                icon={!displayAvatar && <UserOutlined />}
                className="profile-avatar"
              />
              <label className="profile-avatar-upload">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleAvatarChange}
                  className="profile-avatar-input"
                />
                <span className="profile-avatar-upload-btn">
                  <CameraOutlined /> {t('profile.uploadAvatar')}
                </span>
              </label>
            </div>
            <p className="profile-avatar-hint">{t('profile.avatarHint')}</p>
          </div>

          <Form
            form={form}
            name="profile"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            className="profile-form"
          >
            <Form.Item
              name="name"
              label={t('profile.name')}
              rules={[{ required: true, message: t('auth.pleaseInputName') }]}
            >
              <Input
                prefix={<UserOutlined className="profile-input-icon" />}
                placeholder={t('common.fullName')}
                className="profile-input"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={t('profile.email')}
              rules={[
                { required: true, message: t('auth.pleaseInputEmail') },
                { type: 'email', message: t('auth.pleaseInputValidEmail') },
              ]}
            >
              <Input
                prefix={<MailOutlined className="profile-input-icon" />}
                placeholder={t('common.email')}
                className="profile-input"
              />
            </Form.Item>

            <Form.Item className="profile-submit-item">
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                size="large"
                className="profile-submit-btn"
              >
                {t('profile.save')}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;
