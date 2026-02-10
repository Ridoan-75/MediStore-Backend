import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { OrderStatus } from "../../../generated/prisma/client";
import { paginationSort } from "../../helpers/pagination-sort";
import { sendJSON } from "../../helpers/send-json";
import { TOrderPayload } from "../../types";
import { orderServices } from "./order-services";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload: TOrderPayload = req.body || {};
    const userId = req.user?.id;

    if (!userId) {
      throw createError(401, "Unauthorized: User ID is missing");
    }

    if (
      !payload.items ||
      !Array.isArray(payload.items) ||
      payload.items.length === 0
    ) {
      throw createError(
        400,
        "Bad Request: Order must include at least one item.",
      );
    }

    const data = await orderServices.createOrder(payload, userId);
    return sendJSON(true, res, 201, "Order created successfully", data);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      throw createError(400, "Bad Request: Order ID is missing");
    }
    if (typeof orderId !== "string") {
      throw createError(400, "Bad Request: Order ID must be a string");
    }
    const { status } = req.body;

    // check valid status
    const validStatuses = Object.values(OrderStatus);
    if (!validStatuses.includes(status)) {
      throw createError(400, "Bad Request: Invalid order status");
    }

    const data = await orderServices.updateOrderStatus(orderId, status);
    return sendJSON(true, res, 200, "Order status updated successfully", data);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      throw createError(400, "Bad Request: Order ID is missing");
    }
    if (typeof orderId !== "string") {
      throw createError(400, "Bad Request: Order ID must be a string");
    }
    const data = await orderServices.getOrderById(orderId);
    return sendJSON(true, res, 200, "Order fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

const cancelOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      throw createError(400, "Bad Request: Order ID is missing");
    }
    if (typeof orderId !== "string") {
      throw createError(400, "Bad Request: Order ID must be a string");
    }
    const data = await orderServices.cancelOrderStatus(orderId);
    return sendJSON(true, res, 200, "Order cancelled successfully", data);
  } catch (error) {
    next(error);
  }
};

const getAllOrdersOfCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, sortBy, sortOrder, skip } = paginationSort(req.query);
    const user = req.user;

    if (!user) {
      throw createError(400, "Bad Request: User ID is missing");
    }

    console.log("User in getAllOrdersOfCustomer:", user);
    console.log("******************************************");

    if (user.role !== "CUSTOMER") {
      throw createError(
        403,
        "Forbidden: Only customers can access their orders",
      );
    }

    const status = req.query.status as OrderStatus | undefined;

    const { data, pagination } = await orderServices.getAllOrdersOfCustomer({
      status,
      userId: user.id,
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
      "Orders fetched successfully",
      data,
      pagination,
    );
  } catch (error) {
    next(error);
  }
};

const getAllOrdersOfSeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, sortBy, sortOrder, skip } = paginationSort(req.query);
    const user = req.user;

    if (!user) {
      throw createError(400, "Bad Request: User ID is missing");
    }
    if (user.role !== "SELLER") {
      throw createError(403, "Forbidden: Only sellers can access their orders");
    }

    const status = req.query.status as OrderStatus | undefined;

    const { data, pagination } = await orderServices.getAllOrdersOfSeller({
      status,
      userId: user.id,
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
      "Orders fetched successfully",
      data,
      pagination,
    );
  } catch (error) {
    next(error);
  }
};

export const orderControllers = {
  createOrder,
  getOrderById,
  getAllOrdersOfCustomer,
  updateOrderStatus,
  cancelOrderStatus,
  getAllOrdersOfSeller,
};
