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
        status: "AVAILABLE",
      },
      select: {
        id: true,
        sellerId: true,
        price: true,
        stock: true,
        name: true,
      },
    });

    //  Validate all medicines found
    if (medicines.length !== medicineIds.length) {
      const foundIds = medicines.map((m) => m.id);
      const notFound = medicineIds.filter((id) => !foundIds.includes(id));
      throw new Error(
        `Medicines not found or unavailable: ${notFound.join(", ")}`,
      );
    }

    // Validate stock availability
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

    // Calculate total from DATABASE prices
    let totalAmount = 0;
    const orderItemData = payload.orderItems.map((item) => {
      const medicine = medicines.find((m) => m.id === item.medicineId)!;
      const itemTotal = Number(medicine.price) * item.quantity;
      totalAmount += itemTotal;

      return {
        orderId: "",
        medicineId: item.medicineId,
        sellerId: medicine.sellerId,
        quantity: item.quantity,
        price: medicine.price,
      };
    });

    // Create order
    const order = await tx.orders.create({
      data: {
        userId: userId,
        totalAmount: totalAmount,
        phone: payload.phone,
        shippingAddress: payload.shippingAddress,
        status: "PLACED",
      },
    });

    // Set orderId in items
    orderItemData.forEach((item) => {
      item.orderId = order.id;
    });

    // Create order items
    await tx.orderItem.createMany({
      data: orderItemData,
    });

    // Update stock for each medicine
    for (const item of payload.orderItems) {
      const medicine = medicines.find((m) => m.id === item.medicineId)!;
      const newStock = medicine.stock - item.quantity;

      await tx.medicine.update({
        where: { id: item.medicineId },
        data: {
          stock: newStock,

          status: newStock === 0 ? "DISCONTINUED" : "AVAILABLE",
        },
      });
    }

    //  Return order with items
    return await tx.orders.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
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
  });
};

// Get user orders
const getUserOrders = async (userId: string) => {
  return await prisma.orders.findMany({
    where: { userId },
    include: {
      orderItems: {
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

//  Get single order
const getOrderById = async (orderId: string, userId: string) => {
  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
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

  if (order.userId !== userId) {
    throw new Error("Unauthorized access to order");
  }

  return order;
};

// Get all orders
const getOrderBySellerId = async (sellerId: string) => {
  const orderItemCount = await prisma.orderItem.count({
    where: { sellerId: sellerId },
  });

  return await prisma.orders.findMany({
    where: {
      orderItems: {
        some: {
          sellerId: sellerId,
        },
      },
    },
    include: {
      orderItems: {
        where: {
          sellerId: sellerId,
        },
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
      user: {
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

// Update order status
const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const validStatuses = Object.values(OrderStatus);
  if (!validStatuses.includes(status)) {
    throw new Error(
      `Invalid order status. Must be one of: ${validStatuses.join(", ")}`,
    );
  }

  const order = await prisma.orders.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Update the order status
  return await prisma.orders.update({
    where: { id: orderId },
    data: { status },
    include: {
      orderItems: {
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

// Get all orders (Admin)
const getAllOrders = async () => {
  return await prisma.orders.findMany({
    include: {
      orderItems: {
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
      user: {
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

// track order customer status by order id
const trackOrderStatus = async (orderId: string, userId: string) => {
  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      updatedAt: true,
      userId: true,
    },
  });
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.userId !== userId) {
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
  trackOrderStatus
};
