import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { paginationSort } from "../../helpers/pagination-sort";
import { sendJSON } from "../../helpers/send-json";
import { TCartPayload } from "../../types";
import { cartServices } from "./cart-services";

const createCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError(400, "Bad Request: User ID is missing");
    }
    if (typeof userId !== "string") {
      throw createError(400, "Bad Request: User ID must be a string");
    }

    const payload: TCartPayload = req.body;
    const data = await cartServices.createCart(userId, payload);
    return sendJSON(true, res, 201, "Cart created/updated successfully", data);
  } catch (error) {
    next(error);
  }
};

const getCurrentUserCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError(400, "Bad Request: User ID is missing");
    }
    if (typeof userId !== "string") {
      throw createError(400, "Bad Request: User ID must be a string");
    }

    const { page, limit, skip, sortBy, sortOrder } = paginationSort(req.query);

    const { data, pagination } = await cartServices.getCurrentUserCart(userId, {
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    return sendJSON(
      true,
      res,
      200,
      "Carts fetched successfully",
      data,
      pagination,
    );
  } catch (error) {
    next(error);
  }
};

const decrementMedicineQuantityInCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError(400, "Bad Request: User ID is missing");
    }
    if (typeof userId !== "string") {
      throw createError(400, "Bad Request: User ID must be a string");
    }
    const medicineId = req.params.medicineId;
    if (!medicineId) {
      throw createError(400, "Bad Request: Medicine ID is missing");
    }
    if (typeof medicineId !== "string") {
      throw createError(400, "Bad Request: Medicine ID must be a string");
    }
    const quantity = Number(req.body.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      throw createError(400, "Bad Request: Quantity must be a positive number");
    }
    const data = await cartServices.decrementMedicineQuantityInCart(
      userId,
      medicineId,
      quantity,
    );
    return sendJSON(
      true,
      res,
      200,
      "Medicine quantity decremented successfully",
      data,
    );
  } catch (error) {
    next(error);
  }
};

const deleteCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError(400, "Bad Request: User ID is missing");
    }
    if (typeof userId !== "string") {
      throw createError(400, "Bad Request: User ID must be a string");
    }
    const { medicineId } = req.body;
    if (!medicineId) {
      throw createError(400, "Bad Request: Medicine ID is missing");
    }
    if (typeof medicineId !== "string") {
      throw createError(400, "Bad Request: Medicine ID must be a string");
    }
    await cartServices.deleteCartItem(userId, medicineId);
    return sendJSON(true, res, 200, "Cart item deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const cartControllers = {
  createCart,
  getCurrentUserCart,
  decrementMedicineQuantityInCart,
  deleteCartItem,
};
