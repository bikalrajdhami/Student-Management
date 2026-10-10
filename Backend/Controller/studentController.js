const Student = require("../Models/studentModel");
const HandleError = require("../utils/handleerror");

// Get all students
async function getstudent(req, res) {
    try {
        const students = await Student.find();

        res.status(200).json({
            success: true,
            message: "Successfully fetched students",
            students
        });

    } catch (error) {
      return HandleError(res,error)
    }
}

// Create student
async function createStudent(req, res) {
    try {
        const {
            name,
            email,
            class: studentclass,
            section,
            address,
            parentname,
            parentphone
        } = req.body;
   

        if (!name || !email || !studentclass || !section || !address || !parentname || !parentphone) {
            return res.status(400).json({
                success: false,
                message: "Fill all fields"
            });
        }
   

        const student = await Student.create({
            name,
            email,
            class: studentclass,
            section,
            address,
            parentname,
            parentphone

        });

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            student
        });

    } catch (error) {
        return HandleError(res,error);
    }
}

//getstudentsbyid
async function studentbyid(req, res) {
    try {
        const { id } = req.params;

        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Student fetched successfully",
            student
        });

    } catch (error) {
       return HandleError(res.error)
    }
}

//deletestudents
async function deletestudent(req,res){
    const{id}=req.params;
    try{

        const students= await Student.findByIdAndDelete(id)
        return res.status(200).json({
            success: true,
            message:"Successfully students get deleted"
        })
    } catch(error){
       return HandleError(res.error);
    }
}

// updatestudent
async function updatestudent(req,res){
    const {id}=req.params;
     const {
        name,
        email,
        class: studentclass,
        section,
        address,
        parentname,
        parentphone
    } = req.body;
    try {
        const students = await Student.findByIdAndUpdate(id,{name, email, class:studentclass, section, address,parentname, parentphone},
             { returnDocument: "after" }
            );
            if(!students){
                return res.status(404).json({
                    success: false,
                    message:"Students not Found"
                })
            }
        return res.status(200).json({
            success:true,
            message:"Successfully updated the students",
            students
        })

    } catch (error) {
         return res.status(500).json({
        success: false,
        message: "Failed to update student",
        error: error.message
    });
    }
}
module.exports = {
    createStudent,
    getstudent,studentbyid, deletestudent, updatestudent
};