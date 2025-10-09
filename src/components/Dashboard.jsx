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
import { studentService } from '../services/studentService';
import { classService } from "../services/classService"
import StudentCard, { getInitialsFromName } from './student/StudentCard';
import AddStudentDialog from './student/AddStudentDialog';
import StudentDetailsDialog from './student/StudentDetailsDialog';
import ClassCard from './class/ClassCard';
import AddClassDialog from './class/AddClassDialog';
import ClassDetailsDialog from "./class/ClassDetailsDialog"

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
    const [user, setUser] = useState(null);
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [studentsLoading, setStudentsLoading] = useState(true);
    const [classesLoading, setClassesLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false);
    const [addClassDialogOpen, setAddClassDialogOpen] = useState(false);

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentDetailsDialogOpen, setStudentDetailsDialogOpen] = useState(false);

    const [selectedClass, setSelectedClass] = useState(null);
    const [classDetailsDialogOpen, setClassDetailsDialogOpen] = useState(false);

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const userData = await userService.getUser();
                setUser(userData);
            } catch (err) {
                console.error('Failed to fetch user:', err);
                setError(err.message);

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

    // Fetch students data
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setStudentsLoading(true);
                const response = await studentService.getUserStudents(1, 10);
                setStudents(response.students);
            } catch (err) {
                console.error('Failed to fetch students:', err);
            } finally {
                setStudentsLoading(false);
            }
        };

        if (user) {
            fetchStudents();
        }
    }, [user]);

    // Fetch classes data - refetch when tab changes
    useEffect(() => {
        const fetchClasses = async () => {
            if (!user) return;

            try {
                setClassesLoading(true);
                // classesTab: 0 = All Classes (isTreasurer: false), 1 = My Treasurer Classes (isTreasurer: true)
                const isTreasurer = classesTab === 1;
                const response = await classService.getUserClasses(1, 10, isTreasurer);
                setClasses(response.classes);
            } catch (err) {
                console.error('Failed to fetch classes:', err);
            } finally {
                setClassesLoading(false);
            }
        };

        fetchClasses();
    }, [user, classesTab]);

    // Student handlers
    const handleStudentClick = (student) => {
        console.log('Student clicked:', student);
        setSelectedStudent({
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            birthDate: student.birthDate,
            avatar: student.avatar,
            parent: student.parent,
            classes: student.classes || [],
        });
        setStudentDetailsDialogOpen(true);
    };

    const handleStudentAdded = async () => {
        try {
            setStudentsLoading(true);
            const response = await studentService.getUserStudents(1, 10);
            setStudents(response.students);
        } catch (err) {
            console.error('Failed to refresh students:', err);
        } finally {
            setStudentsLoading(false);
        }
    };

    const handleStudentEdit = async (studentId, updates) => {
        try {
            await studentService.updateStudent(studentId, updates);

            const response = await studentService.getUserStudents(1, 10);
            setStudents(response.students);

            const updatedStudent = response.students.find(s => s.id === studentId);
            if (updatedStudent) {
                setSelectedStudent({
                    id: updatedStudent.id,
                    firstName: updatedStudent.firstName,
                    lastName: updatedStudent.lastName,
                    birthDate: updatedStudent.birthDate,
                    avatar: updatedStudent.avatar,
                    parent: updatedStudent.parent,
                    classes: updatedStudent.classes || [],
                });
            }

            console.log('Student updated successfully');
        } catch (err) {
            console.error('Failed to update student:', err);
            alert(`Failed to update student: ${err.message}`);
        }
    };

    const handleStudentDelete = async (studentId) => {
        try {
            await studentService.deleteStudent(studentId);

            const response = await studentService.getUserStudents(1, 10);
            setStudents(response.students);

            console.log('Student deleted successfully');
        } catch (err) {
            console.error('Failed to delete student:', err);
            alert(`Failed to delete student: ${err.message}`);
        }
    };

    // Class handlers
    const handleClassClick = (classItem) => {
        console.log('Class clicked:', classItem);
        setSelectedClass({
            id: classItem.id,
            name: classItem.name,
            memberCount: classItem.memberCount || 0,
            treasurer: classItem.treasurer,
            isTreasurer: classItem.isTreasurer,
        });
        setClassDetailsDialogOpen(true);
    };

    const handleClassAdded = async () => {
        try {
            setClassesLoading(true);
            const isTreasurer = classesTab === 1;
            const response = await classService.getUserClasses(1, 10, isTreasurer);
            setClasses(response.classes);
        } catch (err) {
            console.error('Failed to refresh classes:', err);
        } finally {
            setClassesLoading(false);
        }
    };

    const handleClassEdit = async (classId, updates) => {
        try {
            await classService.updateClass(classId, updates);

            const isTreasurer = classesTab === 1;
            const response = await classService.getUserClasses(1, 10, isTreasurer);
            setClasses(response.classes);

            const updatedClass = response.classes.find(c => c.id === classId);
            if (updatedClass) {
                setSelectedClass({
                    id: updatedClass.id,
                    name: updatedClass.name,
                    memberCount: updatedClass.memberCount || 0,
                    treasurer: updatedClass.treasurer,
                    isTreasurer: updatedClass.isTreasurer,
                });
            }

            console.log('Class updated successfully');
        } catch (err) {
            console.error('Failed to update class:', err);
            alert(`Failed to update class: ${err.message}`);
        }
    };

    const handleClassDelete = async (classId) => {
        try {
            await classService.deleteClass(classId);

            const isTreasurer = classesTab === 1;
            const response = await classService.getUserClasses(1, 10, isTreasurer);
            setClasses(response.classes);

            console.log('Class deleted successfully');
        } catch (err) {
            console.error('Failed to delete class:', err);
            alert(`Failed to delete class: ${err.message}`);
        }
    };

    // Calculate treasurer classes count
    const treasurerClassesCount = classes.filter(c => c.isTreasurer).length;

    // Loading and error states
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

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
                                    {user?.name || 'User'}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {user?.email || 'No email'}
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
                                        onClick={() => setAddStudentDialogOpen(true)}
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
                                    {studentsLoading ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                            <CircularProgress />
                                        </Box>
                                    ) : students.length === 0 ? (
                                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                            No students found. Add your first student!
                                        </Typography>
                                    ) : (
                                        students.map((student, index) => (
                                            <motion.div
                                                key={student.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 + index * 0.1 }}
                                            >
                                                <StudentCard
                                                    student={{
                                                        id: student.id,
                                                        name: student.fullName,
                                                        age: student.age,
                                                        avatar: student.avatar,
                                                    }}
                                                    getInitials={getInitialsFromName}
                                                    onClick={() => handleStudentClick(student)}
                                                />
                                            </motion.div>
                                        ))
                                    )}
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
                                            onClick={() => setAddClassDialogOpen(true)}
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
                                                    label={classesTab === 1 ? classes.length : treasurerClassesCount}
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
                                    {classesLoading ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                            <CircularProgress />
                                        </Box>
                                    ) : classes.length === 0 ? (
                                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                            {classesTab === 0
                                                ? 'No classes found. Create your first class!'
                                                : 'You are not a treasurer of any classes yet.'}
                                        </Typography>
                                    ) : (
                                        classes.map((classItem, index) => (
                                            <motion.div
                                                key={classItem.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 + index * 0.1 }}
                                            >
                                                <ClassCard
                                                    classItem={classItem}
                                                    onClick={() => handleClassClick(classItem)}
                                                />
                                            </motion.div>
                                        ))
                                    )}
                                </Box>
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>

            {/* Dialogs */}
            <AddStudentDialog
                open={addStudentDialogOpen}
                onClose={() => setAddStudentDialogOpen(false)}
                onStudentAdded={handleStudentAdded}
            />

            <StudentDetailsDialog
                student={selectedStudent}
                open={studentDetailsDialogOpen}
                onClose={() => setStudentDetailsDialogOpen(false)}
                getInitials={getInitialsFromName}
                onEdit={handleStudentEdit}
                onDelete={handleStudentDelete}
            />

            <AddClassDialog
                open={addClassDialogOpen}
                onClose={() => setAddClassDialogOpen(false)}
                onClassAdded={handleClassAdded}
            />

            <ClassDetailsDialog
                classItem={selectedClass}
                open={classDetailsDialogOpen}
                onClose={() => setClassDetailsDialogOpen(false)}
                onEdit={handleClassEdit}
                onDelete={handleClassDelete}
            />
        </Box>
    );
}