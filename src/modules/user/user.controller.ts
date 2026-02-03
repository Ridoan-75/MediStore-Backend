import { Request, Response } from "express";
import { userService } from "./user.service";


const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role, isActive, search } = req.query;

    const filters = {
      role: role as string | undefined,
      isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
      search: search as string | undefined,
    };

    const users = await userService.getAllUsers(filters);

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await userService.getUserById(id);

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error: any) {
    console.error("Get user error:", error);
    
    const statusCode = error.message.includes("not found") ? 404 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to retrieve user",
    });
  }
};

const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean value",
      });
    }

    const updatedUser = await userService.updateUserStatus(id, isActive);

    res.status(200).json({
      success: true,
      message: `User ${isActive ? "activated" : "banned"} successfully`,
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Update user status error:", error);
    
    const statusCode = error.message.includes("not found") ? 404 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update user status",
    });
  }
};

const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const validRoles = ["CUSTOMER", "SELLER", "ADMIN"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Role must be one of: ${validRoles.join(", ")}`,
      });
    }

    const updatedUser = await userService.updateUserRole(id, role);

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Update user role error:", error);
    
    const statusCode = error.message.includes("not found") ? 404 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update user role",
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await userService.deleteUser(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete user error:", error);
    
    const statusCode = error.message.includes("not found") 
      ? 404 
      : error.message.includes("Cannot delete") 
      ? 403 
      : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to delete user",
    });
  }
};

const getUserStatistics = async (req: Request, res: Response) => {
  try {
    const stats = await userService.getUserStatistics();

    res.status(200).json({
      success: true,
      message: "User statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Get statistics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user statistics",
    });
  }
};

export const userController = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getUserStatistics,
};