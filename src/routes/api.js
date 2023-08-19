import express from "express";
import userController from "../controller/user-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const authRouter = new express.Router();
authRouter.use(authMiddleware);

// USER API
authRouter.get("/api/users/current", userController.getUser);
authRouter.patch("/api/users/current", userController.updateUser);
authRouter.delete("/api/users/logout", userController.logout);

export { authRouter };
