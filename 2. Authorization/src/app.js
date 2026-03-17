import express from 'express'
import errHandler from './middleware/error.middleware.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import { organizationRouter } from './routes/organization.route.js';

const app = express()

app.use(express.json())

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/organizations',organizationRouter);


app.use(errHandler)

export default app;