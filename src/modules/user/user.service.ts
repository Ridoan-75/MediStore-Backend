import { UserStatus } from "../../../generated/prisma/enums";
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

const userStatusUpdate = async (id: string, status: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error("User not found");
  }
  return await prisma.user.update({
    where: { id },
    data: {
      status: status as UserStatus,
    },
  });
};



export const userService = {
  getAllUsers,
  userStatusUpdate,
};
