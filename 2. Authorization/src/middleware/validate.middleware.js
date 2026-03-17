import ApiError from '../utils/ApiError.js';

const validate = (schema) => (req,res,next) => {
    const result = schema.safeParse(req.body);
    if(!result.success){
        const error = result.error.issues.map((e)=>({
            path:e.path.join(","),
            message:e.message
    }))
    throw new ApiError(`Validation failed: ${JSON.stringify(error)}`, 400); 
    }
    req.body = result.data;
    next();
}

export default validate;