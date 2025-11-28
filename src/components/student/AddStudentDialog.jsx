import { useState } from 'react';
import { Modal, Input, Button, Alert } from 'antd';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { studentService } from '../../services/studentService';

export default function AddStudentDialog({ open, onClose, onStudentAdded }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleClose = () => {
        if (!loading) {
            setFirstName('');
            setLastName('');
            setBirthDate('');
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

            const response = await studentService.createStudent(
                firstName,
                lastName,
                birthDate
            );

            setSuccess('Student added successfully!');

            setTimeout(() => {
                onStudentAdded?.(response);
                handleClose();
            }, 1500);

        } catch (err) {
            console.error('Failed to add student:', err);
            setError(err.message || 'Failed to add student. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = firstName.trim() && lastName.trim() && birthDate;

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            title="Add New Student"
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
                    disabled={loading || !!success || !isFormValid}
                    style={{ backgroundColor: 'black' }}
                    icon={loading ? <LoadingOutlined /> : null}
                >
                    {loading ? 'Adding...' : 'Add Student'}
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
                            description={error || success}
                            type={error ? 'error' : 'success'}
                            closable
                            style={{ marginBottom: 16 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                <div>
                    <label htmlFor="firstName" style={{ display: 'block', marginBottom: 8, color: 'rgba(0, 0, 0, 0.85)' }}>
                        First Name <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Input
                        id="firstName"
                        placeholder="Enter first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={loading || !!success}
                        maxLength={50}
                        autoFocus
                    />
                </div>

                <div>
                    <label htmlFor="lastName" style={{ display: 'block', marginBottom: 8, color: 'rgba(0, 0, 0, 0.85)' }}>
                        Last Name <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Input
                        id="lastName"
                        placeholder="Enter last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={loading || !!success}
                        maxLength={50}
                    />
                </div>

                <div>
                    <label htmlFor="birthDate" style={{ display: 'block', marginBottom: 8, color: 'rgba(0, 0, 0, 0.85)' }}>
                        Birth Date <span style={{ color: 'red' }}>*</span>
                    </label>
                    <DatePicker
                        id="birthDate"
                        placeholder="Select birth date"
                        value={birthDate ? dayjs(birthDate) : null}
                        onChange={(date) => setBirthDate(date ? date.format('YYYY-MM-DD') : '')}
                        disabled={loading || !!success}
                        format="YYYY-MM-DD"
                        maxDate={dayjs()}
                        minDate={dayjs().subtract(100, 'years')}
                        style={{ width: '100%' }}
                        size="large"
                        getPopupContainer={() => document.body}
                    />
                </div>
            </div>
        </Modal>
    );
}
