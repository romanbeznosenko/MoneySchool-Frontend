import { useState } from 'react';
import { Modal, Input, Button, Alert } from 'antd';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { classService } from "../../services/classService";

export default function AddClassDialog({ open, onClose, onClassAdded }) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleClose = () => {
        if (!loading) {
            // Reset form
            setName('');
            setError(null);
            setSuccess(null);
            onClose();
        }
    };

    const handleSubmit = async () => {
        setError(null);
        setSuccess(null);

        try {
            setLoading(true);

            // Call the service to create class
            const response = await classService.createClass(name);

            setSuccess('Class created successfully!');

            // Wait a moment to show success message
            setTimeout(() => {
                onClassAdded?.(response);
                handleClose();
            }, 1500);

        } catch (err) {
            console.error('Failed to create class:', err);
            setError(err.message || 'Failed to create class. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            title="Create New Class"
            width={600}
            closeIcon={<CloseOutlined />}
            footer={[
                <Button key="cancel" onClick={handleClose} disabled={loading || !!success}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleSubmit}
                    disabled={loading || !!success || !name.trim()}
                    style={{ backgroundColor: 'black' }}
                    icon={loading ? <LoadingOutlined /> : null}
                >
                    {loading ? 'Creating...' : 'Create Class'}
                </Button>,
            ]}
        >
            <AnimatePresence mode="wait">
                {(error || success) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <Alert
                            message={error || success}
                            type={error ? 'error' : 'success'}
                            closable
                            onClose={() => {
                                setError(null);
                                setSuccess(null);
                            }}
                            style={{ marginBottom: 16 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ marginTop: 16 }}>
                <label htmlFor="name" style={{ display: 'block', marginBottom: 8, color: 'rgba(0, 0, 0, 0.85)' }}>
                    Class Name <span style={{ color: 'red' }}>*</span>
                </label>
                <Input
                    id="name"
                    placeholder="e.g., Mathematics 101"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading || !!success}
                    maxLength={100}
                    autoFocus
                    onPressEnter={handleSubmit}
                />
                <div style={{ marginTop: 8, color: 'rgba(0, 0, 0, 0.45)', fontSize: '14px' }}>
                    Enter a descriptive name for your class
                </div>
            </div>
        </Modal>
    );
}
