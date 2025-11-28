import { classApi } from "./api/classApi";
import { ClassGetPageResponseDto } from "./../dto/class/ClassGetPageResponse";
import { ErrorResponseDto } from "../dto/ErrorResponse"
import { ClassEditRequestDto } from "../dto/class/ClassEditRequest";

export const classService = {
    createClass: async (name) => {
        try {
            if (!name || !name.trim()) {
                throw new Error("Class name is required");
            }

            const apiResponse = await classApi.createClass(name);
            console.log('Class created successfully:', apiResponse.message);
            return apiResponse;
        } catch (error) {
            console.error("Create class service error:", error);
            throw new ErrorResponseDto(
                error.message || "Failed to create a class.",
                error.httpStatus
            );
        }
    },

    getUserClasses: async (page = 1, limit = 10, isTreasurer = false) => {
        try {
            const apiResponse = await classApi.getClasses(page, limit, isTreasurer);

            const response = new ClassGetPageResponseDto(apiResponse);

            console.log(`Retrieved ${response.count} classes`);
            return response;
        } catch (error) {
            console.error("Get classes service error:", error);
            throw new ErrorResponseDto(
                error.message || "Failed to retrieve classes.",
                error.httpStatus
            );
        }
    },

    updateClass: async (classId, updates) => {
        try {
            if (!classId) {
                throw new Error("Class ID is required");
            }

            if (!updates.name || !updates.name.trim()) {
                throw new Error("Class name is required");
            }

            const request = new ClassEditRequestDto(updates.name);

            const apiResponse = await classApi.editClass(classId, request);

            console.log("Class updated successfully:", apiResponse.message);
            return apiResponse;
        } catch (error) {
            console.error("Update class service error:", error);
            throw new ErrorResponseDto(
                error.message || "Failed to update class",
                error.httpStatus
            );
        }
    },

    deleteClass: async (classId) => {
        try {
            if (!classId) {
                throw new Error("Class ID is required");
            }

            console.log("Deleting class with ID:", classId);

            const apiResponse = await classApi.deleteClass(classId);
            console.log("Class deleted successfully:", apiResponse.message);
            return apiResponse;
        } catch (error) {
            console.error("Delete class service error:", error);
            throw new ErrorResponseDto(
                error.message || "Failed to delete class",
                error.httpStatus
            );
        }
    },

    joinClass: async (studentId, accessCode) => {
        try {
            if (!studentId) {
                throw new Error("Student ID is required");
            }

            if (!accessCode || !accessCode.trim()) {
                throw new Error("Access code is required");
            }

            if (!/^\d{4}$/.test(accessCode)) {
                throw new Error("Access code must be a 4-digit number");
            }

            console.log("Joining class with student ID:", studentId);

            const apiResponse = await classApi.joinClass(studentId, accessCode);
            console.log("Joined class successfully:", apiResponse.message);
            return apiResponse;
        } catch (error) {
            console.error("Join class service error:", error);
            throw new ErrorResponseDto(
                error.message || "Failed to join class",
                error.httpStatus
            );
        }
    },
};