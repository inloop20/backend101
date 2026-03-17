import { prisma } from "../config/db.config.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'


export const createOrganization = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;
  const org = await prisma.organization.create({
    data: {
      name,
      organization_member: {
        create: {
          userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      organization_member: {
        select: {
          userId: true, 
        },
      },
    },
  });

  res.status(201).json(new ApiResponse(201, "Organization created", org));
});