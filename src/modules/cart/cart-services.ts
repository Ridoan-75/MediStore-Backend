import createError from "http-errors";
import { prisma } from "../../lib/prisma";
import { PaginationOptions, TCartPayload } from "../../types";

const createCart = async (userId: string, payload: TCartPayload) => {
  const { items } = payload;
  // check if cart already exists for the user
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (cart) {
    // If cart exists, update the items
    const updatedItems = await Promise.all(
      items.map(async (item) => {
        const existingItem = cart!.items.find(
          (ci) => ci.medicineId === item.medicineId,
        );
        if (existingItem) {
          // Update quantity if item exists
          return prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: item.quantity },
          });
        } else {
          // Create new cart item
          return prisma.cartItem.create({
            data: {
              cartId: cart!.id,
              medicineId: item.medicineId,
              quantity: item.quantity,
            },
          });
        }
      }),
    );
    cart.items = updatedItems;
  } else {
    // If cart doesn't exist, create a new one
    cart = await prisma.cart.create({
      data: {
        userId,
        items: {
          create: items.map((item) => ({
            medicineId: item.medicineId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });
  }
  return cart;
};

const getCurrentUserCart = async (
  userId: string,
  pagination: PaginationOptions,
) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination;
  const carts = await prisma.cart.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          medicine: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.cart.count({ where: { userId } });
  return {
    data: carts,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const decrementMedicineQuantityInCart = async (
  userId: string,
  medicineId: string,
  quantity: number,
) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });
  if (!cart) {
    throw createError(404, "Cart not found for the user");
  }
  const cartItem = cart.items.find((item) => item.medicineId === medicineId);
  if (!cartItem) {
    throw createError(404, "Medicine not found in the cart");
  }
  if (cartItem.quantity < quantity) {
    throw createError(400, "Insufficient quantity in the cart");
  }
  const updatedCartItem = await prisma.cartItem.update({
    where: { id: cartItem.id },
    data: { quantity: cartItem.quantity - quantity },
  });
  return updatedCartItem;
};

const deleteCartItem = async (userId: string, medicineId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });
  if (!cart) {
    throw createError(404, "Cart not found for the user");
  }
  const cartItem = cart.items.find((item) => item.medicineId === medicineId);
  if (!cartItem) {
    throw createError(404, "Medicine not found in the cart");
  }
  await prisma.cartItem.delete({
    where: { id: cartItem.id },
  });
};

export const cartServices = {
  createCart,
  getCurrentUserCart,
  decrementMedicineQuantityInCart,
  deleteCartItem,
};
