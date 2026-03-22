import { prisma } from "../config/db.config.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const createFolder = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  if (!workspaceId) throw new ApiError("workspace id is required", 400);
  const { name, parentFolderId } = req.body;

  const folderExist = await prisma.folder.findUnique({
    where: {
      workspaceId_parentFolderId_name: {
        workspaceId,
        parentFolderId: parentFolderId ?? null,
        name,
      },
    },
    select: { id: true },
  });
  if (folderExist) {
    throw new ApiError("Folder already exists", 409);
  }
  const newFolder = await prisma.folder.create({
    data: {
      name,
      parentFolderId: parentFolderId ?? null,
      workspaceId,
    },
    select: {
      id: true,
      name: true,
      parentFolderId: true,
      workspaceId: true,
      created_at: true,
    },
  });
  return res
    .status(201)
    .json(new ApiResponse(201, "folder created", newFolder));
});

export const getFolders = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  if (!workspaceId) throw new ApiError("workspace id is required", 400);
  const folders = await prisma.folder.findMany({
    where: { workspaceId },
    select: {
      id: true,
      name: true,
      parentFolderId: true,
      created_at: true,
    },
    orderBy: {
      created_at: "asc",
    },
  });
  return res.status(200).json(new ApiResponse(200, "folders fetched", folders));
});

export const updateFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  if (!folderId) throw new ApiError("folder id is required", 400);
  const { name } = req.body;

  const exists = await prisma.folder.findFirst({
    where: {
      workspaceId,
      parentFolderId: parentFolderId ?? null,
      name,
      id: { not: folderId },
    },
  });

  if (exists) {
    throw new ApiError("Folder already exists", 409);
  }
  const updatedFolder = await prisma.folder.update({
    where: { id: folderId },
    data: {
      name,
    },
    select: { id: true, name: true },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "folder name updated", updatedFolder));
});

export const deleteFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  if (!folderId) throw new ApiError("folder id is required", 400);

  await prisma.folder.delete({
    where: { id: folderId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "folder deleted", { folderId }));
});

export const getDocumentsByFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;

  if (!folderId) {
    throw new ApiError("folder id is required", 400);
  }

  const documents = await prisma.document.findMany({
    where: { folderId },
    select: {
      id: true,
      title: true,
      created_at: true,
    },
    orderBy: {
      created_at: "asc",
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "documents fetched", documents));
});
