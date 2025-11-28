import { useState } from 'react';
import { Modal, Button, Avatar, Typography, Divider, Input, Space, message } from 'antd';
import {
    TeamOutlined,
    UserOutlined,
    EditOutlined,
    DeleteOutlined,
    CloseOutlined,
    ExclamationCircleOutlined,
    KeyOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { classApi } from '../../services/api/classApi';

const { Text, Title } = Typography;
const { confirm } = Modal;

export default function ClassDetailsDialog({
    classItem,
    open,
    onClose,
    onEdit,
    onDelete
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [accessCode, setAccessCode] = useState(null);
    const [loadingAccessCode, setLoadingAccessCode] = useState(false);
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
        confirm({
            title: 'Are you sure?',
            icon: <ExclamationCircleOutlined />,
            content: `This will permanently delete the class "${classItem.name}". This action cannot be undone.`,
            okText: 'Delete Class',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                if (onDelete) {
                    onDelete(classItem.id);
                    onClose();
                }
            },
        });
    };

    const handleDialogClose = () => {
        onClose();
        setIsEditing(false);
        setAccessCode(null);
    };

    const handleGetAccessCode = async () => {
        try {
            setLoadingAccessCode(true);
            console.log('Fetching access code for classId:', classItem.id);
            const response = await classApi.getAccessCode(classItem.id);
            console.log('Access code response:', response);
            console.log('Access token:', response.data.token);
            setAccessCode(response.data.token);
        } catch (error) {
            console.error('Failed to get access code:', error);
            message.error('Failed to get access code');
        } finally {
            setLoadingAccessCode(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={handleDialogClose}
            title={isEditing ? 'Edit Class' : 'Class Details'}
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
                        {onDelete && (
                            <Button
                                danger
                                type="primary"
                                icon={<DeleteOutlined />}
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        )}
                        {!accessCode ? (
                            <Button
                                icon={<KeyOutlined />}
                                style={{ marginLeft: onDelete ? 0 : 'auto' }}
                                onClick={handleGetAccessCode}
                                loading={loadingAccessCode}
                            >
                                Get access code
                            </Button>
                        ) : (
                            <Text
                                strong
                                style={{
                                    marginLeft: onDelete ? 0 : 'auto',
                                    fontSize: '16px',
                                    letterSpacing: '0.1em'
                                }}
                            >
                                Code: {accessCode}
                            </Text>
                        )}
                        <Button
                            icon={<EditOutlined />}
                            onClick={handleEditClick}
                            style={{ marginLeft: onDelete ? 0 : 'auto' }}
                        >
                            Edit
                        </Button>
                    </Space>
                )
            }
        >
            <div style={{ padding: '16px 0' }}>
                {/* Class Name Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {!isEditing && (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                marginBottom: 32,
                            }}
                        >
                            <div
                                style={{
                                    width: 96,
                                    height: 96,
                                    borderRadius: '50%',
                                    backgroundColor: '#1890ff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 16,
                                }}
                            >
                                <TeamOutlined style={{ fontSize: 48, color: 'white' }} />
                            </div>
                            <Title level={4} style={{ marginBottom: 4 }}>
                                {classItem.name}
                            </Title>
                            <Text type="secondary">
                                {classItem.memberCount} members
                            </Text>
                        </div>
                    )}
                </motion.div>

                <Divider />

                {/* Class Details Section */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{ marginBottom: 24 }}>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                            Class Name
                        </Text>
                        {isEditing ? (
                            <Input
                                value={editedData.name}
                                onChange={(e) => setEditedData({
                                    name: e.target.value
                                })}
                                maxLength={100}
                                autoFocus
                            />
                        ) : (
                            <Text>{classItem.name}</Text>
                        )}
                    </div>
                </div>

                {!isEditing && (
                    <>
                        <Divider />

                        {/* Treasurer Section */}
                        {classItem.treasurer && (
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                    <UserOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
                                    <Text type="secondary">Treasurer</Text>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <Avatar
                                        src={classItem.treasurer.avatar || ''}
                                        size={40}
                                    >
                                        {classItem.treasurer.name?.[0]?.toUpperCase() ||
                                            classItem.treasurer.email?.[0]?.toUpperCase()}
                                    </Avatar>
                                    <div>
                                        <Text strong style={{ display: 'block' }}>
                                            {classItem.treasurer.fullName}
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            {classItem.treasurer.email}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Divider />

                        {/* Members Count */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <TeamOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
                                <Text type="secondary">Members</Text>
                            </div>
                            <Text>
                                {classItem.memberCount} {classItem.memberCount === 1 ? 'member' : 'members'}
                            </Text>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}
