import { Router } from "express";
import { proxy } from "../../middlewares/proxy";
import { orderControllers } from "./order-controllers";

const router = Router();

//POST:api/v1/orders -> create a new order || customer
router.post("/", proxy("order", "create"), orderControllers.createOrder);

//PATCH:api/v1/orders/:orderId/status -> update order status || admin & seller
router.patch(
  "/:orderId/status",
  proxy("order", "update"),
  orderControllers.updateOrderStatus,
);

//PATCH:api/v1/orders/:orderId/cancel -> cancel order status || customer
router.patch(
  "/:orderId/cancel",
  proxy("order", "update"),
  orderControllers.cancelOrderStatus,
);

//GET:api/v1/orders/seller -> get all orders of seller || seller & admin
router.get(
  "/seller",
  proxy("order", "read"),
  orderControllers.getAllOrdersOfSeller,
);

//GET:api/v1/orders/:orderId -> get order by id || customer, seller & admin
router.get("/:orderId", proxy("order", "read"), orderControllers.getOrderById);

//GET:api/v1/orders/-> get all orders of customer || customer & admin
router.get(
  "/",
  proxy("order", "read"),
  orderControllers.getAllOrdersOfCustomer,
);

export const orderRoutes = router;
