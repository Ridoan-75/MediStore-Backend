import createError from "http-errors";
import { OrderStatus, Prisma } from "../../../generated/prisma/client";
import { OrderWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { PaginationOptions, TOrderPayload } from "../../types";

const createOrder = async (payload: TOrderPayload, userId: string) => {
  const { items } = payload;

  // 1. Calculate total amount and prepare order items
  let totalAmount = 0;
  const orderItemsData = await Promise.all(
    items.map(async (item) => {
      const medicine = await prisma.medicine.findUniqueOrThrow({
        where: { id: item.medicineId },
      });

      if (medicine.stock < item.quantity) {
        throw createError(
          400,
          `Insufficient stock for medicine: ${medicine.name}`,
        );
      }

      totalAmount += medicine.price * item.quantity;

      return {
        quantity: item.quantity,
        price: medicine.price,
        medicineId: item.medicineId,
      };
    }),
  );

  // 2. Create order and order items in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,
        items: {
          create: orderItemsData,
        },
        shippingAddress: payload.shippingAddress,
        paymentMethod: payload.paymentMethod,
      },
      include: {
        items: true,
      },
    });

    // 3. Decrement medicine stock
    for (const item of items) {
      await tx.medicine.update({
        where: { id: item.medicineId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return order;
  });

  return result;
};

const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
  // Fetch the current order
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
  });

  // Validate state transitions
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PLACED]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
    [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELLED]: [],
  };

  if (!validTransitions[order.status]?.includes(newStatus)) {
    throw createError(
      400,
      `Cannot transition from ${order.status} to ${newStatus}`,
    );
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
    include: {
      items: {
        include: {
          medicine: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

const cancelOrderStatus = async (orderId: string) => {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { items: true },
  });

  // Only allow cancellation if the order is in PLACED status
  if (order.status !== OrderStatus.PLACED) {
    throw createError(400, "Only orders in PLACED status can be cancelled");
  }

  // Restore stock and update order status in a transaction
  return prisma.$transaction(async (tx) => {
    // Restore medicine stock
    for (const item of order.items) {
      await tx.medicine.update({
        where: { id: item.medicineId },
        data: { stock: { increment: item.quantity } },
      });
    }

    // Update order status
    return tx.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
      include: {
        items: {
          include: {
            medicine: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  });
};

const getOrderById = async (id: string) => {
  const result = await prisma.order.findUniqueOrThrow({
    where: { id },
    include: {
      items: {
        include: {
          medicine: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  return result;
};

const getAllOrdersOfCustomer = async ({
  status,
  userId,
  page,
  limit,
  sortBy,
  sortOrder,
  skip,
}: PaginationOptions & {
  status: OrderStatus | undefined;
  userId: string;
}) => {
  const andClauses: OrderWhereInput[] = [{ userId }];

  if (status) {
    andClauses.push({ status });
  }

  const result = await prisma.order.findMany({
    where: {
      AND: andClauses,
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder as Prisma.SortOrder,
    },
    include: {
      items: {
        include: {
          medicine: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const total = await prisma.order.count({
    where: {
      AND: andClauses,
    },
  });

  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getAllOrdersOfSeller = async ({
  status,
  userId,
  page,
  limit,
  sortBy,
  sortOrder,
  skip,
}: PaginationOptions & {
  status: OrderStatus | undefined;
  userId: string;
}) => {
  const andClauses: OrderWhereInput[] = [
    {
      items: {
        some: {
          medicine: {
            sellerId: userId,
          },
        },
      },
    },
  ];

  if (status) {
    andClauses.push({ status });
  }

  const result = await prisma.order.findMany({
    where: {
      AND: andClauses,
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder as Prisma.SortOrder,
    },
    include: {
      items: {
        include: {
          medicine: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const total = await prisma.order.count({
    where: {
      AND: andClauses,
    },
  });

  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const orderServices = {
  createOrder,
  getOrderById,
  getAllOrdersOfCustomer,
  updateOrderStatus,
  cancelOrderStatus,
  getAllOrdersOfSeller,
};
