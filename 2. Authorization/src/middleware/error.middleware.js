
const errorHandler = (err,req,res,next)=>{
    console.log(err.stack);
    
    return res.status(err.statusCode || 500).json(err.message);
}

export default errorHandler