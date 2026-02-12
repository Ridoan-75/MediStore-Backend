import { userService } from "./user.service";
const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users,
        });
    }
    catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve users",
        });
    }
};
const userStatusUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedUser = await userService.userStatusUpdate(id, status);
        res.status(200).json({
            success: true,
            message: "User status updated successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        console.error("Update user status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update user status",
        });
    }
};
export const userController = {
    getAllUsers,
    userStatusUpdate,
};
//# sourceMappingURL=user.controller.js.map