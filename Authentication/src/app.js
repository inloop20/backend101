import express from 'express';
import errorHandler from './middleware/error.middleware.js'
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser'
const app = express();

app.use(express.json())
app.use(cookieParser())
app.use("/api/v1",authRouter)

app.use(errorHandler)

export default app;

