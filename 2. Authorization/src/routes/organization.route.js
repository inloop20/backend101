import express from 'express'
import authenticate from '../middleware/auth.middleware.js'
import validate from '../middleware/validate.middleware.js'
import { AddUserBodySchema, orgCreateSchema, UpdateMemberRoleSchema } from '../schema/organization.schema.js';
import { addUser, createOrganization, deleteOrganization, getOrganizationById, getOrganizationMembers, removeMember, updateMemberRole, updateOrganization } from '../controllers/organization.controller.js';

export const organizationRouter = express.Router();

organizationRouter.post('/', authenticate, validate(orgCreateSchema), createOrganization);


organizationRouter.post('/:id/members', authenticate, validate(AddUserBodySchema), addUser);
organizationRouter.get('/:id/members', authenticate, getOrganizationMembers);
organizationRouter.delete('/:id/members/:userId', authenticate, removeMember);
organizationRouter.patch('/:id/members/:userId', authenticate, validate(UpdateMemberRoleSchema), updateMemberRole);


organizationRouter.delete('/:id', authenticate, deleteOrganization);
organizationRouter.get('/:id', authenticate, getOrganizationById);
organizationRouter.patch('/:id', authenticate, updateOrganization);

