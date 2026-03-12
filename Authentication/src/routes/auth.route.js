import express from 'express'
import { login, logout, logoutAll, refreshTokens, register,me } from '../controllers/auth.controller.js'
import {registrationSchema, loginSchema} from '../schema/auth.schema.js'
import validate from '../middleware/validate.middleware.js'
import authenticate from '../middleware/auth.middleware.js'

const authRouter = express.Router()

authRouter.post('/register',validate(registrationSchema),register);
authRouter.post('/login',validate(loginSchema),login);
authRouter.post('/logout',authenticate,logout);
authRouter.post('/logout-all',authenticate,logoutAll);
authRouter.post('/refresh',refreshTokens);
authRouter.get('/me',authenticate,me);

export default authRouter