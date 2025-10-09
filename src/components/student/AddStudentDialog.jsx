import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Alert,
    CircularProgress,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';
import { studentService } from '../../services/studentService';

export default function AddStudentDialog({ open, onClose, onStudentAdded }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleClose = () => {
        if (!loading) {
            setFirstName('');
            setLastName('');
            setBirthDate('');
            setError(null);
            setSuccess(null);
            onClose();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            setLoading(true);

            const response = await studentService.createStudent(
                firstName,
                lastName,
                birthDate
            );

            setSuccess('Student added successfully!');

            setTimeout(() => {
                onStudentAdded?.(response);
                handleClose();
            }, 1500);

        } catch (err) {
            console.error('Failed to add student:', err);
            setError(err.message || 'Failed to add student. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 100);
    const minDateStr = minDate.toISOString().split('T')[0];

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                },
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Add New Student
                <IconButton
                    onClick={handleClose}
                    disabled={loading}
                    size="small"
                    sx={{ color: 'text.secondary' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent>
                    <AnimatePresence mode="wait">
                        {(error || success) && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <Alert
                                    severity={error ? 'error' : 'success'}
                                    sx={{ mb: 2 }}
                                    onClose={() => {
                                        setError(null);
                                        setSuccess(null);
                                    }}
                                >
                                    {error || success}
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <TextField
                        autoFocus
                        required
                        fullWidth
                        margin="normal"
                        id="firstName"
                        label="First Name"
                        name="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={loading || !!success}
                        inputProps={{ maxLength: 50 }}
                    />

                    <TextField
                        required
                        fullWidth
                        margin="normal"
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={loading || !!success}
                        inputProps={{ maxLength: 50 }}
                    />

                    <TextField
                        required
                        fullWidth
                        margin="normal"
                        id="birthDate"
                        label="Birth Date"
                        name="birthDate"
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        disabled={loading || !!success}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            max: today,
                            min: minDateStr,
                        }}
                    />
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={handleClose}
                        disabled={loading || !!success}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || !!success}
                        sx={{
                            textTransform: 'none',
                            bgcolor: 'black',
                            '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.85)',
                            },
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Add Student'
                        )}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}