import Express from "express";
import { orderController } from "./order.controller";
import authGuard from "../../middleware/authGuard";
import { Role } from "../../../generated/prisma/enums";



const orderRouter = Express.Router();

orderRouter.post(
  "/",
  authGuard(Role.CUSTOMER), // ✅ Changed
  orderController.createOrder,
);

orderRouter.get(
  "/",
  authGuard(Role.CUSTOMER), // ✅ Changed
  orderController.getUserOrders,
);

orderRouter.get(
  "/all",
  authGuard(Role.ADMIN), // ✅ Changed
  orderController.getAllOrders,
);

orderRouter.get(
  "/seller",
  authGuard(Role.SELLER), // ✅ Changed
  orderController.getOrderBySellerId,
);

orderRouter.get(
  "/:id/status",
  authGuard(Role.CUSTOMER), // ✅ Changed
  orderController.trackOrderStatus,
);

orderRouter.get(
  "/:id",
  authGuard(Role.CUSTOMER, Role.ADMIN, Role.SELLER), // ✅ Changed
  orderController.getOrderById,
);

orderRouter.patch(
  "/:id/status",
  authGuard(Role.SELLER, Role.ADMIN), // ✅ Changed
  orderController.updateOrderStatus,
);

export default orderRouter;