import { Router } from "express";
import { proxy } from "../../middlewares/proxy";
import { cartControllers } from "./cart-controllers";
const router = Router();

//POST:/api/v1/carts/ -> create or update cart || customer
router.post("/", proxy("cart", "create"), cartControllers.createCart);

//GET:/api/v1/carts/ -> get current user's cart || customer and admin
router.get("/", proxy("cart", "read"), cartControllers.getCurrentUserCart);

//PATCH:/api/v1/carts/decrement/:medicineId -> decrement medicine quantity in cart || customer
router.patch(
  "/decrement/:medicineId",
  proxy("cart", "update"),
  cartControllers.decrementMedicineQuantityInCart,
);

//DELETE:/api/v1/cart/item -> delete cart item || customer
router.delete("/item", proxy("cart", "delete"), cartControllers.deleteCartItem);

export const cartRoutes = router;
