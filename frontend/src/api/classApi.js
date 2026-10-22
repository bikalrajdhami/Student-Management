
import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Get all classes
export const getclass = () =>
    API.get("/class");

// Create a new class
export const createclass = (classData) =>
    API.post("/class", classData);

// Delete a class
export const deleteclass = (id) =>
    API.delete(`/class/${id}`);

// Get a class by ID
export const getClassById = (id) =>
    API.get(`/class/${id}`);

// Update a class
export const updateclass = (id, classData) =>
    API.patch(`/class/${id}`, classData);
