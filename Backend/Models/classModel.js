const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
    {
        classname: {
            type: String,
            required: true
        },

        acdemicyear: {
            type: Number,
            required: true,
          
        },

        grade: {
            type: String,
            required: true
        },

        studentcapacity: {
            type: Number,
            required: true
        },

        classteacher: {
            type: String,
            required: true
        },
        section: {
            type: String,
            required: true
        },
        classstatus: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Class = mongoose.model("Class", classSchema);

module.exports = Class;