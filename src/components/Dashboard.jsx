import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Grid,
    AppBar,
    Toolbar,
    Card,
    CardContent,
    Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
        },
    }),
};

export default function Dashboard({ onLogout }) {
    const cards = [
        {
            title: 'Profile',
            description: 'Manage your account settings and preferences',
            icon: PersonIcon,
            color: '#1976d2',
            bgColor: '#e3f2fd',
        },
        {
            title: 'Analytics',
            description: 'View your activity and statistics',
            icon: BarChartIcon,
            color: '#2e7d32',
            bgColor: '#e8f5e9',
        },
        {
            title: 'Settings',
            description: 'Configure your application preferences',
            icon: SettingsIcon,
            color: '#7b1fa2',
            bgColor: '#f3e5f5',
        },
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="static" elevation={0}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div">
                            Dashboard
                        </Typography>
                        <Typography variant="caption" color="inherit" sx={{ opacity: 0.8 }}>
                            Welcome back!
                        </Typography>
                    </Box>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            color="inherit"
                            onClick={onLogout}
                            startIcon={<LogoutIcon />}
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                                },
                            }}
                        >
                            Logout
                        </Button>
                    </motion.div>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    {cards.map((card, index) => (
                        <Grid item xs={12} md={4} key={card.title}>
                            <motion.div
                                custom={index}
                                initial="hidden"
                                animate="visible"
                                variants={cardVariants}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            >
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="h6" component="h3">
                                                {card.title}
                                            </Typography>
                                            <Avatar sx={{ bgcolor: card.bgColor }}>
                                                <card.icon sx={{ color: card.color }} />
                                            </Avatar>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {card.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <Paper
                        elevation={2}
                        sx={{
                            mt: 4,
                            p: 4,
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
                            Welcome to your Dashboard!
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            You have successfully logged in to your account.
                        </Typography>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                bgcolor: 'info.50',
                                borderColor: 'info.200',
                            }}
                        >
                            <Typography variant="body2" color="info.dark">
                                <strong>Tip:</strong> This is a demo dashboard. In a real application, you would see your personalized content here.
                            </Typography>
                        </Paper>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
}