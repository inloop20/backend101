import { prisma } from "../config/db.config.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getWorkspaceById = asyncHandler(async(req,res) => {
    const {id} = req.params;
    if(!id) throw new ApiError('workspace id is required',400);
    const workspace = await prisma.workspace.findUnique({where:{id},select:{id:true,name:true,organizationId:true,created_at:true}});
    return res.status(200).json(new ApiResponse(200,'workspace fetched',workspace))
})

export const updateWorkspace = asyncHandler(async(req,res) => {
    const {id} = req.params;
    const {name} = req.body
    if(!id) throw new ApiError('workspace id is required',400);
    const updatedWorkspace = await prisma.workspace.update({where:{id},data:{
        name
    },select:{name:true,id:true}})
    return res.status(200).json(new ApiResponse(200,'workspace updated',updatedWorkspace));

})

export const deleteWorkspace = asyncHandler(async(req,res) => {
    const {id} = req.params;
    if(!id) throw new ApiError('workspace id is required',400);
     await prisma.workspace.delete({where:{id}
    })
    return res.status(200).json(new ApiResponse(200,'workspace deleted',{id}));
})

export const addMember = asyncHandler(async(req,res) => {
    const {id} = req.params;
    const {userId,role} = req.body;
    if(!id) throw new ApiError('workspace id is required',400);

    const userAdded = await prisma.workspaceMember.create({
        data:{
            userId,
            workspaceId:id
        },select:{
            user:{
                select:{
                    username:true,
                    id:true
                },
            },
            workspaceId:true
        }
    })
    return res.status(201).json(new ApiResponse(201,'member added',userAdded));  
})

export const getMembers = asyncHandler(async(req,res) =>{
    const {id} =req.params;
      if(!id) throw new ApiError('workspace id is required',400);
  const workspace = await prisma.workspace.findFirst({
  where: { id },

  select: {
    id: true,
    name: true,

    workspace_member: {
      select: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    },
  },
});
if (!workspace) throw new ApiError("Workspace not found", 404);

return res.status(200).json(new ApiResponse(200,'members fetched',workspace));
})

export const removeMember = asyncHandler(async(req,res) =>{
    const {id,userId} =req.params;
    if(!id) throw new ApiError('workspace id is required',400);
    if(!userId) throw new ApiError('workspace id is required',400);
     await prisma.workspaceMember.delete({where:{workspaceId:id,userId}});
    return res.status(200).json(new ApiResponse(200,'member remove',{workspaceId:id,userId}));
})

export const updateMemberRole = asyncHandler(async(req,res) =>{
    const {id,userId} =req.params;
    const {role} = req.body;
    //todo: update role
})

