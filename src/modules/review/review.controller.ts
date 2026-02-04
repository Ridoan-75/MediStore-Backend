import { Request, Response } from "express";
import { reviewService } from "./review.service";

export interface CustomerReviewType {
  medicineId: string;
  rating: number;
  comment?: string;
}

const createCustomerReview = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const payload: CustomerReviewType = {
      medicineId: req.body.medicineId,
      rating: parseInt(req.body.rating),
      comment: req.body.comment,
    };

    if (!payload.medicineId) {
      return res.status(400).json({
        success: false,
        message: "Medicine ID is required",
      });
    }

    if (!payload.rating || payload.rating < 1 || payload.rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const result = await reviewService.createCustomerReview(user.id, payload);

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Create review error:", error);
    
    const statusCode = error.message.includes("already reviewed") 
      ? 409 
      : error.message.includes("not ordered") 
      ? 403 
      : 400;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to create review",
    });
  }
};

const getAllReviewsByMedicineId = async (req: Request, res: Response) => {
  try {
    const { medicineId } = req.params;

    if (!medicineId || typeof medicineId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Medicine ID is required",
      });
    }

    const result = await reviewService.getAllReviewsByMedicineId(medicineId);

    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch reviews",
    });
  }
};

const updateCustomerReview = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { reviewId } = req.params;

    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!reviewId || typeof reviewId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Review ID is required",
      });
    }

    const payload = {
      rating: req.body.rating ? parseInt(req.body.rating) : undefined,
      comment: req.body.comment,
    };

    if (payload.rating && (payload.rating < 1 || payload.rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const result = await reviewService.updateCustomerReview(
      reviewId,
      user.id,
      payload
    );

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Update review error:", error);
    
    const statusCode = error.message.includes("not found") 
      ? 404 
      : error.message.includes("Unauthorized") 
      ? 403 
      : 400;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update review",
    });
  }
};

const deleteCustomerReview = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { reviewId } = req.params;

    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!reviewId || typeof reviewId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Review ID is required",
      });
    }

    await reviewService.deleteCustomerReview(reviewId, user.id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete review error:", error);
    
    const statusCode = error.message.includes("not found") 
      ? 404 
      : error.message.includes("Unauthorized") 
      ? 403 
      : 400;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to delete review",
    });
  }
};

export const reviewController = {
  createCustomerReview,
  getAllReviewsByMedicineId,
  updateCustomerReview,
  deleteCustomerReview,
};