import { prisma } from "../../lib/prisma";
const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            status: true,
        },
    });
};
const userStatusUpdate = async (id, status) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw new Error("User not found");
    }
    return await prisma.user.update({
        where: { id },
        data: {
            status: status,
        },
    });
};
export const userService = {
    getAllUsers,
    userStatusUpdate,
};
//# sourceMappingURL=user.service.js.map