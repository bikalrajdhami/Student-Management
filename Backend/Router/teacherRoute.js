const express = require("express");

const router = express.Router();

const {
    getteacher,
    createTeacher,
    teacherbyid,
    deleteteacher,
    updateteacher
} = require("../Controller/teacherController");

// Get all teachers
router.get("/", getteacher);

// Create teacher
router.post("/", createTeacher);

// Get teacher by ID
router.get("/:id", teacherbyid);

// Delete teacher
router.delete("/:id", deleteteacher);

// Update teacher
router.patch("/:id", updateteacher);

module.exports = router;