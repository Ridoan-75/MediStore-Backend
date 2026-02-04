import Express from "express";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";
import authGuard from "../../middleware/authGuard";

const userRouter = Express.Router();

userRouter.get("/", authGuard(Role.ADMIN), userController.getAllUsers);

userRouter.get(
  "/statistics",
  authGuard(Role.ADMIN),
  userController.getUserStatistics,
);

userRouter.get("/:id", authGuard(Role.ADMIN), userController.getUserById);

userRouter.patch(
  "/:id/status",
  authGuard(Role.ADMIN),
  userController.updateUserStatus,
);

userRouter.patch(
  "/:id/role",
  authGuard(Role.ADMIN),
  userController.updateUserRole,
);

userRouter.delete("/:id", authGuard(Role.ADMIN), userController.deleteUser);

export default userRouter;
