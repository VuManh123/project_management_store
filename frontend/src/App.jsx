import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import { AnimatePresence } from 'framer-motion';
import enUS from 'antd/locale/en_US';
import viVN from 'antd/locale/vi_VN';
import { useTranslation } from 'react-i18next';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import LandingPage from './pages/landing/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import ProjectList from './pages/projects/ProjectList';
import ProjectCreate from './pages/projects/ProjectCreate';
import ProjectDetail from './pages/projects/ProjectDetail';
import TaskList from './pages/tasks/TaskList';
import TaskDetail from './pages/tasks/TaskDetail';
import TaskForm from './pages/tasks/TaskForm';
import SubmitReport from './pages/tasks/SubmitReport';
import ReviewTask from './pages/tasks/ReviewTask';
import Chat from './pages/chat/Chat';
import Profile from './pages/profile/Profile';
import NotFound from './pages/NotFound';
import useAuthStore from './store/authStore';
import useLanguageStore from './store/languageStore';
import { useAuth } from './hooks/useAuth';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Landing Route Component (show landing page if not authenticated, redirect if authenticated)
const LandingRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);
  const { language } = useLanguageStore();
  const { i18n } = useTranslation();
  const [antdLocale, setAntdLocale] = useState(enUS);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    // Update Ant Design locale based on i18n language
    setAntdLocale(i18n.language === 'vi' ? viVN : enUS);
  }, [i18n.language, language]);

  return (
    <ConfigProvider
      locale={antdLocale}
      theme={{
        token: {
          colorPrimary: '#1E40AF',
          borderRadius: 8,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
      }}
    >
      <AntdApp>
        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Landing Page - Public */}
              <Route
                path="/"
                element={
                  <LandingRoute>
                    <LandingPage />
                  </LandingRoute>
                }
              />

              {/* Public Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
              </Route>
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<ProjectList />} />
                <Route path="new" element={<ProjectCreate />} />
                <Route path=":id" element={<ProjectDetail />} />
                <Route path=":projectId/tasks" element={<TaskList />} />
                <Route path=":projectId/tasks/new" element={<TaskForm />} />
                <Route path=":projectId/tasks/:taskId" element={<TaskDetail />} />
                <Route path=":projectId/tasks/:taskId/edit" element={<TaskForm />} />
                <Route path=":projectId/tasks/:taskId/submit" element={<SubmitReport />} />
                <Route path=":projectId/tasks/:taskId/review" element={<ReviewTask />} />
              </Route>
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<TaskList />} />
              </Route>
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Chat />} />
              </Route>
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Profile />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </Router>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
