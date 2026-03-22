import express from 'express'
import errHandler from './middleware/error.middleware.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import { organizationRouter } from './routes/organization.route.js';
import {workspaceRouter} from './routes/workspace.route.js'
import authenticate from './middleware/auth.middleware.js';
import folderRouter  from './routes/folder.route.js';
import documentRouter  from './routes/document.route.js';
const app = express()

app.use(express.json())

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users',authenticate,userRouter);
app.use('/api/v1/organizations',authenticate,organizationRouter);
app.use('/api/v1/workspaces',authenticate,workspaceRouter);
app.use('/api/v1/folders',authenticate,folderRouter);
app.use('/api/v1/documents',authenticate,documentRouter);
app.use(errHandler)

export default app;