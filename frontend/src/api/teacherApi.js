
import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Get all teachers
export const getTeachers = () =>
    API.get("/teachers");

// Create teacher
export const createTeacher = (teacher) =>
    API.post("/teachers", teacher);

// Delete teacher
export const deleteTeacher = (id) =>
    API.delete(`/teachers/${id}`);

// Get teacher by ID
export const getTeacherById = (id) =>
    API.get(`/teachers/${id}`);

// Update teacher
export const updateTeacher = (id, teacher) =>
    API.put(`/teachers/${id}`, teacher);

