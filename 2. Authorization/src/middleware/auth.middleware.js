import { ApiError } from "../utils/ApiError";
import jwt from 'jsonwebtoken'

const authenticate = (req,res,next)=>{
   const authHeader = req.headers.authrorization;
   if(!authHeader || !authHeader.startsWith('Bearer')){
    throw new ApiError('Access token missing', 401);
   }
   const token = authHeader.split(" ")[1];
   if(!token) throw new ApiError("Access token missing", 401);

   try {
    const user = jwt.verify(token,process.env.JWT_SECRET);
    if (!user) throw new ApiError("invalid access token", 401);
    req.user = user;
    next();
   } catch (error) {
    throw new ApiError(`${error.message}`);
   }
}

export default authenticate