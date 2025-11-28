import { useState } from 'react';
import { Modal, Button, Avatar, Typography, Divider, Tag, Input, Space } from 'antd';
import {
    CalendarOutlined,
    BookOutlined,
    EditOutlined,
    DeleteOutlined,
    CloseOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

const { Text, Title } = Typography;
const { confirm } = Modal;

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
        confirm({
            title: 'Are you sure?',
            icon: <ExclamationCircleOutlined />,
            content: `This will permanently delete ${fullName} from your students list. This action cannot be undone.`,
            okText: 'Delete Student',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                if (onDelete) {
                    onDelete(student.id);
                    onClose();
                }
            },
        });
    };

    const handleDialogClose = () => {
        onClose();
        setIsEditing(false);
    };

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

    return (
        <Modal
            open={open}
            onCancel={handleDialogClose}
            title={isEditing ? 'Edit Student' : 'Student Details'}
            width={600}
            closeIcon={<CloseOutlined />}
            footer={
                isEditing ? (
                    <Space>
                        <Button onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleSave}
                            style={{ backgroundColor: 'black' }}
                        >
                            Save Changes
                        </Button>
                    </Space>
                ) : (
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Button
                            danger
                            type="primary"
                            icon={<DeleteOutlined />}
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                        <Button
                            icon={<EditOutlined />}
                            onClick={handleEditClick}
                        >
                            Edit
                        </Button>
                    </Space>
                )
            }
        >
            <div style={{ padding: '16px 0' }}>
                {/* Avatar and Name Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            marginBottom: 32,
                        }}
                    >
                        <Avatar
                            src={student.avatar || ''}
                            size={96}
                            style={{ marginBottom: 16, fontSize: '2rem' }}
                        >
                            {initials}
                        </Avatar>
                        {!isEditing && (
                            <>
                                <Title level={4} style={{ marginBottom: 4 }}>
                                    {fullName}
                                </Title>
                                <Text type="secondary">Age {age}</Text>
                            </>
                        )}
                    </div>
                </motion.div>

                <Divider />

                {/* Details Section */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{ marginBottom: 24 }}>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                            First Name
                        </Text>
                        {isEditing ? (
                            <Input
                                value={editedData.firstName}
                                onChange={(e) => setEditedData({
                                    ...editedData,
                                    firstName: e.target.value
                                })}
                                maxLength={50}
                            />
                        ) : (
                            <Text>{student.firstName}</Text>
                        )}
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                            Last Name
                        </Text>
                        {isEditing ? (
                            <Input
                                value={editedData.lastName}
                                onChange={(e) => setEditedData({
                                    ...editedData,
                                    lastName: e.target.value
                                })}
                                maxLength={50}
                            />
                        ) : (
                            <Text>{student.lastName}</Text>
                        )}
                    </div>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <CalendarOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
                            <Text type="secondary">Birth Date</Text>
                        </div>
                        {isEditing ? (
                            <DatePicker
                                value={editedData.birthDate ? dayjs(editedData.birthDate) : null}
                                onChange={(date) => setEditedData({
                                    ...editedData,
                                    birthDate: date ? date.format('YYYY-MM-DD') : ''
                                })}
                                format="YYYY-MM-DD"
                                maxDate={dayjs()}
                                minDate={dayjs().subtract(100, 'years')}
                                style={{ width: '100%' }}
                                getPopupContainer={() => document.body}
                            />
                        ) : (
                            <Text>{formatDate(student.birthDate)}</Text>
                        )}
                    </div>
                </div>

                <Divider />

                {/* Classes Section */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <BookOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
                        <Text type="secondary">
                            Enrolled Classes ({student.classes?.length || 0})
                        </Text>
                    </div>

                    {!student.classes || student.classes.length === 0 ? (
                        <Text type="secondary">Not enrolled in any classes</Text>
                    ) : (
                        <Space wrap>
                            {student.classes.map((classItem) => (
                                <Tag key={classItem.id}>
                                    {classItem.name}
                                </Tag>
                            ))}
                        </Space>
                    )}
                </div>
            </div>
        </Modal>
    );
}
