import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    Link,
    Divider,
    CircularProgress,
    LinearProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';

const inputVariants = {
    focus: { scale: 1.02 },
    blur: { scale: 1 },
};

export default function RegisterForm({ onSuccess }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState(null);

    const { handleRegister, loading, error: apiError, success, clearMessages } = useRegister();
    const error = apiError || localError;

    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                clearMessages();
                setLocalError(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, success, clearMessages]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                onSuccess?.();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success, onSuccess]);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const calculatePasswordStrength = (password) => {
        if (!password) {
            return { score: 0, label: '', color: 'transparent' };
        }

        let score = 0;

        if (password.length >= 8) score++;
        if (password.length >= 12) score++;

        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        const normalizedScore = Math.min((score / 6) * 100, 100);

        if (score <= 2) {
            return { score: normalizedScore, label: 'Weak', color: '#f44336' };
        } else if (score <= 4) {
            return { score: normalizedScore, label: 'Fair', color: '#ff9800' };
        } else {
            return { score: normalizedScore, label: 'Strong', color: '#4caf50' };
        }
    };

    const passwordStrength = calculatePasswordStrength(password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null);

        if (!validateEmail(email)) {
            setLocalError('Please enter a valid email address');
            return;
        }

        if (password.length < 8) {
            setLocalError('Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        try {
            await handleRegister(email, password, confirmPassword);
        } catch (err) {
            console.error('Registration failed:', err);
        }
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
                        Create an account
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
                                icon={error ? <ErrorOutlineIcon /> : <CheckCircleOutlineIcon />}
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
                            disabled={loading || !!success}
                            inputProps={{ maxLength: 128 }}
                            sx={{ mb: 1 }}
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
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading || !!success}
                            sx={{ mb: 1 }}
                        />

                        {password && (
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Password strength:
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: passwordStrength.color,
                                            fontWeight: 500,
                                        }}
                                    >
                                        {passwordStrength.label}
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={passwordStrength.score}
                                    sx={{
                                        height: 8,
                                        borderRadius: 1,
                                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: passwordStrength.color,
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                            </Box>
                        )}
                    </motion.div>

                    <motion.div variants={inputVariants} whileFocus="focus">
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading || !!success}
                            inputProps={{ maxLength: 72 }}
                            sx={{ mb: 2 }}
                        />
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading || !!success}
                            sx={{ mb: 2, py: 1.5 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                        </Button>
                    </motion.div>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Already have an account?{' '}
                            <Link
                                component="button"
                                type="button"
                                variant="body2"
                                onClick={() => navigate('/login')}
                                disabled={loading || !!success}
                                sx={{ fontWeight: 600, cursor: 'pointer' }}
                            >
                                Sign in here
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </motion.div>
    );
}