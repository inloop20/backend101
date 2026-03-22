import express from 'express';
import { deleteDocument, getDocument, updateDocument } from '../controllers/document.controller.js';
import validate from '../middleware/validate.middleware.js';
import {updateDocumentSchema} from '../schema/document.schema.js'
import { createComment, getComments } from '../controllers/comment.controller.js';

const documentRouter = express.Router();

documentRouter.get('/:documentId',getDocument);
documentRouter.patch('/:documentId',validate(updateDocumentSchema),updateDocument);
documentRouter.delete('/:documentId',deleteDocument);

documentRouter.get('/:documentId/comments',getComments);
documentRouter.post('/:documentId/comments',createComment);

export default documentRouter