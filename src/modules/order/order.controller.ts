import { Request, Response } from "express";
import { orderService } from "./order.service";
import { OrderStatus } from "../../../generated/prisma/enums";

const createOrder = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!req.body.phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!req.body.shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    if (!req.body.orderItems || !Array.isArray(req.body.orderItems)) {
      return res.status(400).json({
        success: false,
        message: "Order items are required and must be an array",
      });
    }

    if (req.body.orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    //  Validate each order item
    for (const item of req.body.orderItems) {
      if (!item.medicineId) {
        return res.status(400).json({
          success: false,
          message: "Each order item must have medicineId",
        });
      }
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Each order item must have a valid quantity",
        });
      }
    }

    const payload = {
      phone: req.body.phone,
      shippingAddress: req.body.shippingAddress,
      orderItems: req.body.orderItems.map((item: any) => ({
        medicineId: item.medicineId,
        quantity: item.quantity,
      })),
    };

    const result = await orderService.createOrder(payload, user?.id as string);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Order creation error:", error);

    if (error instanceof Error) {
      const statusCode = error.message.includes("not found") ? 404 : 400;
      return res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getUserOrders = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const orders = await orderService.getUserOrders(user?.id as string);

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
    });
  }
};

const getOrderById = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const order = await orderService.getOrderById(
      id as string,
      user?.id as string,
    );

    res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    if (error instanceof Error) {
      const statusCode = error.message.includes("not found")
        ? 404
        : error.message.includes("Unauthorized")
          ? 403
          : 500;

      return res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to retrieve order",
    });
  }
};

const getOrderBySellerId = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const orders = await orderService.getOrderBySellerId(user?.id as string);
    res.status(200).json({
      success: true,
      message: "Seller orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Get seller orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve seller orders",
    });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const result = await orderService.updateOrderStatus(
      id as string,
      status as OrderStatus,
    );

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    if (error instanceof Error) {
      const statusCode = error.message.includes("not found")
        ? 404
        : error.message.includes("Invalid")
          ? 400
          : 500;

      return res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({
      success: true,
      message: "All orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve all orders",
    });
  }
};

const trackOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const order = await orderService.trackOrderStatus(id as string, user?.id as string);

    res.status(200).json({
      success: true,
      message: "Order status retrieved successfully",
      data: order,
    });
  }
  catch (error) {
    console.error("Track order status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve order status",
    });
  }
};

export const orderController = {
  createOrder,
  getUserOrders,
  getOrderById,
  getOrderBySellerId,
  updateOrderStatus,
  getAllOrders,
  trackOrderStatus
};
