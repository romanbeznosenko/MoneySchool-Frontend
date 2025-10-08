import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import { authService } from './services/authService';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Animated Page Wrapper Component
function AnimatedPage({ children }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Main App Content Component
function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize CSRF token
        // await authService.initializeCsrf();

        // Check if user is already logged in
        const storedUser = sessionStorage.getItem('user');
        const staySignedIn = sessionStorage.getItem('staySignedIn');

        if (storedUser && staySignedIn === 'true') {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleLoginSuccess = (responseDto) => {
    setIsAuthenticated(true);
    // Store user in sessionStorage
    if (responseDto.user) {
      sessionStorage.setItem('user', JSON.stringify(responseDto.user));
    }
    navigate('/dashboard');
  };

  const handleRegisterSuccess = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('staySignedIn');
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Loading...
        </motion.div>
      </Box>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
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
              <AnimatedPage>
                <LoginForm
                  onSuccess={handleLoginSuccess}
                  onNavigateToRegister={() => navigate('/register')}
                />
              </AnimatedPage>
            </Box>
          )
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
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
              <AnimatedPage>
                <RegisterForm
                  onSuccess={handleRegisterSuccess}
                  onNavigateToLogin={() => navigate('/login')}
                />
              </AnimatedPage>
            </Box>
          )
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Dashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Default Route */}
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />

      {/* 404 - Redirect to home */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

// Main App Component with Router
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;