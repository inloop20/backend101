import prisma from "../config/db.config.js";
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import bcrypt from 'bcrypt'

export const registration = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const isUserExist = await prisma.user.findOne({
    where: {
      OR:[
        {username},
        {email}
      ]
    },
  });
  if(isUserExist)  throw ApiError('user with this email or username already exist');
  const hashedPassword = await bcrypt.hash(password,10);
  const user = await prisma.user.create({
    data:{
        username,
        email,
        password:hashedPassword
    }
  })

  if(!user) throw new ApiError('failed to created user',500);
  return res.status(201).json(new ApiResponse('user created',201,{user:user.username}));
});
