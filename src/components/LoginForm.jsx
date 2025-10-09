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
    CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';

import { useLogin } from '../hooks/useLogin';
import { userService } from '../services/userService';

const inputVariants = {
    focus: { scale: 1.02 },
    blur: { scale: 1 },
};

export default function LoginForm({ onSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [staySignedIn, setStaySignedIn] = useState(false);
    const [localError, setLocalError] = useState(null);
    const navigate = useNavigate();

    const { handleLogin, loading, error: apiError, success, clearMessages } = useLogin();
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
            const loginResponse = await handleLogin(email, password, staySignedIn);
            console.log('Login response:', loginResponse);

            const userData = await userService.getUser();
            console.log('User data fetched:', userData);

            sessionStorage.setItem('user', JSON.stringify(userData));

            if (staySignedIn) {
                sessionStorage.setItem('staySignedIn', 'true');
            } else {
                sessionStorage.removeItem('staySignedIn');
            }

            console.log('Stored in sessionStorage:', sessionStorage.getItem('user'));

            onSuccess?.({ user: userData });

        } catch (err) {
            console.error('Login failed:', err);
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
                        Welcome back
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
                                onClick={() => navigate("/register")}
                                disabled={loading}
                                sx={{ fontWeight: 600, cursor: 'pointer' }}
                            >
                                Register here
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </motion.div>
    );
}