const express = require("express");

const router = express.Router();

const { createStudent, getstudent, studentbyid, deletestudent, updatestudent } = require("../Controller/studentController");

router.post("/", createStudent);
router.get("/", getstudent);
router.get("/:id", studentbyid)
router.delete("/:id", deletestudent)
router.patch("/:id",updatestudent)

module.exports = router;