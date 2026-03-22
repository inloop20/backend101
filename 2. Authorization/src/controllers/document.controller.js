import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { prisma } from "../config/db.config.js";

export const createDocument = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  if (!folderId) throw new ApiError("folder id is required", 400);

  const { title, content } = req.body;

  const document = await prisma.document.create({
    data: {
      title,
      content,
      folderId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      folderId: true,
      created_at: true,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "document created", document));
});

export const getDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  if (!documentId) throw new ApiError("document id is required", 400);

  const document = await prisma.document.findUnique({
    where: { id: documentId },
    select: {
      id: true,
      folderId: true,
      title: true,
      created_at: true,
      updated_at: true,
    },
  });

  if (!document) {
    throw new ApiError("Document not found", 404);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "document fetched", document));
});

export const updateDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  if (!documentId) throw new ApiError("document id is required", 400);

  const { title, content } = req.body;

  const updatedDocument = await prisma.document.update({
    where: { id: documentId },
    data: {
      title,
      content,
    },
    select: {
      id: true,
      title: true,
      content: true,
      updated_at: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "document updated", updatedDocument));
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  if (!documentId) throw new ApiError("document id is required", 400);

  await prisma.document.delete({
    where: { id: documentId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "document deleted", { documentId }));
});

export const createComment = asyncHandler(async(req,res) =>{
  const {documentId} = req.params;
  const {content} = req.body;

  const comment = await prisma.comment.create({
    data:{
      content,
      authorId:req.user.id,
      documentId
    },select:{id:true,content:true,authorId:true,author:{select:{username:true}},documentId:true,created_at:true}
  })
  return res.status(201).json(new ApiResponse(201,'comment created',{comment}));
})


