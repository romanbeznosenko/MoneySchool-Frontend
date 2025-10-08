import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import { getCsrfToken } from './services/api/authApi';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('/login');

  // useEffect(() => {
  //   getCsrfToken().catch(err => console.error('Failed to fetch CSRF:', err));
  // }, []);

  const navigate = (path) => {
    setCurrentRoute(path);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleRegisterSuccess = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  if (isAuthenticated && currentRoute === '/dashboard') {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <AnimatePresence mode="wait">
        {currentRoute === '/login' && (
          <motion.div
            key="login"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <LoginForm
              onSuccess={handleLoginSuccess}
              onNavigateToRegister={() => navigate('/login')}
            />
          </motion.div>
        )}

        {currentRoute === '/register' && (
          <motion.div
            key="register"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <RegisterForm
              onSuccess={handleRegisterSuccess}
              onNavigateToLogin={() => navigate('/login')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default App;