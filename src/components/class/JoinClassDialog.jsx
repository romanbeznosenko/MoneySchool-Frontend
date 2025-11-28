import { useState } from 'react';
import { Modal, Input, Button, Alert, Select } from 'antd';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { classService } from "../../services/classService";

export default function JoinClassDialog({ open, onClose, onClassJoined, students }) {
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [classId, setClassId] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleClose = () => {
        if (!loading) {
            // Reset form
            setSelectedStudentId(null);
            setClassId('');
            setAccessCode('');
            setError(null);
            setSuccess(null);
            onClose();
        }
    };

    const handleSubmit = async () => {
        setError(null);
        setSuccess(null);

        // Validation
        if (!selectedStudentId) {
            setError('Please select a student');
            return;
        }

        if (!classId || !classId.trim()) {
            setError('Please enter a class ID');
            return;
        }

        if (!accessCode || accessCode.length !== 4) {
            setError('Access code must be exactly 4 digits');
            return;
        }

        if (!/^\d{4}$/.test(accessCode)) {
            setError('Access code must contain only digits');
            return;
        }

        try {
            setLoading(true);

            // Call the service to join class
            const response = await classService.joinClass(classId, selectedStudentId, accessCode);

            setSuccess('Successfully joined the class!');

            // Wait a moment to show success message
            setTimeout(() => {
                onClassJoined?.(response);
                handleClose();
            }, 1500);

        } catch (err) {
            console.error('Failed to join class:', err);
            setError(err.message || 'Failed to join class. Please check your access code and try again.');
        } finally {
            setLoading(false);
        }
    };

    // Prepare student options for the select dropdown
    const studentOptions = students?.map(student => ({
        value: student.id,
        label: student.fullName || `${student.firstName} ${student.lastName}`,
    })) || [];

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            title="Join Class"
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
                    disabled={loading || !!success || !selectedStudentId || !classId || !accessCode}
                    style={{ backgroundColor: 'black' }}
                    icon={loading ? <LoadingOutlined /> : null}
                >
                    {loading ? 'Joining...' : 'Join Class'}
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
                <label htmlFor="student" style={{ display: 'block', marginBottom: 8, color: 'rgba(0, 0, 0, 0.85)' }}>
                    Select Student <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                    id="student"
                    placeholder="Choose a student"
                    value={selectedStudentId}
                    onChange={(value) => setSelectedStudentId(value)}
                    disabled={loading || !!success}
                    style={{ width: '100%' }}
                    options={studentOptions}
                    showSearch
                />
                <div style={{ marginTop: 8, color: 'rgba(0, 0, 0, 0.45)', fontSize: '14px' }}>
                    Select which student will join this class
                </div>
            </div>

            <div style={{ marginTop: 24 }}>
                <label htmlFor="classId" style={{ display: 'block', marginBottom: 8, color: 'rgba(0, 0, 0, 0.85)' }}>
                    Class ID <span style={{ color: 'red' }}>*</span>
                </label>
                <Input
                    id="classId"
                    placeholder="Enter class ID (UUID)"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    disabled={loading || !!success}
                    onPressEnter={handleSubmit}
                />
                <div style={{ marginTop: 8, color: 'rgba(0, 0, 0, 0.45)', fontSize: '14px' }}>
                    Enter the class ID provided by your class treasurer
                </div>
            </div>

            <div style={{ marginTop: 24 }}>
                <label htmlFor="accessCode" style={{ display: 'block', marginBottom: 8, color: 'rgba(0, 0, 0, 0.85)' }}>
                    Access Code <span style={{ color: 'red' }}>*</span>
                </label>
                <Input
                    id="accessCode"
                    placeholder="Enter 4-digit code"
                    value={accessCode}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 4) {
                            setAccessCode(value);
                        }
                    }}
                    disabled={loading || !!success}
                    maxLength={4}
                    style={{ fontSize: '18px', letterSpacing: '0.5em', textAlign: 'center' }}
                    onPressEnter={handleSubmit}
                />
                <div style={{ marginTop: 8, color: 'rgba(0, 0, 0, 0.45)', fontSize: '14px' }}>
                    Enter the 4-digit access code provided by your class treasurer
                </div>
            </div>
        </Modal>
    );
}
