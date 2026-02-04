import Express from "express";
import { orderController } from "./order.controller";
import authGuard from "../../middleware/authGuard";
import { Role } from "generated/prisma/enums";

const orderRouter = Express.Router();

orderRouter.post(
  "/",
  authGuard(Role.CUSTOMER),
  orderController.createOrder,
);

orderRouter.get(
  "/",
  authGuard(Role.CUSTOMER),
  orderController.getUserOrders,
);

orderRouter.get(
  "/all",
  authGuard(Role.ADMIN),
  orderController.getAllOrders,
);

orderRouter.get(
  "/seller",
  authGuard(Role.SELLER),
  orderController.getOrderBySellerId,
);

orderRouter.get(
  "/:id/status",
  authGuard(Role.CUSTOMER),
  orderController.trackOrderStatus,
);

orderRouter.patch(
  "/:id/status",
  authGuard(Role.SELLER, Role.ADMIN),
  orderController.updateOrderStatus,
);

orderRouter.get(
  "/:id",
  authGuard(Role.CUSTOMER, Role.ADMIN, Role.SELLER),
  orderController.getOrderById,
);

export default orderRouter;