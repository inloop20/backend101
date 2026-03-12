import { ApiError } from "../utils/ApiError.js";

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((s)=> ({
        path:s.path.join("."),
        error: s.message
      }));
   
      
      throw new ApiError(errors, 400);
    }
    req.body = result.data;
    next();
  };
};

export default validate;
