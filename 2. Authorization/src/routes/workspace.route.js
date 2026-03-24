import express from "express";
import {
  addMember,
  deleteWorkspace,
  getMembers,
  getWorkspaceById,
  removeMember,
  updateMemberRole,
  updateWorkspace,
} from "../controllers/workspace.controller.js";

import {
  addMemberSchema,
  nameSchema,
  UpdateMemberRoleSchema,
} from "../schema/workspace.schema.js";

import validate from "../middleware/validate.middleware.js";
import { createFolder, getFolders } from "../controllers/folder.controller.js";

import { createFolderSchema } from "../schema/folder.schema.js";
import { checkPermission } from "../middleware/authz.middleware.js";

export const workspaceRouter = express.Router();

workspaceRouter.get(
  "/:id/members",
  checkPermission("can_view", "workspace", "id"),
  getMembers,
);

workspaceRouter.post(
  "/:id/members",
  checkPermission("can_manage", "workspace", "id"),
  validate(addMemberSchema),
  addMember,
);

workspaceRouter.patch(
  "/:id/members/:userId",
  checkPermission("can_manage", "workspace", "id"),
  validate(UpdateMemberRoleSchema),
  updateMemberRole,
);

workspaceRouter.delete(
  "/:id/members/:userId",
  checkPermission("can_manage", "workspace", "id"),
  removeMember,
);

workspaceRouter.get(
  "/:id",
  checkPermission("can_view", "workspace", "id"),
  getWorkspaceById,
);

workspaceRouter.patch(
  "/:id",
  checkPermission("can_manage", "workspace", "id"),
  validate(nameSchema),
  updateWorkspace,
);

workspaceRouter.delete(
  "/:id",
  checkPermission("can_manage", "workspace", "id"),
  deleteWorkspace,
);

workspaceRouter.post(
  "/:id/folder",
  checkPermission("can_manage", "workspace", "id"),
  validate(createFolderSchema),
  createFolder,
);

workspaceRouter.get(
  "/:id/folders",
  checkPermission("can_view", "workspace", "id"),
  getFolders,
);
