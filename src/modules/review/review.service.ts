import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { CustomerReviewType } from "./review.controller";

const createCustomerReview = async (
  userId: string,
  payload: CustomerReviewType,
) => {
  if (payload.rating < 1 || payload.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }
  const isCustomer = await prisma.user.findUnique({
    where: {
      id: userId,
      role: Role.CUSTOMER,
    },
  });

  if (!isCustomer) {
    throw new Error("Only customers can create reviews");
  }
  const medicine = await prisma.medicine.findUnique({
    where: { id: payload.medicineId },
  });

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  const orderItem = await prisma.orderItem.findFirst({
    where: {
      medicineId: payload.medicineId,
      order: {
        customerId: userId,
      },
    },
  });

  if (!orderItem) {
    throw new Error("You can only review medicines you have ordered");
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      customerId_medicineId: {
        customerId: userId,
        medicineId: payload.medicineId,
      },
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this medicine");
  }

  const review = await prisma.review.create({
    data: {
      customerId: userId,
      medicineId: payload.medicineId,
      rating: payload.rating,
      comment: payload.comment || null,
    },
    include: {
      customer: {
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
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new Error("Review not found");
  }
  if (review.customerId !== userId) {
    throw new Error("Unauthorized: You can only update your own reviews");
  }

  if (payload.rating && (payload.rating < 1 || payload.rating > 5)) {
    throw new Error("Rating must be between 1 and 5");
  }

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: {
      ...(payload.rating && { rating: payload.rating }),
      ...(payload.comment !== undefined && { comment: payload.comment }),
    },
    include: {
      customer: {
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
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.customerId !== userId) {
    throw new Error("Unauthorized: You can only delete your own reviews");
  }

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
