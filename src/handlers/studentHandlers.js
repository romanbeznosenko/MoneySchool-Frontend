import { studentService } from '../services/studentService';

export const createStudentHandlers = (setStudents, setStudentsLoading, setSelectedStudent) => {
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

    return {
        handleStudentClick,
        handleStudentAdded,
        handleStudentEdit,
        handleStudentDelete,
    };
};