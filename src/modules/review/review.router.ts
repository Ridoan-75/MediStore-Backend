import Express from "express";
import { reviewController } from "./review.controller";
import { Role } from "../../../generated/prisma/enums";
import authGuard from "../../middleware/authGuard";

const reviewRouter = Express.Router();


reviewRouter.post(
  "/",
  authGuard(Role.CUSTOMER), 
  reviewController.createCustomerReview,
);


reviewRouter.get(
  "/:medicineId",
  reviewController.getAllReviewsByMedicineId, 
);


reviewRouter.put(
  "/:reviewId",
  authGuard(Role.CUSTOMER),
  reviewController.updateCustomerReview,
);

reviewRouter.delete(
  "/:reviewId",
  authGuard(Role.CUSTOMER), 
  reviewController.deleteCustomerReview,
);

export default reviewRouter;