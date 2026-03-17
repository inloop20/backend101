import ApiError from '../utils/ApiError.js';

const validate = (schema,target='body') => (req,res,next) => {
    const data = target === 'body' ? req.body : req.query;
    const result = schema.safeParse(data);
    if(!result.success){
        const error = result.error.issues.map((e)=>({
            path:e.path.join(","),
            message:e.message
        }))
    throw new ApiError(`Validation failed: ${JSON.stringify(error)}`, 401); 
    }
    if (target === "body") req.body = result.data;
    next();
}

export default validate;