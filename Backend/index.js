const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const db = require("./Config/db");

const StudentRoute = require("./Router/studentRoute");
const TeacherRoute = require("./Router/teacherRoute");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/students", StudentRoute);
app.use("/api/teachers", TeacherRoute);

// Test route
app.get("/", (req, res) => {
    res.send("Student Management backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    await db();
    console.log(`Server is running on ${PORT}`);
});