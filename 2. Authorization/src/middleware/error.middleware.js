
const errorHandler = (err,req,res,next)=>{
    return res.status(err.statusCode).json(err.message);
}

export default errorHandler