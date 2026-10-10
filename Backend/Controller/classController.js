const Class = require("../Models/classModel")
const Handleerror = require("../utils/handleerror")

async function createclass(req, res){
   try {
    const {classname, acdemicyear, grade, studentcapacity, classteacher, section, classstatus} = req.body;
    if(!classname || !acdemicyear || !grade || ! studentcapacity || !classteacher || !section || !classstatus){
      return res.status(400).json({
         success: false,
         message: "Please fill all fields"
      })
    }
    const Class = await Class.create({
        classname,
        acdemicyear,
        grade, 
        studentcapacity,
        classteacher,
        section,
        classstatus
    })
    res.status(201).json({
      success:true,
      message:"Successfully created Class",
      Class
    })
    
   } catch (error) {
    
   }
}