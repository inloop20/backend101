import express from "express";
import { deleteFolder, getDocumentsByFolder, updateFolder } from "../controllers/folder.controller.js";
import { createDocument } from "../controllers/document.controller.js";
import validate from "../middleware/validate.middleware.js";
import { updateFolderSchema } from "../schema/folder.schema.js";
import { createDocumentSchema } from "../schema/document.schema.js";
import { checkPermission } from "../middleware/authz.middleware.js";

const folderRouter = express.Router();

folderRouter.patch(
  "/:folderId",
  checkPermission("can_manage", "folder", "folderId"),
  validate(updateFolderSchema),
  updateFolder
);

folderRouter.delete(
  "/:folderId",
  checkPermission("can_manage", "folder", "folderId"),
  deleteFolder
);

folderRouter.get(
  "/:folderId",
  checkPermission("can_view", "folder", "folderId"),
  getDocumentsByFolder
);

folderRouter.post(
  "/:folderId/documents",
  checkPermission("can_manage", "folder", "folderId"),
  validate(createDocumentSchema),
  createDocument
);

export default folderRouter;