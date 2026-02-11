import Express from "express";
import { reviewController } from "./review.controller";
import authGuard, { UserRole } from "../../middlewares/authGuard";

const reviewRouter = Express.Router();

reviewRouter.post(
  "/",
  authGuard(UserRole.CUSTOMER),
  reviewController.createCustomerReview,
);

reviewRouter.get("/:medicineId", reviewController.getAllReviewsbyproductId);

export default reviewRouter;
