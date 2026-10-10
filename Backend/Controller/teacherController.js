const Teacher = require("../Models/teacherModel");
const HandleError = require("../utils/handleerror");

// GET ALL TEACHERS


async function getteacher(req, res) {
    try {
        const teacher = await Teacher.find();

        return res.status(200).json({
            success: true,
            message: "Successfully fetched teachers",
            teacher
        });

    } catch (error) {
        return HandleError(res, error);
    }
}

// CREATE TEACHER


async function createTeacher(req, res) {
    try {
        const {
            teacherID,
            firstName,
            lastName,
            email,
            phone,
            gender,
            dateOfBirth,
            address,
            qualification,
            specialization,
            department,
            subjects,
            classes,
            joiningDate,
            salary,
            status
        } = req.body;

        // Check required fields
        if (
            !teacherID ||
            !firstName ||
            !lastName ||
            !email ||
            !phone ||
            !gender ||
            !dateOfBirth ||
            !address ||
            !qualification ||
            !specialization ||
            !department ||
            !subjects ||
            !classes ||
            !joiningDate ||
            !salary ||
            !status
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        // Create teacher
        const teacher = await Teacher.create({
            teacherID,
            firstName,
            lastName,
            email,
            phone,
            gender,
            dateOfBirth,
            address,
            qualification,
            specialization,
            department,
            subjects,
            classes,
            joiningDate,
            salary,
            status
        });

        return res.status(201).json({
            success: true,
            message: "Teacher created successfully",
            teacher
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


// GET TEACHER BY ID


async function teacherbyid(req, res) {
    try {
        const { id } = req.params;

        const teacher = await Teacher.findById(id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Teacher fetched successfully",
            teacher
        });

    } catch (error) {
        return HandleError(res, error);
    }
}

// DELETE TEACHER


async function deleteteacher(req, res) {
    try {
        const { id } = req.params;

        const teacher = await Teacher.findByIdAndDelete(id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Teacher deleted successfully"
        });

    } catch (error) {
        return HandleError(res, error);
    }
}

// UPDATE TEACHER


async function updateteacher(req, res) {
    try {
        const { id } = req.params;

        const {
            teacherID,
            firstName,
            lastName,
            email,
            phone,
            gender,
            dateOfBirth,
            address,
            qualification,
            specialization,
            department,
            subjects,
            classes,
            joiningDate,
            salary,
            status
        } = req.body;
           

        const teacher = await Teacher.findByIdAndUpdate(
            id,
            {
                teacherID,
                firstName,
                lastName,
                email,
                phone,
                gender,
                dateOfBirth,
                address,
                qualification,
                specialization,
                department,
                subjects,
                classes,
                joiningDate,
                salary,
                status
            },
            {
                returnDocument: "after"
            }
        );

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Teacher updated successfully",
            teacher
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update teacher",
            error: error.message
        });
    }
}


module.exports = {
    getteacher,
    createTeacher,
    teacherbyid,
    deleteteacher,
    updateteacher
};