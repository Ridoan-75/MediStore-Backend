import { User } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { PaginationOptions } from "../../types";

const me = async (id: string) => {
  const data = await prisma.user.findUniqueOrThrow({
    where: { id },
  });
  return data;
};

const getAllUsers = async ({
  page,
  limit,
  sortBy,
  sortOrder,
  skip,
}: PaginationOptions) => {
  const data = await prisma.user.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.user.count();
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getUserById = async (id: string) => {
  const data = await prisma.user.findUniqueOrThrow({
    where: { id },
  });
  return data;
};

const deleteUserById = async (id: string) => {
  const data = await prisma.user.delete({
    where: { id },
  });
  return data;
};

const updateUserById = async (
  id: string,
  data: Partial<Omit<User, "id" | "createdAt" | "updatedAt" | "email">>,
) => {
  const updatedUser = await prisma.user.update({
    where: { id },
    data,
  });
  return updatedUser;
};

const signup = async (payload: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const { role, name, email, password } = payload;

  // create user by better-auth without role
  const userWithoutRole = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  // update role using prisma
  return await prisma.user.update({
    where: {
      id: userWithoutRole.user.id,
    },
    data: {
      role,
    },
  });
};

export const userServices = {
  me,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  signup,
};
