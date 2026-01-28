import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import './AuthLayout.css';

const AuthLayout = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="auth-layout">
      {/* Animated Background */}
      <div className="auth-background">
        <motion.div
          className="gradient-orb orb-1"
          animate={{
            x: mousePosition.x * 0.1,
            y: mousePosition.y * 0.1,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="gradient-orb orb-2"
          animate={{
            x: mousePosition.x * -0.15,
            y: mousePosition.y * -0.15,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="gradient-orb orb-3"
          animate={{
            x: mousePosition.x * 0.2,
            y: mousePosition.y * 0.2,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="auth-content"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Logo/Branding */}
        <motion.div
          className="auth-branding"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="auth-logo-container">
            <img src="/logo-mco.png" alt="MC One" className="auth-logo-image" />
            <h1 className="auth-logo">MC One</h1>
          </div>
          <p className="auth-tagline">Manage your projects with ease</p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          className="auth-form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
