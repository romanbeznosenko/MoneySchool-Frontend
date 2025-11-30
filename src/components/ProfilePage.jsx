import { useEffect, useState } from 'react';
import { Layout, Card, Typography, Form, Input, Button, Avatar, Upload, message, Spin, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import DashboardSider from './SideMenu';
import { useUser } from '../hooks/useUser';
import { userService } from '../services/userService';

const { Content } = Layout;
const { Title } = Typography;

export default function ProfilePage() {
    const { user, loading: userLoading, refreshUser } = useUser();
    const [loading, setLoading] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordForm] = Form.useForm();
    const [localAvatar, setLocalAvatar] = useState(null);
    const [localAvatarObjectUrl, setLocalAvatarObjectUrl] = useState(null);
    const [lastAvatarUrl, setLastAvatarUrl] = useState(null);

    const [form] = Form.useForm();

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                name: user?.name || '',
                surname: user?.surname || '',
                email: user?.email || '',
                phone: user?.phone || '',
                bio: user?.bio || '',
            });
        }
    }, [user, form]);

    const handleSave = async (values) => {
        setLoading(true);
        try {
            const payload = {
                name: values.name,
                surname: values.surname,
                phone: values.phone,
                bio: values.bio,
            };
            await userService.updateUser(payload);
            message.success('Profile updated');
            await refreshUser();
        } catch (err) {
            console.error(err);
            const serverMsg = err?.response?.data?.message || err.message;
            message.error(serverMsg || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUploadChange = async (info) => {
        console.log('upload change info', info);
        // some environments provide originFileObj, others provide the File object directly
        const file = info?.file?.originFileObj || info?.file;
        if (!file) {
            console.warn('No file object found in upload info', info);
            return;
        }
        
        const maxSizeMb = 5;
        if (!file.type.startsWith('image/')) {
            message.error('Please select an image file');
            return;
        }
        if (file.size / 1024 / 1024 > maxSizeMb) {
            message.error(`File is too large (max ${maxSizeMb} MB)`);
            return;
        }

        try {
            
            if (localAvatarObjectUrl) {
                try { URL.revokeObjectURL(localAvatarObjectUrl); } catch (_) {}
            }
            const objectUrl = URL.createObjectURL(file);
            setLocalAvatar(objectUrl);
            setLocalAvatarObjectUrl(objectUrl);
        } catch (_) {}

        setLoading(true);
        try {
            const resp = await userService.uploadAvatar(file);
            console.log('upload avatar response', resp);
            // try to extract avatar URL from common response shapes
            const returnedAvatar = resp?.data?.avatar || resp?.avatar || resp?.data?.avatarUrl || resp?.avatarUrl || null;
            if (returnedAvatar) setLastAvatarUrl(returnedAvatar);
            message.success('Avatar uploaded');
            await refreshUser();
            try { setLocalAvatar(null); } catch (_) {}
        } catch (err) {
            console.error(err);
            const serverMsg = err?.response?.data?.message || err.message;
            message.error(serverMsg || 'Failed to upload avatar');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (localAvatarObjectUrl) {
                try { URL.revokeObjectURL(localAvatarObjectUrl); } catch (_) {}
            }
        };
    }, [localAvatarObjectUrl]);

    if (userLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <Spin />
            </div>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <DashboardSider user={user} selectedMenu={'profile'} setSelectedMenu={() => {}} />
            <Layout>
                <Content style={{ padding: 24, display: 'flex', justifyContent: 'center', background: '#fafafa' }}>
                    <div style={{ width: 600 }}>
                        <Card style={{ borderRadius: 25, padding: 24, boxShadow: '0 6px 12px rgba(15,15,15,0.04)' }}>
                            <Title level={4} style={{ fontWeight: 700 }}>My Profile</Title>

                            {/* Header: avatar + name/email + upload button */}
                            <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                    <Avatar size={96} src={localAvatar || (user?.avatar || null)}>
                                        {user?.name?.[0]?.toUpperCase()}
                                    </Avatar>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1 }}>{(user?.name || '') + (user?.surname ? ` ${user.surname}` : '')}</div>
                                        <div style={{ fontSize: 13, color: '#6b6b6b', marginTop: 6 }}>{user?.email || ''}</div>
                                    </div>
                                </div>

                                <div>
                                    <Upload
                                        accept="image/*"
                                        showUploadList={false}
                                        beforeUpload={() => false}
                                        onChange={handleUploadChange}
                                    >
                                        <Button icon={<UploadOutlined />} style={{ background: '#000', borderColor: '#000', color: '#fff' }}>Upload Avatar</Button>
                                    </Upload>
                                </div>
                            </div>

                            {lastAvatarUrl && (
                                <div style={{ marginBottom: 16 }}>
                                    {/* Only show last uploaded if it's a server URL */}
                                    {lastAvatarUrl.startsWith('http') ? (
                                        <a href={lastAvatarUrl} target="_blank" rel="noreferrer">Last uploaded avatar</a>
                                    ) : (
                                        <span style={{ fontSize: 12, color: '#6b6b6b' }}>Preview available locally</span>
                                    )}
                                </div>
                            )}


                            <Form form={form} layout="vertical" onFinish={handleSave}>
                                <Form.Item name="email" label="Email">
                                    <Input disabled />
                                </Form.Item>

                                <Form.Item name="name" label="First name" rules={[{ required: true, message: 'First name is required' }]}> 
                                    <Input />
                                </Form.Item>

                                <Form.Item name="surname" label="Last name" rules={[{ required: true, message: 'Last name is required' }]}> 
                                    <Input />
                                </Form.Item>

                                <Form.Item name="phone" label="Phone">
                                    <Input />
                                </Form.Item>

                                <Form.Item name="bio" label="Short bio">
                                    <Input.TextArea rows={4} />
                                </Form.Item>

                                <Form.Item>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                        <Button type="primary" htmlType="submit" loading={loading} style={{ background: '#000', borderColor: '#000' }}>
                                            Save
                                        </Button>
                                        <Button onClick={() => {
                                            // reset values to current user
                                            form.setFieldsValue({
                                                name: user?.name || '',
                                                surname: user?.surname || '',
                                                email: user?.email || '',
                                                phone: user?.phone || '',
                                                bio: user?.bio || '',
                                            });
                                            setLocalAvatar(null);
                                        }}>
                                            Cancel
                                        </Button>

                                        <Button type="default" onClick={() => setPasswordModalVisible(true)} style={{ marginLeft: 'auto' }}>
                                            Change password
                                        </Button>
                                    </div>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                </Content>
            </Layout>
            {/* Change Password Modal */}
            <Modal
                title="Change password"
                open={passwordModalVisible}
                onCancel={() => { setPasswordModalVisible(false); passwordForm.resetFields(); }}
                footer={null}
            >
                <Form form={passwordForm} layout="vertical" onFinish={async (values) => {
                    setPasswordLoading(true);
                    try {
                        if (values.newPassword !== values.confirmPassword) {
                            message.error('New passwords do not match');
                            return;
                        }
                        await userService.changePassword(values.currentPassword, values.newPassword);
                        message.success('Password changed');
                        setPasswordModalVisible(false);
                        passwordForm.resetFields();
                    } catch (err) {
                        console.error('Change password failed', err);
                        const serverMsg = err?.response?.data?.message || err.message;
                        message.error(serverMsg || 'Failed to change password');
                    } finally {
                        setPasswordLoading(false);
                    }
                }}>
                    <Form.Item name="currentPassword" label="Current password" rules={[{ required: true, message: 'Current password is required' }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="newPassword" label="New password" rules={[{ required: true, message: 'New password is required' }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="confirmPassword" label="Confirm new password" rules={[{ required: true, message: 'Please confirm new password' }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <Button type="primary" htmlType="submit" loading={passwordLoading}>Change</Button>
                            <Button onClick={() => { setPasswordModalVisible(false); passwordForm.resetFields(); }}>Cancel</Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
}

