import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

interface IOrderItem {
  medicineId: string;
  quantity: number;
}

const createOrder = async (
  payload: {
    phone: string;
    shippingAddress: string;
    orderItems: IOrderItem[];
  },
  userId: string,
) => {
  return await prisma.$transaction(async (tx) => {
    const medicineIds = payload.orderItems.map((item) => item.medicineId);

    const medicines = await tx.medicine.findMany({
      where: {
        id: { in: medicineIds },
        isActive: true, // ✅ Changed from status
      },
      select: {
        id: true,
        sellerId: true,
        price: true,
        stock: true,
        name: true,
      },
    });

    if (medicines.length !== medicineIds.length) {
      const foundIds = medicines.map((m) => m.id);
      const notFound = medicineIds.filter((id) => !foundIds.includes(id));
      throw new Error(
        `Medicines not found or unavailable: ${notFound.join(", ")}`,
      );
    }

    for (const item of payload.orderItems) {
      const medicine = medicines.find((m) => m.id === item.medicineId);
      if (!medicine) {
        throw new Error(`Medicine ${item.medicineId} not found`);
      }

      if (medicine.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${medicine.name}. Available: ${medicine.stock}, Requested: ${item.quantity}`,
        );
      }
    }

    let totalAmount = 0;
    const orderItemData = payload.orderItems.map((item) => {
      const medicine = medicines.find((m) => m.id === item.medicineId)!;
      const itemTotal = Number(medicine.price) * item.quantity;
      totalAmount += itemTotal;

      return {
        medicineId: item.medicineId,
        sellerId: medicine.sellerId, // ✅ Now included
        quantity: item.quantity,
        price: medicine.price,
      };
    });

    const order = await tx.order.create({ // ✅ Changed from orders
      data: {
        customerId: userId, // ✅ Changed from userId
        total: totalAmount, // ✅ Changed from totalAmount
        phone: payload.phone,
        shippingAddress: payload.shippingAddress,
        status: OrderStatus.PLACED, // ✅ Use enum
        items: { // ✅ Changed from orderItems
          create: orderItemData,
        },
      },
      include: {
        items: { // ✅ Changed from orderItems
          include: {
            medicine: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
            seller: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Update stock
    for (const item of payload.orderItems) {
      const medicine = medicines.find((m) => m.id === item.medicineId)!;
      const newStock = medicine.stock - item.quantity;

      await tx.medicine.update({
        where: { id: item.medicineId },
        data: {
          stock: newStock,
          isActive: newStock > 0, // ✅ Changed from status
        },
      });
    }

    return order;
  });
};

const getUserOrders = async (userId: string) => {
  return await prisma.order.findMany({ // ✅ Changed from orders
    where: { customerId: userId }, // ✅ Changed from userId
    include: {
      items: { // ✅ Changed from orderItems
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getOrderById = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUnique({ // ✅ Changed from orders
    where: { id: orderId },
    include: {
      items: { // ✅ Changed from orderItems
        include: {
          medicine: true,
          seller: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.customerId !== userId) { // ✅ Changed from userId
    throw new Error("Unauthorized access to order");
  }

  return order;
};

const getOrderBySellerId = async (sellerId: string) => {
  return await prisma.order.findMany({ // ✅ Changed from orders
    where: {
      items: { // ✅ Changed from orderItems
        some: {
          sellerId: sellerId,
        },
      },
    },
    include: {
      items: { // ✅ Changed from orderItems
        where: {
          sellerId: sellerId,
        },
        include: {
          medicine: true,
        },
      },
      customer: { // ✅ Changed from user
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  userId: string, // ✅ Added
  userRole: string, // ✅ Added
) => {
  const validStatuses = Object.values(OrderStatus);
  if (!validStatuses.includes(status)) {
    throw new Error(
      `Invalid order status. Must be one of: ${validStatuses.join(", ")}`,
    );
  }

  const order = await prisma.order.findUnique({ // ✅ Changed from orders
    where: { id: orderId },
    include: {
      items: {
        select: {
          sellerId: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Authorization check
  if (userRole !== "ADMIN") {
    const isSeller = order.items.some((item) => item.sellerId === userId);
    if (!isSeller) {
      throw new Error("Unauthorized to update this order");
    }
  }

  return await prisma.order.update({ // ✅ Changed from orders
    where: { id: orderId },
    data: { status },
    include: {
      items: { // ✅ Changed from orderItems
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });
};

const getAllOrders = async () => {
  return await prisma.order.findMany({ // ✅ Changed from orders
    include: {
      items: { // ✅ Changed from orderItems
        include: {
          medicine: true,
          seller: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
      },
      customer: { // ✅ Changed from user
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const trackOrderStatus = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUnique({ // ✅ Changed from orders
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      updatedAt: true,
      customerId: true, // ✅ Changed from userId
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.customerId !== userId) { // ✅ Changed from userId
    throw new Error("Unauthorized access to order");
  }

  return order;
};

export const orderService = {
  createOrder,
  getUserOrders,
  getOrderById,
  getOrderBySellerId,
  updateOrderStatus,
  getAllOrders,
  trackOrderStatus,
};