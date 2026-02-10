import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { Role } from "../../../generated/prisma/enums";
import { paginationSort } from "../../helpers/pagination-sort";
import { sendJSON } from "../../helpers/send-json";
import { userServices } from "./user-services";

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      throw createError(400, "Bad Request: Missing required fields");
    }

    // make role uppercase to match enum
    const roleUpper = role.toUpperCase();

    // validate role
    if (![Role.CUSTOMER, Role.SELLER].includes(roleUpper)) {
      throw createError(400, "Bad Request: Invalid role");
    }
    const data = await userServices.signup({
      name,
      email,
      password,
      role: roleUpper,
    });
    return sendJSON(true, res, 201, "User signed up successfully", data);
  } catch (error) {
    next(error);
  }
};

const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError(400, "Bad Request: User ID is missing");
    }
    if (typeof userId !== "string") {
      throw createError(400, "Bad Request: User ID must be a string");
    }
    const data = await userServices.me(userId);
    return sendJSON(true, res, 200, "User fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, sortBy, sortOrder, skip } = paginationSort(_req.query);
    const { data, pagination } = await userServices.getAllUsers({
      page,
      limit,
      sortBy,
      sortOrder,
      skip,
    });
    return sendJSON(
      true,
      res,
      200,
      "Users fetched successfully",
      data,
      pagination,
    );
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw createError(400, "Bad Request: User ID is missing");
    }
    if (typeof userId !== "string") {
      throw createError(400, "Bad Request: User ID must be a string");
    }
    const data = await userServices.getUserById(userId);
    return sendJSON(true, res, 200, "User fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw createError(400, "Bad Request: User ID is missing");
    }
    if (typeof userId !== "string") {
      throw createError(400, "Bad Request: User ID must be a string");
    }
    const data = await userServices.deleteUserById(userId);
    return sendJSON(true, res, 200, "User deleted successfully", data);
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw createError(400, "Bad Request: User ID is missing");
    }
    if (typeof userId !== "string") {
      throw createError(400, "Bad Request: User ID must be a string");
    }
    const updateData = req.body;

    // prevent updating restricted fields
    delete updateData.id;
    delete updateData.email;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    const data = await userServices.updateUserById(userId, updateData);
    return sendJSON(true, res, 200, "User updated successfully", data);
  } catch (error) {
    next(error);
  }
};

export const userControllers = {
  me,
  signup,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
};
