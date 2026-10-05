
const HandleError =(res, error, message="Server Error")=>{
    return res.status(500).json({
        success:false,
        message,
        error: error.message
    });
}
module.exports = HandleError;