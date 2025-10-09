import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Box,
    Avatar,
    Typography,
    Divider,
    Chip,
    Button,
    TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';

/**
 * Confirmation Dialog Component
 */
function DeleteConfirmationDialog({ open, onClose, onConfirm, studentName }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 },
            }}
        >
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary">
                    This will permanently delete {studentName} from your students list.
                    This action cannot be undone.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} sx={{ textTransform: 'none' }}>
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="error"
                    sx={{ textTransform: 'none' }}
                >
                    Delete Student
                </Button>
            </DialogActions>
        </Dialog>
    );
}

/**
 * StudentDetailsDialog Component
 * @param {Object} props
 * @param {Object|null} props.student - Student details object
 * @param {boolean} props.open - Whether dialog is open
 * @param {Function} props.onClose - Callback when dialog closes
 * @param {Function} props.getInitials - Function to get initials from name
 * @param {Function} props.onEdit - Callback when student is edited
 * @param {Function} props.onDelete - Callback when student is deleted
 */
export default function StudentDetailsDialog({
    student,
    open,
    onClose,
    getInitials,
    onEdit,
    onDelete
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [editedData, setEditedData] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
    });

    if (!student) return null;

    const fullName = `${student.firstName} ${student.lastName}`;

    const handleEditClick = () => {
        setEditedData({
            firstName: student.firstName,
            lastName: student.lastName,
            birthDate: student.birthDate,
        });
        setIsEditing(true);
    };

    const handleSave = () => {
        if (onEdit && editedData.firstName && editedData.lastName && editedData.birthDate) {
            onEdit(student.id, editedData);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedData({
            firstName: student.firstName,
            lastName: student.lastName,
            birthDate: student.birthDate,
        });
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(student.id);
            setShowDeleteAlert(false);
            onClose();
        }
    };

    const handleDialogClose = () => {
        onClose();
        setIsEditing(false);
    };

    // Calculate age from birth date
    const calculateAge = (birthDate) => {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const age = calculateAge(student.birthDate);
    const initials = getInitials ? getInitials(fullName) : fullName.charAt(0).toUpperCase();

    const today = new Date().toISOString().split('T')[0];
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 100);
    const minDateStr = minDate.toISOString().split('T')[0];

    return (
        <>
            <Dialog
                open={open}
                onClose={handleDialogClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                    },
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {isEditing ? 'Edit Student' : 'Student Details'}
                    <IconButton
                        onClick={handleDialogClose}
                        size="small"
                        sx={{ color: 'text.secondary' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ py: 2 }}>
                        {/* Avatar and Name Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    mb: 4,
                                }}
                            >
                                <Avatar
                                    src={student.avatar || ''}
                                    alt={fullName}
                                    sx={{
                                        width: 96,
                                        height: 96,
                                        mb: 2,
                                        fontSize: '2rem',
                                    }}
                                >
                                    {initials}
                                </Avatar>
                                {!isEditing && (
                                    <>
                                        <Typography variant="h5" fontWeight={600} gutterBottom>
                                            {fullName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Age {age}
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        </motion.div>

                        <Divider sx={{ my: 3 }} />

                        {/* Details Section */}
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: 'block', mb: 1 }}
                                >
                                    First Name
                                </Typography>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={editedData.firstName}
                                        onChange={(e) => setEditedData({
                                            ...editedData,
                                            firstName: e.target.value
                                        })}
                                        inputProps={{ maxLength: 50 }}
                                    />
                                ) : (
                                    <Typography variant="body1">
                                        {student.firstName}
                                    </Typography>
                                )}
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: 'block', mb: 1 }}
                                >
                                    Last Name
                                </Typography>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={editedData.lastName}
                                        onChange={(e) => setEditedData({
                                            ...editedData,
                                            lastName: e.target.value
                                        })}
                                        inputProps={{ maxLength: 50 }}
                                    />
                                ) : (
                                    <Typography variant="body1">
                                        {student.lastName}
                                    </Typography>
                                )}
                            </Box>

                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <CalendarTodayIcon
                                        sx={{ fontSize: 16, color: 'text.secondary' }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        Birth Date
                                    </Typography>
                                </Box>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="date"
                                        value={editedData.birthDate}
                                        onChange={(e) => setEditedData({
                                            ...editedData,
                                            birthDate: e.target.value
                                        })}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        inputProps={{
                                            max: today,
                                            min: minDateStr,
                                        }}
                                    />
                                ) : (
                                    <Typography variant="body1">
                                        {formatDate(student.birthDate)}
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Classes Section */}
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <SchoolIcon
                                    sx={{ fontSize: 16, color: 'text.secondary' }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                    Enrolled Classes ({student.classes?.length || 0})
                                </Typography>
                            </Box>

                            {!student.classes || student.classes.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                    Not enrolled in any classes
                                </Typography>
                            ) : (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {student.classes.map((classItem) => (
                                        <Chip
                                            key={classItem.id}
                                            label={classItem.name}
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(0, 0, 0, 0.08)',
                                                fontWeight: 500,
                                            }}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    {isEditing ? (
                        <>
                            <Button
                                onClick={handleCancel}
                                variant="outlined"
                                sx={{ textTransform: 'none' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                variant="contained"
                                sx={{
                                    textTransform: 'none',
                                    bgcolor: 'black',
                                    '&:hover': {
                                        bgcolor: 'rgba(0, 0, 0, 0.85)',
                                    },
                                }}
                            >
                                Save Changes
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                onClick={() => setShowDeleteAlert(true)}
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon />}
                                sx={{
                                    textTransform: 'none',
                                    mr: 'auto',
                                }}
                            >
                                Delete
                            </Button>
                            <Button
                                onClick={handleEditClick}
                                variant="outlined"
                                startIcon={<EditIcon />}
                                sx={{ textTransform: 'none' }}
                            >
                                Edit
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                open={showDeleteAlert}
                onClose={() => setShowDeleteAlert(false)}
                onConfirm={handleDelete}
                studentName={fullName}
            />
        </>
    );
}