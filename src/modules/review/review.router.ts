import Express from "express";
import { reviewController } from "./review.controller";
import { Role } from "../../../generated/prisma/enums";
import authGuard from "../../middleware/authGuard";

const reviewRouter = Express.Router();

// Create review (Customer only)
reviewRouter.post(
  "/",
  authGuard(Role.CUSTOMER), // ✅ Changed
  reviewController.createCustomerReview,
);

// Get all reviews for a medicine (Public)
reviewRouter.get(
  "/:medicineId",
  reviewController.getAllReviewsByMedicineId, // ✅ Fixed name
);

// Update review (Customer only - own review)
reviewRouter.put(
  "/:reviewId",
  authGuard(Role.CUSTOMER), // ✅ Added
  reviewController.updateCustomerReview,
);

// Delete review (Customer only - own review)
reviewRouter.delete(
  "/:reviewId",
  authGuard(Role.CUSTOMER), // ✅ Added
  reviewController.deleteCustomerReview,
);

export default reviewRouter;