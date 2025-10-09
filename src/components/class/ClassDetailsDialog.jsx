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
    Button,
    TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GroupIcon from '@mui/icons-material/Group';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import { motion } from 'framer-motion';

function DeleteConfirmationDialog({ open, onClose, onConfirm, className }) {
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
                    This will permanently delete the class "{className}".
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
                    Delete Class
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function ClassDetailsDialog({
    classItem,
    open,
    onClose,
    onEdit,
    onDelete
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [editedData, setEditedData] = useState({
        name: '',
    });

    if (!classItem) return null;

    const handleEditClick = () => {
        setEditedData({
            name: classItem.name,
        });
        setIsEditing(true);
    };

    const handleSave = () => {
        console.log('handleSave called');
        console.log('editedData:', editedData);

        if (onEdit && editedData.name && editedData.name.trim()) {
            console.log('Calling onEdit with:', classItem.id, editedData);
            onEdit(classItem.id, editedData);
            setIsEditing(false);
        } else {
            console.error('Validation failed:', {
                hasOnEdit: !!onEdit,
                hasName: !!editedData.name,
            });
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedData({
            name: classItem.name,
        });
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(classItem.id);
            setShowDeleteAlert(false);
            onClose();
        }
    };

    const handleDialogClose = () => {
        onClose();
        setIsEditing(false);
    };

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
                    {isEditing ? 'Edit Class' : 'Class Details'}
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
                        {/* Class Name Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {!isEditing && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        mb: 4,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 96,
                                            height: 96,
                                            borderRadius: '50%',
                                            bgcolor: 'primary.main',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 2,
                                        }}
                                    >
                                        <GroupIcon sx={{ fontSize: 48, color: 'white' }} />
                                    </Box>
                                    <Typography variant="h5" fontWeight={600} gutterBottom>
                                        {classItem.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {classItem.memberCount} members
                                    </Typography>
                                </Box>
                            )}
                        </motion.div>

                        <Divider sx={{ my: 3 }} />

                        {/* Class Details Section */}
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: 'block', mb: 1 }}
                                >
                                    Class Name
                                </Typography>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={editedData.name}
                                        onChange={(e) => setEditedData({
                                            name: e.target.value
                                        })}
                                        inputProps={{ maxLength: 100 }}
                                        autoFocus
                                    />
                                ) : (
                                    <Typography variant="body1">
                                        {classItem.name}
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        {!isEditing && (
                            <>
                                <Divider sx={{ my: 3 }} />

                                {/* Treasurer Section */}
                                {classItem.treasurer && (
                                    <Box sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                            <Typography variant="caption" color="text.secondary">
                                                Treasurer
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar
                                                src={classItem.treasurer.avatar || ''}
                                                sx={{ width: 40, height: 40 }}
                                            >
                                                {classItem.treasurer.name?.[0]?.toUpperCase() ||
                                                    classItem.treasurer.email?.[0]?.toUpperCase()}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {classItem.treasurer.fullName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {classItem.treasurer.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                )}

                                <Divider sx={{ my: 3 }} />

                                {/* Members Count */}
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <GroupIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="caption" color="text.secondary">
                                            Members
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1">
                                        {classItem.memberCount} {classItem.memberCount === 1 ? 'member' : 'members'}
                                    </Typography>
                                </Box>
                            </>
                        )}
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
                            {onDelete && (
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
                            )}
                            <Button
                                onClick={handleEditClick}
                                variant="outlined"
                                startIcon={<EditIcon />}
                                sx={{ textTransform: 'none', ml: onDelete ? 0 : 'auto' }}
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
                className={classItem.name}
            />
        </>
    );
}