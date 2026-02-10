import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { Review } from "../../../generated/prisma/client";
import { paginationSort } from "../../helpers/pagination-sort";
import { sendJSON } from "../../helpers/send-json";
import { reviewServices } from "./review-services";

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload: Review = req.body;
    const medicineId = req.params.medicineId;
    if (!medicineId) {
      throw createError(400, "Bad Request: Medicine ID is missing");
    }

    if (typeof medicineId !== "string") {
      throw createError(400, "Bad Request: Medicine ID must be a string");
    }

    const userId = req.user?.id;
    if (!userId) {
      throw createError(400, "Bad Request: User ID is missing");
    }
    if (typeof userId !== "string") {
      throw createError(400, "Bad Request: User ID must be a string");
    }
    const { rating, content } = req.body;
    if (typeof rating !== "number") {
      throw createError(400, "Bad Request: Rating must be a number");
    }
    if (typeof content !== "string") {
      throw createError(400, "Bad Request: Content must be a string");
    }

    payload.medicineId = medicineId;
    payload.userId = userId;

    const data = await reviewServices.createReview(payload);

    return sendJSON(true, res, 201, "Review created successfully", data);
  } catch (error) {
    next(error);
  }
};

const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reviewId = req.params.reviewId;
    if (!reviewId) {
      throw createError(400, "Bad Request: Review ID is missing");
    }
    if (typeof reviewId !== "string") {
      throw createError(400, "Bad Request: Review ID must be a string");
    }
    const payload: Partial<Review> = req.body;

    // prevent updating userId and medicineId
    delete payload.userId;
    delete payload.medicineId;

    const data = await reviewServices.updateReview(reviewId, payload);

    return sendJSON(true, res, 200, "Review updated successfully", data);
  } catch (error) {
    next(error);
  }
};

const getReviewById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reviewId = req.params.reviewId;
    if (!reviewId) {
      throw createError(400, "Bad Request: Review ID is missing");
    }
    if (typeof reviewId !== "string") {
      throw createError(400, "Bad Request: Review ID must be a string");
    }
    const data = await reviewServices.getReviewById(reviewId);
    return sendJSON(true, res, 200, "Review fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, sortBy, sortOrder, skip } = paginationSort(req.query);
    const rawRating = req.query.rating;
    const rating = rawRating ? parseInt(rawRating as string, 10) : undefined;

    const { data, pagination } = await reviewServices.getAllReviews({
      page,
      limit,
      sortBy,
      sortOrder,
      skip,
      rating,
    });
    return sendJSON(true, res, 200, "Reviews fetched successfully", {
      data,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

const deleteReviewById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reviewId = req.params.reviewId;
    if (!reviewId) {
      throw createError(400, "Bad Request: Review ID is missing");
    }
    if (typeof reviewId !== "string") {
      throw createError(400, "Bad Request: Review ID must be a string");
    }
    const data = await reviewServices.deleteReviewById(reviewId);
    return sendJSON(true, res, 200, "Review deleted successfully", data);
  } catch (error) {
    next(error);
  }
};

const getReviewByMedicineId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const medicineId = req.params.medicineId;
    if (!medicineId) {
      throw createError(400, "Bad Request: Medicine ID is missing");
    }
    if (typeof medicineId !== "string") {
      throw createError(400, "Bad Request: Medicine ID must be a string");
    }
    const data = await reviewServices.getReviewByMedicineId(medicineId);
    return sendJSON(true, res, 200, "Reviews fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

export const reviewControllers = {
  createReview,
  updateReview,
  getReviewById,
  getAllReviews,
  getReviewByMedicineId,
  deleteReviewById,
};
