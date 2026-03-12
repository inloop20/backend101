import { prisma } from "../config/db.config.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const userExist = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (userExist)
    throw new ApiError("user with this email or username already exist", 409);
  const hashedpass = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedpass,
    },
    select: { username: true, email: true },
  });
  if (!user) throw new ApiError("failed to create user");

  return res
    .status(201)
    .json(new ApiResponse(201, "user created successfully", user));
});

export const login = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const isUserExist = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
    select: { username: true, password: true, id: true },
  });

  if (!isUserExist) throw new ApiError("invalid credentials", 401);

  const comparePass = await bcrypt.compare(password, isUserExist.password);
  if (!comparePass) throw new ApiError("invalid credentials", 401);

  const refreshToken = jwt.sign(
    { id: isUserExist.id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );

  const accessToken = jwt.sign(
    { id: isUserExist.id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );

  await prisma.refreshToken.create({
    data: {
      tokens: refreshToken,
      userId: isUserExist.id,
      expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(
      new ApiResponse(200, "logged in successfully", {
        user: { username: isUserExist.username, id: isUserExist.id },
        accessToken: accessToken,
      }),
    );
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    await prisma.refreshToken.delete({ where: { tokens: refreshToken } });
  }
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json(new ApiResponse(200, "logout successful"));
});

export const refreshTokens = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError("refresh token missing, please login again", 401);
  }
  const rotateTokens = await prisma.$transaction(async (tx) => {
    const token = await tx.refreshToken.findUnique({
      where: {
        tokens: refreshToken,
      },
    });
    if (!token) throw new ApiError("invalid token", 401);
    if (new Date() > token.expiresIn) {
      await tx.refreshToken.delete({ where: { tokens: refreshToken } });
      throw new ApiError("login again token expired", 401);
    }
    const newRefreshToken = jwt.sign(
      { id: token.userId },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
    );

    const newAccessToken = jwt.sign(
      { id: token.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
    );
    await tx.refreshToken.delete({ where: { tokens: refreshToken } });
    await tx.refreshToken.create({
      data: {
        tokens: newRefreshToken,
        userId: token.userId,
        expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    return { newAccessToken, newRefreshToken };
  });

  return res
    .status(200)
    .cookie("refreshToken", rotateTokens.newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(200, "token refreshed", {
        accessToken: rotateTokens.newAccessToken,
      }),
    );
});

export const logoutAll = asyncHandler(async (req, res) => {
  const deleted = await prisma.refreshToken.deleteMany({
    where: { userId: req.user.id },
  });
  if (deleted.count === 0) throw new ApiError("logout fail", 401);
  return res
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .status(200)
    .json(new ApiResponse(200, "logout-all successfull"));
});

export const me = asyncHandler(async(req,res) => {
    const {id} = req.user;
    const user = await prisma.user.findFirst({where:{
        id
    },select:{id:true,username:true,email:true,createdAt:true}});
    if(!user) throw new ApiError('invalid id',401);
    return res.status(200).json(new ApiResponse(200,'user found succesfully',user))
})