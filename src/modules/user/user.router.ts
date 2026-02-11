import Express from "express";
import { userController } from "./user.controller";
import authGuard, { UserRole } from "../../middlewares/authGuard";

const userRouter = Express.Router();

userRouter.get("/", authGuard(UserRole.ADMIN), userController.getAllUsers);

userRouter.patch(
  "/:id/status",
  authGuard(UserRole.ADMIN),
  userController.userStatusUpdate,
);

export default userRouter;
