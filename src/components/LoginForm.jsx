import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    FormControlLabel,
    Checkbox,
    Alert,
    Link,
    Divider,
    CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { useLogin } from '../hooks/useLogin';

const inputVariants = {
    focus: { scale: 1.02 },
    blur: { scale: 1 },
};

export default function LoginForm({ onSuccess, onNavigateToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [staySignedIn, setStaySignedIn] = useState(false);
    const [localError, setLocalError] = useState(null);

    const { handleLogin, loading, error: apiError, success, clearMessages } = useLogin();
    const error = apiError || localError;

    // Auto-clear messages after a short delay
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                clearMessages();
                setLocalError(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null);

        if (!email) {
            setLocalError('Email is required');
            return;
        }

        if (!password) {
            setLocalError('Password is required');
            return;
        }

        try {
            await handleLogin(email, password, () => {
                if (staySignedIn) {
                    localStorage.setItem('staySignedIn', 'true');
                } else {
                    localStorage.removeItem('staySignedIn');
                }
                onSuccess?.();
            });
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    const handleDemoLogin = async () => {
        const demoEmail = 'demo@example.com';
        const demoPassword = 'password';
        setEmail(demoEmail);
        setPassword(demoPassword);
        setLocalError(null);

        try {
            await handleLogin(demoEmail, demoPassword, () => {
                onSuccess?.();
            });
        } catch (err) {
            console.error('Demo login failed:', err);
        }
    };

    const handleFillDemoEmail = () => {
        setEmail('demo@example.com');
        setTimeout(() => {
            document.getElementById('password')?.focus();
        }, 100);
    };

    const handleFillDemoPassword = () => {
        setPassword('password');
    };

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Paper
                elevation={24}
                sx={{
                    width: '100%',
                    maxWidth: 600,
                    p: 5,
                    borderRadius: '0.625rem',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                }}
            >
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Welcome back
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Sign in to your account to continue
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    {(error || success) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Alert
                                severity={error ? 'error' : 'success'}
                                icon={error ? <ErrorOutlineIcon /> : undefined}
                                sx={{ mb: 3 }}
                            >
                                {error || success}
                            </Alert>
                        </motion.div>
                    )}

                    <motion.div variants={inputVariants} whileFocus="focus">
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            sx={{ mb: 2 }}
                        />
                    </motion.div>

                    <motion.div variants={inputVariants} whileFocus="focus">
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            sx={{ mb: 2 }}
                        />
                    </motion.div>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={staySignedIn}
                                onChange={(e) => setStaySignedIn(e.target.checked)}
                                disabled={loading}
                                color="primary"
                            />
                        }
                        label="Stay signed in"
                        sx={{ mb: 3 }}
                    />

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ mb: 2, py: 1.5 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign in'}
                        </Button>
                    </motion.div>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Don't have an account?{' '}
                            <Link
                                component="button"
                                type="button"
                                variant="body2"
                                onClick={onNavigateToRegister}
                                disabled={loading}
                                sx={{ fontWeight: 600, cursor: 'pointer' }}
                            >
                                Register here
                            </Link>
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        bgcolor: '#f3f3f5',
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        borderRadius: '0.625rem',
                    }}
                >
                    <Typography variant="body2" fontWeight={500} color="#030213" gutterBottom>
                        Demo credentials:
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="#717182">
                                Email: demo@example.com
                            </Typography>
                            <Button
                                size="small"
                                onClick={handleFillDemoEmail}
                                disabled={loading}
                                sx={{ minWidth: 'auto', p: 0.5, fontSize: '0.75rem' }}
                            >
                                Fill
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="#717182">
                                Password: password
                            </Typography>
                            <Button
                                size="small"
                                onClick={handleFillDemoPassword}
                                disabled={loading}
                                sx={{ minWidth: 'auto', p: 0.5, fontSize: '0.75rem' }}
                            >
                                Fill
                            </Button>
                        </Box>
                    </Box>

                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleDemoLogin}
                        disabled={loading}
                        sx={{ mt: 1 }}
                    >
                        Login with Demo Account
                    </Button>
                </Paper>
            </Paper>
        </motion.div>
    );
}
