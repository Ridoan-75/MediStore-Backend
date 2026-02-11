import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/authGuard";
import { customerReviewType } from "./review.controller";

const createCustomerReview = async (
  userId: string,
  payload: customerReviewType,
) => {
  if (payload.rating < 1 || payload.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const isCustomer = await prisma.user.findUnique({
    where: {
      id: userId,
      role: UserRole.CUSTOMER,
    },
  });

  if (!isCustomer) {
    throw new Error("Only login customers can create reviews");
  }

  // Check if user has purchased this medicine
  const orderItem = await prisma.orderItem.findFirst({
    where: {
      medicineId: payload.medicineId,
      order: { userId: userId },
    },
  });
  if (!orderItem) {
    throw new Error("You can only review medicines you have purchased");
  }

  // Check if user already reviewed this medicine
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_medicineId: {
        userId: userId,
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
      userId: userId,
      medicineId: payload.medicineId,
      rating: payload.rating,
      comment: payload.comment || null,
    },
    include: {
      user: {
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
        },
      },
    },
  });
  return review;
};

const getAllReviewsbyproductId = async (medicineId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      medicineId: medicineId,
    },
    include: {
      user: {
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

  return reviews;
};

export const reviewService = {
  createCustomerReview,

  getAllReviewsbyproductId,
};
