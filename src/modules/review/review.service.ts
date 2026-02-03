import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { CustomerReviewType } from "./review.controller"; // ✅ Fixed name

const createCustomerReview = async (
  userId: string,
  payload: CustomerReviewType,
) => {
  // Validate rating (redundant but safe)
  if (payload.rating < 1 || payload.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Check if user is a customer
  const isCustomer = await prisma.user.findUnique({
    where: {
      id: userId,
      role: Role.CUSTOMER, // ✅ Changed
    },
  });

  if (!isCustomer) {
    throw new Error("Only customers can create reviews");
  }

  // Check if medicine exists
  const medicine = await prisma.medicine.findUnique({
    where: { id: payload.medicineId },
  });

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  // Check if user has ordered this medicine
  const orderItem = await prisma.orderItem.findFirst({
    where: {
      medicineId: payload.medicineId,
      order: {
        customerId: userId, // ✅ Changed from userId
      },
    },
  });

  if (!orderItem) {
    throw new Error("You can only review medicines you have ordered");
  }

  // Check if user already reviewed this medicine
  const existingReview = await prisma.review.findUnique({
    where: {
      customerId_medicineId: {
        // ✅ Changed from userId_medicineId
        customerId: userId,
        medicineId: payload.medicineId,
      },
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this medicine");
  }

  // Create the review
  const review = await prisma.review.create({
    data: {
      customerId: userId, // ✅ Changed from userId
      medicineId: payload.medicineId,
      rating: payload.rating,
      comment: payload.comment || null,
    },
    include: {
      customer: {
        // ✅ Changed from user
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      medicine: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });

  return review;
};

const getAllReviewsByMedicineId = async (medicineId: string) => {
  // Check if medicine exists
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
  });

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  const reviews = await prisma.review.findMany({
    where: {
      medicineId: medicineId,
    },
    include: {
      customer: {
        // ✅ Changed from user
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate average rating
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return {
    reviews,
    totalReviews: reviews.length,
    averageRating: parseFloat(avgRating.toFixed(1)),
  };
};

const updateCustomerReview = async (
  reviewId: string,
  userId: string,
  payload: { rating?: number; comment?: string },
) => {
  // Find the review
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  // Check ownership
  if (review.customerId !== userId) {
    // ✅ Changed from userId
    throw new Error("Unauthorized: You can only update your own reviews");
  }

  // Validate rating if provided
  if (payload.rating && (payload.rating < 1 || payload.rating > 5)) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Update the review
  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: {
      ...(payload.rating && { rating: payload.rating }),
      ...(payload.comment !== undefined && { comment: payload.comment }),
    },
    include: {
      customer: {
        // ✅ Changed from user
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      medicine: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });

  return updatedReview;
};

const deleteCustomerReview = async (reviewId: string, userId: string) => {
  // Find the review
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  // Check ownership
  if (review.customerId !== userId) {
    // ✅ Changed from userId
    throw new Error("Unauthorized: You can only delete your own reviews");
  }

  // Delete the review
  await prisma.review.delete({
    where: { id: reviewId },
  });
};

export const reviewService = {
  createCustomerReview,
  getAllReviewsByMedicineId,
  updateCustomerReview,
  deleteCustomerReview,
};
