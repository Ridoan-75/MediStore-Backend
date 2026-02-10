import { Router } from "express";
import { cartRoutes } from "../../modules/cart/cart-routes";
import { categoryRoutes } from "../../modules/category/category-routes";
import { medicineRoutes } from "../../modules/medicine/medicine-routes";
import { orderRoutes } from "../../modules/order/order-routes";
import { reviewRoutes } from "../../modules/review/review-routes";
import { userRoutes } from "../../modules/user/user-routes";

const router = Router();

router.use("/medicines", medicineRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/users", userRoutes);
router.use("/reviews", reviewRoutes);
router.use("/carts", cartRoutes);

export const v1Routes = router;
