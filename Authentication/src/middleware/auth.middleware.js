import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer"))
    throw new ApiError("Access token required", 401);
  const token = authHeader.split(" ")[1];
  if (!token) throw new ApiError("Access token missing", 401);

  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!user) throw new ApiError("invalid access token", 401);
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError("invalid or expired access token");
  }
};

export default authenticate;
