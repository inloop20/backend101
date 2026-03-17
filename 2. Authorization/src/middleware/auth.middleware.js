import  ApiError  from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'

const authenticate = (req,res,next)=>{
   const authHeader = req.headers.authorization;
   if(!authHeader || !authHeader.startsWith('Bearer')){
    throw new ApiError('refresh token missing', 401);
   }
   const token = authHeader.split(" ")[1];
   if(!token) throw new ApiError("invalid token missing", 401);

   try {
    const user = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
    if (!user) throw new ApiError("invalid refresh token", 401);
    req.user = user;
    next();
   } catch (error) {
    throw new ApiError(`${error.message}`);
   }
}



export default authenticate