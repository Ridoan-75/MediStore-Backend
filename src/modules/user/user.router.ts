import Express from "express";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";
import authGuard from "../../middleware/authGuard";

const userRouter = Express.Router();

// Get all users with filters (Admin only)
userRouter.get(
  "/",
  authGuard(Role.ADMIN), // ✅ Changed
  userController.getAllUsers
);

// Get user statistics (Admin only)
userRouter.get(
  "/statistics",
  authGuard(Role.ADMIN), // ✅ Added
  userController.getUserStatistics
);

// Get user by ID (Admin only)
userRouter.get(
  "/:id",
  authGuard(Role.ADMIN), // ✅ Added
  userController.getUserById
);

// Update user status - ban/unban (Admin only)
userRouter.patch(
  "/:id/status",
  authGuard(Role.ADMIN), // ✅ Changed
  userController.updateUserStatus // ✅ Fixed name
);

// Update user role (Admin only)
userRouter.patch(
  "/:id/role",
  authGuard(Role.ADMIN), // ✅ Added
  userController.updateUserRole
);

// Delete user (Admin only)
userRouter.delete(
  "/:id",
  authGuard(Role.ADMIN), // ✅ Added
  userController.deleteUser
);

export default userRouter;