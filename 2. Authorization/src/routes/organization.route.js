import express from 'express'
import validate from '../middleware/validate.middleware.js'
import { AddUserBodySchema, orgCreateSchema, UpdateMemberRoleSchema } from '../schema/organization.schema.js';
import { addUser, createOrganization, deleteOrganization,createWorkspace, getOrganizationById, getOrganizationMembers, removeMember, updateMemberRole, updateOrganization, getWorkspaces } from '../controllers/organization.controller.js';
import { nameSchema } from '../schema/workspace.schema.js';

export const organizationRouter = express.Router();

organizationRouter.post('/', validate(orgCreateSchema), createOrganization);


organizationRouter.post('/:id/members', validate(AddUserBodySchema), addUser);
organizationRouter.get('/:id/members', getOrganizationMembers);
organizationRouter.delete('/:id/members/:userId', removeMember);
organizationRouter.patch('/:id/members/:userId', validate(UpdateMemberRoleSchema), updateMemberRole);


organizationRouter.delete('/:id', deleteOrganization);
organizationRouter.get('/:id', getOrganizationById);
organizationRouter.patch('/:id', updateOrganization);

organizationRouter.post('/:id/workspaces',validate(nameSchema),createWorkspace);
organizationRouter.get('/:id/workspaces',getWorkspaces);

