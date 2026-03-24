import express from 'express';
import { deleteDocument, getDocument, updateDocument } from '../controllers/document.controller.js';
import validate from '../middleware/validate.middleware.js';
import {updateDocumentSchema} from '../schema/document.schema.js'
import { createComment, getComments } from '../controllers/comment.controller.js';

import {
  deleteDocument,
  getDocument,
  updateDocument,
} from "../controllers/document.controller.js";

import validate from "../middleware/validate.middleware.js";
import { updateDocumentSchema } from "../schema/document.schema.js";

import { createComment, getComments } from '../controllers/comment.controller.js'

import { checkPermission } from "../middleware/authz.middleware.js";

const documentRouter = express.Router();


documentRouter.get('/:documentId',checkPermission("can_view", "document", "documentId"),getDocument)

documentRouter.patch(
  "/:documentId",
  checkPermission("can_manage", "document", "documentId"),
  validate(updateDocumentSchema),
  updateDocument
);

documentRouter.delete(
  "/:documentId",
  checkPermission("can_manage", "document", "documentId"),
  deleteDocument
);


documentRouter.get(
  "/:documentId/comments",
  checkPermission("can_view", "document", "documentId"),
  getComments
);

documentRouter.post(
  "/:documentId/comments",
  checkPermission("can_view", "document", "documentId"),
  createComment
);

export default documentRouter;