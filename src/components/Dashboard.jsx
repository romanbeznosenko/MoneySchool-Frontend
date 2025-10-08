import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Grid,
    AppBar,
    Toolbar,
    Avatar,
    Tabs,
    Tab,
    Chip,
    CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupIcon from '@mui/icons-material/Group';
import { userService } from '../services/userService';

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
    const [classesTab, setClassesTab] = useState(0);
    // ADD THESE THREE LINES:
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const userData = await userService.getUser();
                setUser(userData);
            } catch (err) {
                console.error('Failed to fetch user:', err);
                setError(err.message);

                // Fallback to sessionStorage if available
                const storedUser = sessionStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const students = [
        { id: 1, name: 'Emma Wilson', age: 12, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
        { id: 2, name: 'Liam Johnson', age: 13, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam' },
        { id: 3, name: 'Sophia Davis', age: 11, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia' },
    ];

    const classes = [
        { id: 1, name: 'Mathematics 101', members: 24, isTreasurer: true },
        { id: 2, name: 'Science Adventure', members: 18, isTreasurer: true },
        { id: 3, name: 'English Literature', members: 22, isTreasurer: false },
    ];

    const treasurerClasses = classes.filter(c => c.isTreasurer);

    // ADD LOADING STATE:
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // ADD ERROR STATE:
    if (error && !user) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
                <Typography color="error">Failed to load user data: {error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    bgcolor: 'white',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            color: 'text.primary',
                            fontWeight: 600,
                        }}
                    >
                        Dashboard
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={onLogout}
                        startIcon={<LogoutIcon />}
                        sx={{
                            color: 'text.primary',
                            border: '1px solid',
                            borderColor: 'divider',
                            textTransform: 'none',
                            px: 2,
                        }}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 2, md: 4 } }}>
                {/* Profile Card */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    custom={0}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                src={user?.avatar || ""}
                                sx={{ width: 80, height: 80 }}
                            >
                                {user?.name?.[0]?.toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography variant="h5" fontWeight={600} gutterBottom>
                                    {user.name}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {user.email}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </motion.div>

                <Grid container spacing={3}>
                    {/* Students Section */}
                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                            custom={1}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    height: '100%',
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            My Students
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Manage your students
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        sx={{
                                            bgcolor: 'black',
                                            textTransform: 'none',
                                            borderRadius: 2,
                                            px: 2.5,
                                            '&:hover': {
                                                bgcolor: 'rgba(0, 0, 0, 0.85)',
                                            },
                                        }}
                                    >
                                        Add Student
                                    </Button>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {students.map((student, index) => (
                                        <motion.div
                                            key={student.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 + index * 0.1 }}
                                        >
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2,
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
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar src={student.avatar} sx={{ width: 48, height: 48 }} />
                                                    <Box>
                                                        <Typography variant="body1" fontWeight={500}>
                                                            {student.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Age: {student.age}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </motion.div>
                                    ))}
                                </Box>
                            </Paper>
                        </motion.div>
                    </Grid>

                    {/* Classes Section */}
                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                            custom={2}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    height: '100%',
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            My Classes
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            View and manage your classes
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            sx={{
                                                bgcolor: 'black',
                                                textTransform: 'none',
                                                borderRadius: 2,
                                                px: 2.5,
                                                '&:hover': {
                                                    bgcolor: 'rgba(0, 0, 0, 0.85)',
                                                },
                                            }}
                                        >
                                            Create Class
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<PersonAddIcon />}
                                            sx={{
                                                textTransform: 'none',
                                                borderRadius: 2,
                                                px: 2.5,
                                                borderColor: 'divider',
                                                color: 'text.primary',
                                            }}
                                        >
                                            Join Class
                                        </Button>
                                    </Box>
                                </Box>

                                <Tabs
                                    value={classesTab}
                                    onChange={(e, newValue) => setClassesTab(newValue)}
                                    sx={{
                                        mb: 3,
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <Tab
                                        label="All Classes"
                                        sx={{ textTransform: 'none', fontWeight: 500 }}
                                    />
                                    <Tab
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <span>My Treasurer Classes</span>
                                                <Chip
                                                    label={treasurerClasses.length}
                                                    size="small"
                                                    sx={{
                                                        height: 20,
                                                        bgcolor: 'rgba(0, 0, 0, 0.08)',
                                                    }}
                                                />
                                            </Box>
                                        }
                                        sx={{ textTransform: 'none', fontWeight: 500 }}
                                    />
                                </Tabs>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {(classesTab === 0 ? classes : treasurerClasses).map((classItem, index) => (
                                        <motion.div
                                            key={classItem.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 + index * 0.1 }}
                                        >
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2.5,
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
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                                    <Typography variant="body1" fontWeight={500}>
                                                        {classItem.name}
                                                    </Typography>
                                                    {classItem.isTreasurer && (
                                                        <Chip
                                                            label="Treasurer"
                                                            size="small"
                                                            sx={{
                                                                bgcolor: 'rgba(0, 0, 0, 0.08)',
                                                                fontWeight: 500,
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <GroupIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {classItem.members} members
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        </motion.div>
                                    ))}
                                </Box>
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}