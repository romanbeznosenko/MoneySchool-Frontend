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
import { classService } from "../../services/classService";

export default function AddClassDialog({ open, onClose, onClassAdded }) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleClose = () => {
        if (!loading) {
            // Reset form
            setName('');
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

            // Call the service to create class
            const response = await classService.createClass(name);

            setSuccess('Class created successfully!');

            // Wait a moment to show success message
            setTimeout(() => {
                onClassAdded?.(response);
                handleClose();
            }, 1500);

        } catch (err) {
            console.error('Failed to create class:', err);
            setError(err.message || 'Failed to create class. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                Create New Class
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
                        id="name"
                        label="Class Name"
                        name="name"
                        placeholder="e.g., Mathematics 101"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading || !!success}
                        inputProps={{ maxLength: 100 }}
                        helperText="Enter a descriptive name for your class"
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
                        disabled={loading || !!success || !name.trim()}
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
                            'Create Class'
                        )}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}