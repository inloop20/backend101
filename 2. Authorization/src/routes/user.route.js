import express from "express";
import validate from "../middleware/validate.middleware.js";
import {
  getUserById,
  updateCurrentUser,
  deleteCurrentUser,
  getUserBySearch,
  getUserWorkSpace,
  getUserTeams,
  getUserOrganizations,
} from "../controllers/user.controller.js";

import { usernameSchema, searchUserSchema } from "../schema/user.schema.js";

const userRouter = express.Router();

userRouter.patch("/me", validate(usernameSchema), updateCurrentUser);

userRouter.delete("/me", deleteCurrentUser);

userRouter.get("/search", validate(searchUserSchema), getUserBySearch);

userRouter.get("/workspaces", getUserWorkSpace);

userRouter.get("/teams", getUserTeams);

userRouter.get("/organizations", getUserOrganizations);

userRouter.get("/:id", getUserById);

export default userRouter;
