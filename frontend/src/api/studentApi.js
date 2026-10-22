import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export const getStudents = () =>
    API.get("/students");

export const createStudent = (student) =>
    API.post("/students", student);

export const deleteStudent = (id) =>
    API.delete(`/students/${id}`);

export const getStudentById = (id) =>
    API.get(`/students/${id}`);

export const updateStudent = (id, student) =>
    API.patch(`/students/${id}`, student);