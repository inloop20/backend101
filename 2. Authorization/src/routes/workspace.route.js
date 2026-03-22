import express from 'express';
import { addMember, deleteWorkspace, getMembers, getWorkspaceById, removeMember, updateMemberRole, updateWorkspace } from '../controllers/workspace.controller.js';
import {addMemberSchema, nameSchema, UpdateMemberRoleSchema} from '../schema/workspace.schema.js'
import validate from '../middleware/validate.middleware.js'
import { createFolder, getFolders } from '../controllers/folder.controller.js';
import {createFolderSchema} from '../schema/folder.schema.js'

export const workspaceRouter = express.Router();

workspaceRouter.get('/:id/members',getMembers)
workspaceRouter.post('/:id/members',validate(addMemberSchema),addMember)
workspaceRouter.patch('/:id/members/:userId',validate(UpdateMemberRoleSchema),updateMemberRole)
workspaceRouter.delete('/:id/members/:userId',removeMember)

workspaceRouter.get('/:id',getWorkspaceById);
workspaceRouter.patch('/:id',validate(nameSchema),updateWorkspace);
workspaceRouter.delete('/:id',deleteWorkspace);

workspaceRouter.post('/:id/folder',validate(createFolderSchema),createFolder);
workspaceRouter.get('/:id/folders',getFolders);

