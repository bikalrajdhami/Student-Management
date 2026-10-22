
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Get all attendance records
export const getAttendance = (params = {}) => {
  return API.get("/attendance", { params });
};

// Create attendance
export const createAttendance = (attendance) => {
  return API.post("/attendance", attendance);
};

// Get attendance by ID
export const getAttendanceById = (id) => {
  return API.get(`/attendance/${id}`);
};

// Update attendance
export const patchAttendance = (id, attendance) => {
  return API.patch(`/attendance/${id}`, attendance);
};

// Delete attendance
export const deleteAttendance = (id) => {
  return API.delete(`/attendance/${id}`);
};

export default API;
