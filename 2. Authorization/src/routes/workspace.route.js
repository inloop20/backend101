import express from 'express';
import authenticate from '../middleware/auth.middleware.js';
import { addMember, deleteWorkspace, getMembers, getWorkspaceById, removeMember, updateMemberRole, updateWorkspace } from '../controllers/workspace.controller.js';
import {addMemberSchema, nameSchema, UpdateMemberRoleSchema} from '../schema/workspace.schema.js'
import validate from '../middleware/validate.middleware.js'

export const workspaceRouter = express.Router();

workspaceRouter.get('/:id/members',authenticate,getMembers)
workspaceRouter.post('/:id/members',authenticate,validate(addMemberSchema),addMember)
workspaceRouter.patch('/:id/members/:userId',authenticate,validate(UpdateMemberRoleSchema),updateMemberRole)
workspaceRouter.delete('/:id/members/:userId',authenticate,removeMember)

workspaceRouter.get('/:id',authenticate,getWorkspaceById);
workspaceRouter.patch('/:id',authenticate,validate(nameSchema),updateWorkspace);
workspaceRouter.delete('/:id',authenticate,deleteWorkspace);

