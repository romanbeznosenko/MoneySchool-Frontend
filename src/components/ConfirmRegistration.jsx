import { useState, useEffect, useRef } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    Link,
    CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate, useLocation } from 'react-router-dom';
import { useActivation } from '../hooks/useActivation';

const inputVariants = {
    focus: { scale: 1.02 },
    blur: { scale: 1 },
};

export default function ConfirmRegistration() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const [code, setCode] = useState(['', '', '', '']);
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const {
        handleActivation,
        handleResendCode,
        loading,
        error,
        success,
        resendLoading,
        resendError,
        resendSuccess,
        clearMessages,
    } = useActivation();

    useEffect(() => {
        if (!email && !success) {
            navigate('/register');
        }
    }, [email, success, navigate]);

    useEffect(() => {
        if (error || success || resendError || resendSuccess) {
            const timer = setTimeout(() => {
                clearMessages();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, success, resendError, resendSuccess, clearMessages]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate('/login');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    useEffect(() => {
        inputRefs[0].current?.focus();
    }, []);

    const handleCodeChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);

        if (value && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 4);

        if (!/^\d+$/.test(pastedData)) return;

        const newCode = [...code];
        for (let i = 0; i < pastedData.length && i < 4; i++) {
            newCode[i] = pastedData[i];
        }
        setCode(newCode);

        const nextIndex = Math.min(pastedData.length, 3);
        inputRefs[nextIndex].current?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fullCode = code.join('');
        if (fullCode.length !== 4) {
            return;
        }

        try {
            await handleActivation(email, fullCode);
        } catch (err) {
            console.error('Activation failed:', err);
        }
    };

    const handleResend = async () => {
        try {
            await handleResendCode(email);
        } catch (err) {
            console.error('Resend failed:', err);
        }
    };

    const isCodeComplete = code.every((digit) => digit !== '');

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
                        Confirm Your Account
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        We've sent a 4-digit code to {email}
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    {(error || success || resendError || resendSuccess) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Alert
                                severity={error || resendError ? 'error' : 'success'}
                                icon={
                                    error || resendError ? (
                                        <ErrorOutlineIcon />
                                    ) : (
                                        <CheckCircleOutlineIcon />
                                    )
                                }
                                sx={{ mb: 3 }}
                            >
                                {error || success || resendError || resendSuccess}
                            </Alert>
                        </motion.div>
                    )}

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'center',
                            mb: 4,
                        }}
                    >
                        {code.map((digit, index) => (
                            <motion.div
                                key={index}
                                variants={inputVariants}
                                whileFocus="focus"
                            >
                                <TextField
                                    inputRef={inputRefs[index]}
                                    value={digit}
                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    disabled={loading || !!success}
                                    inputProps={{
                                        maxLength: 1,
                                        style: {
                                            textAlign: 'center',
                                            fontSize: '2rem',
                                            fontWeight: 'bold',
                                        },
                                    }}
                                    sx={{
                                        width: '4rem',
                                        '& input': {
                                            padding: '1rem',
                                        },
                                    }}
                                />
                            </motion.div>
                        ))}
                    </Box>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={!isCodeComplete || loading || !!success}
                            sx={{ mb: 2, py: 1.5 }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Activate Account'
                            )}
                        </Button>
                    </motion.div>

                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Didn't receive the code?
                        </Typography>
                        <Button
                            variant="text"
                            onClick={handleResend}
                            disabled={resendLoading || loading || !!success}
                            sx={{ fontWeight: 600 }}
                        >
                            {resendLoading ? (
                                <CircularProgress size={20} />
                            ) : (
                                'Resend Code'
                            )}
                        </Button>
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Link
                            component="button"
                            type="button"
                            variant="body2"
                            onClick={() => navigate('/register')}
                            disabled={loading || !!success}
                            sx={{ fontWeight: 600, cursor: 'pointer' }}
                        >
                            Back to Registration
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </motion.div>
    );
}
