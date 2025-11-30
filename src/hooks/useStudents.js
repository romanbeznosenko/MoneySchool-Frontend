import { useState, useEffect, useCallback } from 'react';
import { studentService } from '../services/studentService';

export const useStudents = (user) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const fetchStudents = useCallback(async () => {
        try {
            setLoading(true);
            const response = await studentService.getUserStudents(1, 10);
            console.debug('[useStudents] fetched students response:', response);
            setStudents(response.students);
        } catch (err) {
            console.error('Failed to fetch students:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchStudents();
        }
    }, [user, fetchStudents]);

    const handleStudentClick = useCallback((student) => {
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
    }, []);

    const handleStudentAdded = useCallback(async () => {
        await fetchStudents();
    }, [fetchStudents]);

    const handleStudentEdit = useCallback(async (studentId, updates) => {
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
    }, []);

    const handleStudentDelete = useCallback(async (studentId) => {
        try {
            await studentService.deleteStudent(studentId);

            const response = await studentService.getUserStudents(1, 10);
            setStudents(response.students);

            console.log('Student deleted successfully');
        } catch (err) {
            console.error('Failed to delete student:', err);
            alert(`Failed to delete student: ${err.message}`);
        }
    }, []);

    return {
        students,
        loading,
        selectedStudent,
        setSelectedStudent,
        handleStudentClick,
        handleStudentAdded,
        handleStudentEdit,
        handleStudentDelete,
    };
};