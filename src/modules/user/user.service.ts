
import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

interface UserFilters {
  role?: string;
  isActive?: boolean;
  search?: string;
}

const getAllUsers = async (filters: UserFilters) => {
  const whereConditions: any = {};

  // Filter by role
  if (filters.role) {
    whereConditions.role = filters.role as Role;
  }

  // Filter by active status
  if (filters.isActive !== undefined) {
    whereConditions.isActive = filters.isActive;
  }

  // Search by name or email
  if (filters.search) {
    whereConditions.OR = [
      {
        name: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
    ];
  }

  return await prisma.user.findMany({
    where: whereConditions,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isActive: true, 
      emailVerified: true,
      createdAt: true,
      image: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      isActive: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      image: true,
      _count: {
        select: {
          orders: true,
          medicines: true,
          reviews: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const updateUserStatus = async (id: string, isActive: boolean) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new Error("User not found");
  }

  // Prevent admin from banning themselves
  if (user.role === Role.ADMIN && !isActive) {
    throw new Error("Cannot ban admin users");
  }

  return await prisma.user.update({
    where: { id },
    data: {
      isActive, 
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });
};

const updateUserRole = async (id: string, role: string) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new Error("User not found");
  }


  const validRoles = Object.values(Role);
  if (!validRoles.includes(role as Role)) {
    throw new Error(`Invalid role. Must be one of: ${validRoles.join(", ")}`);
  }

  return await prisma.user.update({
    where: { id },
    data: {
      role: role as Role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });
};

const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          orders: true,
          medicines: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Prevent deleting admin users
  if (user.role === Role.ADMIN) {
    throw new Error("Cannot delete admin users");
  }

  // Check if user has orders or medicines
  if (user._count.orders > 0 || user._count.medicines > 0) {
    throw new Error(
      "Cannot delete user with existing orders or medicines. Ban the user instead."
    );
  }

  await prisma.user.delete({
    where: { id },
  });
};

const getUserStatistics = async () => {
  const [
    totalUsers,
    totalCustomers,
    totalSellers,
    totalAdmins,
    activeUsers,
    bannedUsers,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: Role.CUSTOMER } }),
    prisma.user.count({ where: { role: Role.SELLER } }),
    prisma.user.count({ where: { role: Role.ADMIN } }),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { isActive: false } }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    totalUsers,
    byRole: {
      customers: totalCustomers,
      sellers: totalSellers,
      admins: totalAdmins,
    },
    byStatus: {
      active: activeUsers,
      banned: bannedUsers,
    },
    recentUsers,
  };
};

export const userService = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getUserStatistics,
};