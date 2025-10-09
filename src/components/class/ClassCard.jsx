import { Paper, Box, Typography, Chip } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import { motion } from 'framer-motion';

export default function ClassCard({ classItem, onClick }) {
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
                <Box sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                <Typography
                                    variant="body1"
                                    fontWeight={500}
                                    sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {classItem.name}
                                </Typography>
                                {classItem.isTreasurer && (
                                    <Chip
                                        label="Treasurer"
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(0, 0, 0, 0.08)',
                                            fontWeight: 500,
                                            flexShrink: 0,
                                        }}
                                    />
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <GroupIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {classItem.memberCount} members
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </motion.div>
    );
}