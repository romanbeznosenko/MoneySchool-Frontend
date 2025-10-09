import { studentApi } from "./api/studentApi";
import { StudentGetPageResponseDto } from './../dto/student/StudentGetPageResponse';
import { StudentCreateRequestDto } from './../dto/student/StudentCreateRequest';
import { StudentEditRequestDto } from "../dto/student/StudentEditRequest";
import { ErrorResponseDto } from './../dto/ErrorResponse';

export const studentService = {
    createStudent: async (firstName, lastName, birthDate) => {
        try {
            if (!firstName || !firstName.trim()) {
                throw new Error("First name is required");
            }
            if (!lastName || !lastName.trim()) {
                throw new Error("Last name is required");
            }
            if (!birthDate) {
                throw new Error("Birth date is required");
            }

            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(birthDate)) {
                throw new Error("Birth date must be in format YYYY-MM-DD");
            }

            const request = new StudentCreateRequestDto(
                firstName,
                lastName,
                birthDate
            );

            const apiResponse = await studentApi.createStudent(request);

            console.log('Student created successfully: ', apiResponse.message);
            return apiResponse;
        } catch (error) {
            console.error("Create student service error: ", error);
            throw new ErrorResponseDto(
                error.message || 'Failed to create student.',
                error.httpStatus
            );
        }
    },

    getUserStudents: async (page = 1, limit = 10) => {
        try {
            const apiResponse = await studentApi.getUserStudents(page, limit);

            const response = new StudentGetPageResponseDto(apiResponse);

            console.log("Retrieved ${response.count} students");
            return response;
        } catch (error) {
            console.error("Get students service error: ", error);
            throw new ErrorResponseDto(
                error.message || "Failed to retrieve students.",
                error.httpStatus
            );
        }
    },

    updateStudent: async (studentId, updates) => {
        try {
            if (!studentId) {
                throw new Error("Student ID is required");
            }

            if (!updates.firstName || !updates.firstName.trim()) {
                throw new Error("First name is required");
            }
            if (!updates.lastName || !updates.lastName.trim()) {
                throw new Error("Last name is required");
            }
            if (!updates.birthDate) {
                throw new Error("Birth date is required");
            }

            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(updates.birthDate)) {
                throw new Error("Birth date must be in format YYYY-MM-DD");
            }

            const request = new StudentEditRequestDto(
                updates.firstName,
                updates.lastName,
                updates.birthDate
            );

            const apiResponse = await studentApi.updateStudent(studentId, request);

            console.log('Student updated successfully:', apiResponse.message);
            return apiResponse;
        } catch (error) {
            console.error("Update student service error:", error);
            throw new ErrorResponseDto(
                error.message || 'Failed to update student.',
                error.httpStatus
            );
        }
    },

    deleteStudent: async (studentId) => {
        try {
            if (!studentId) {
                throw new Error("Student ID is required");
            }

            console.log('Deleting student with ID:', studentId);

            const apiResponse = await studentApi.deleteStudent(studentId);

            console.log('Student deleted successfully:', apiResponse.message);
            return apiResponse;
        } catch (error) {
            console.error("Delete student service error:", error);
            throw new ErrorResponseDto(
                error.message || 'Failed to delete student.',
                error.httpStatus
            );
        }
    },
}