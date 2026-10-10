const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
    {
        teacherID: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        gender: {
            type: String,
            required: true,
            trim: true
        },

        dateOfBirth: {
            type: Date,
            required: true
        },

        address: {
            type: String,
            required: true,
            trim: true
        },

        qualification: {
            type: String,
            required: true,
            trim: true
        },

        specialization: {
            type: String,
            required: true,
            trim: true
        },

        department: {
            type: String,
            required: true,
            trim: true
        },

        subjects: {
            type: [String],
            required: true
        },

        classes: {
            type: [String],
            required: true
        },

        joiningDate: {
            type: Date,
            required: true
        },

        salary: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            required: true,
            default: "Active",
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;