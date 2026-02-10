import { Router } from "express";
import { proxy } from "../../middlewares/proxy";
import { reviewControllers } from "./review-controllers";

const router = Router();

//GET:api/v1/reviews || get all reviews || Public
router.get("/", reviewControllers.getAllReviews);

//POST:api/v1/reviews/:medicineId || create a new review || customer
router.post(
  "/:medicineId",
  proxy("review", "create"),
  reviewControllers.createReview,
);

//PATCH:api/v1/reviews/:reviewId || update a review || customer & admin
router.patch(
  "/:reviewId",
  proxy("review", "update"),
  reviewControllers.updateReview,
);

//GET:api/v1/reviews/:reviewId || get a review by ID || public
router.get("/:reviewId", reviewControllers.getReviewById);

// DELETE:api/v1/reviews/:reviewId || delete a review by ID || admin & customer
router.delete(
  "/:reviewId",
  proxy("review", "delete"),
  reviewControllers.deleteReviewById,
);

// GET:api/v1/reviews/medicine/:medicineId || get reviews by Medicine ID || public
router.get("/medicine/:medicineId", reviewControllers.getReviewByMedicineId);

export const reviewRoutes = router;
