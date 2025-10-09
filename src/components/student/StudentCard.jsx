import { Paper, Avatar, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export default function StudentCard({ student, getInitials = null, onClick }) {
    const initials = getInitials ? getInitials(student.name) : student.name.charAt(0).toUpperCase();

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
        >
            <Paper
                elevation={0}
                onClick={onClick}
                sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.02)',
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            src={student.avatar || ''}
                            alt={student.name}
                            sx={{ width: 48, height: 48 }}
                        >
                            {initials}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                variant="body1"
                                fontWeight={500}
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {student.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Age: {student.age}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </motion.div>
    );
}

export function getInitialsFromName(name) {
    if (!name) return '';

    const nameParts = name.trim().split(' ');

    if (nameParts.length === 1) {
        return nameParts[0].charAt(0).toUpperCase();
    }

    return (
        nameParts[0].charAt(0).toUpperCase() +
        nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
}