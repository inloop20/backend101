import { prisma } from "../config/db.config.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'


export const createOrganization = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if(!userExists) throw new ApiError('user doesnt exist',404);
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

export const getOrganizationById = asyncHandler(async(req,res) => {
  const id = req.params.id;
  if(!id) throw new ApiError("organization id is required",400);

  const organization = await prisma.organization.findUnique({
    where:{
      id
    },select:{
      id:true,
      name:true,

    }
  })

   if (!organization) {
    throw new ApiError("Organization not found", 404);
  }
  return res.status(200).json(new ApiResponse(200,'organizations fetched',organization));
})

export const addUser = asyncHandler(async(req,res) => {
  const id = req.params.id;
  const {userId} = req.body;
  if(!id) throw new ApiError("organization id is required",400);
  const orgExist = await prisma.organization.findUnique({
    where:{id},select:{id:true}
  })
  if(!orgExist) throw new ApiError('organization not found',404);
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if(!userExists) throw new ApiError('user doesnt exist',404);
  
  const userJoined = await prisma.organizationMember.create({
    data:{
      organizationId:id,
      userId:userId
    },select:{organizationId:true,userId:true}
  })

  return res.status(201).json(new ApiResponse(201,'user joined',userJoined));
})

export const getOrganizationMembers =  asyncHandler(async(req,res) =>{
  const id = req.params.id;
  if(!id) throw new ApiError("organization id is required",400);
  const getMembers = await prisma.organizationMember.findMany({
    where:{
      organizationId:id
    },
    select:{userId:true,user:{select:{username:true}}}
  })
  return res.status(200).json(new ApiResponse(200,'organizations members fetched',getMembers));
})

export const deleteOrganization = asyncHandler(async(req,res) => {
  const id = req.params.id;
  if(!id) throw new ApiError("organization id is required",400);
  await prisma.organization.delete({
    where:{id}
  })
  return res.status(200).json(new ApiResponse(200,'organization deleted successfully',id));
})

export const updateOrganization = asyncHandler(async(req,res) => {
  const id = req.params.id
  if(!id) throw new ApiError("organization id is required",400);
  const {name} = req.body;
  const updatedOrg = await prisma.organization.update({
    where:{id},
    data:{name},
    select:{id:true,name:true}
  })
  return res.status(200).json(new ApiResponse(200,'name updated',updatedOrg))
})

export const removeMember = asyncHandler(async(req,res) => {
  const {id,userId} = req.params
  await prisma.organizationMember.delete({
    where:{userId_organizationId:{userId,organizationId:id}},select:{userId:true}
  })
  return res.status(200).json(new ApiResponse(200,'member removed',{userId}));
})

export const updateMemberRole = asyncHandler(async(req,res) => {
  const {id,userId} = req.params;
  if(!id || !userId) throw new ApiError("organization and user id is required",400);
  
  const {role} = req.body;
  
    //todo update role in openfga

  return res.status(200).json(new ApiResponse(200,'role updated',{id,userId,role}));
})

