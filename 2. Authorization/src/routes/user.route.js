import express from "express";
import authenticate from "../middleware/auth.middleware.js";
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



userRouter.patch(
  "/me",
  authenticate,
  validate(usernameSchema),
  updateCurrentUser,
);

userRouter.delete("/me", authenticate, deleteCurrentUser);

userRouter.get(
  "/search",
  authenticate,
  validate(searchUserSchema, "query"),
  getUserBySearch,
);

userRouter.get("/workspace", authenticate, getUserWorkSpace);

userRouter.get("/team", authenticate, getUserTeams);

userRouter.get("/organization", authenticate, getUserOrganizations);

userRouter.get("/:id", authenticate, getUserById);

export default userRouter;
