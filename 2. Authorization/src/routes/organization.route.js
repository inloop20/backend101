import express from 'express'
import validate from '../middleware/validate.middleware.js'
import {
  AddUserBodySchema,
  orgCreateSchema,
  UpdateMemberRoleSchema,
} from "../schema/organization.schema.js";
import { addUser, createOrganization, deleteOrganization,createWorkspace, getOrganizationById, getOrganizationMembers, removeMember, updateMemberRole, updateOrganization, getWorkspaces } from '../controllers/organization.controller.js';
import { nameSchema } from '../schema/workspace.schema.js';
import { checkPermission } from "../middleware/authz.middleware.js";

export const organizationRouter = express.Router();

organizationRouter.post('/', validate(orgCreateSchema), createOrganization);

organizationRouter.post(
  "/:id/members",
  validate(AddUserBodySchema),
  checkPermission("can_manage", "organization", "id"),
  addUser,
);

organizationRouter.get(
  "/:id/members",
  checkPermission("can_view", "organization", "id"),
  getOrganizationMembers,
);

organizationRouter.delete(
  "/:id/members/:userId",
  checkPermission("can_manage", "organization", "id"),
  removeMember,
);

organizationRouter.patch(
  "/:id/members/:userId",
  checkPermission("can_manage", "organization", "id"),
  validate(UpdateMemberRoleSchema),
  updateMemberRole,
);

organizationRouter.delete(
  "/:id",
  checkPermission("can_manage", "organization", "id"),
  deleteOrganization,
);

organizationRouter.get(
  "/:id",
  checkPermission("can_view", "organization", "id"),
  getOrganizationById,
);

organizationRouter.patch(
  "/:id",
  checkPermission("can_manage", "organization", "id"),
  updateOrganization,
);

organizationRouter.post(
  "/:id/workspaces",
  checkPermission("can_manage", "organization", "id"),
  validate(nameSchema),
  createWorkspace,
);

organizationRouter.get(
  "/:id/workspaces",
  checkPermission("can_view", "organization", "id"),
  getWorkspaces,
);
