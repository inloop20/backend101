import express from 'express'
import authenticate from '../middleware/auth.middleware.js'
import validate from '../middleware/validate.middleware.js'
import { AddUserBodySchema, orgCreateSchema, UpdateMemberRoleSchema } from '../schema/organization.schema.js';
import { addUser, createOrganization, deleteOrganization,createWorkspace, getOrganizationById, getOrganizationMembers, removeMember, updateMemberRole, updateOrganization, getWorkspaces } from '../controllers/organization.controller.js';
import { nameSchema } from '../schema/workspace.schema.js';

export const organizationRouter = express.Router();

organizationRouter.post('/', authenticate, validate(orgCreateSchema), createOrganization);


organizationRouter.post('/:id/members', authenticate, validate(AddUserBodySchema), addUser);
organizationRouter.get('/:id/members', authenticate, getOrganizationMembers);
organizationRouter.delete('/:id/members/:userId', authenticate, removeMember);
organizationRouter.patch('/:id/members/:userId', authenticate, validate(UpdateMemberRoleSchema), updateMemberRole);


organizationRouter.delete('/:id', authenticate, deleteOrganization);
organizationRouter.get('/:id', authenticate, getOrganizationById);
organizationRouter.patch('/:id', authenticate, updateOrganization);

organizationRouter.post('/:id/workspaces',authenticate,validate(nameSchema),createWorkspace);
organizationRouter.get('/:id/workspaces',authenticate,getWorkspaces);

