import express from 'express';
import { deleteFolder, getDocumentsByFolder, updateFolder } from '../controllers/folder.controller.js';
import validate from '../middleware/validate.middleware.js';
import {updateFolderSchema} from '../schema/folder.schema.js'
import { createDocument } from '../controllers/document.controller.js';
import { createDocumentSchema } from '../schema/document.schema.js';

const folderRouter = express.Router();

folderRouter.patch('/:folderId',validate(updateFolderSchema),updateFolder);
folderRouter.delete('/:folderId',deleteFolder);
 
folderRouter.post('/:folderId/documents',validate(createDocumentSchema),createDocument);
folderRouter.get('/:folderId',getDocumentsByFolder);

export default folderRouter