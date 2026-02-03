import { prisma } from "../../lib/prisma";

const createMedicine = async (
  payload: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    imageUrl?: string;
    categoryId: string;
    manufacturer?: string;
    type?: string;
  },
  userId: string,
) => {
  // Verify category exists
  const categoryExists = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!categoryExists) {
    throw new Error("Category not found");
  }

  const result = await prisma.medicine.create({
    data: {
      name: payload.name,
      description: payload.description || "", // ✅ Fix: empty string instead of undefined
      price: payload.price,
      stock: payload.stock,
      imageUrl: payload.imageUrl || null, // ✅ Fix: null instead of undefined
      categoryId: payload.categoryId,
      manufacturer: payload.manufacturer || null, // ✅ Fix: null instead of undefined
      type: payload.type || null, // ✅ Fix: null instead of undefined
      sellerId: userId,
    },
    include: {
      category: true,
      seller: {
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

const getAllMedicines = async ({
  search,
  category,
  minPrice,
  maxPrice,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andConditions: any[] = [{ isActive: true }]; // ✅ Only active medicines

  if (category) {
    andConditions.push({
      categoryId: category,
    });
  }

  if (search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          manufacturer: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          category: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    andConditions.push({
      price: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
    });
  }

  const [medicines, total] = await Promise.all([
    prisma.medicine.findMany({
      where: {
        AND: andConditions,
      },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: limit,
      skip: skip,
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.medicine.count({
      where: {
        AND: andConditions,
      },
    }),
  ]);

  return {
    data: medicines,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getMedicineById = async (medicineId: string) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
    include: {
      category: true,
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reviews: {
        include: {
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  return medicine;
};

const updateMedicine = async (
  payload: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    imageUrl?: string;
    categoryId?: string;
    manufacturer?: string;
    type?: string;
  },
  userId: string,
  medicineId: string,
) => {
  const medicine = await prisma.medicine.findFirst({
    where: {
      id: medicineId,
      sellerId: userId,
    },
  });

  if (!medicine) {
    throw new Error("Medicine not found or unauthorized");
  }

  // If categoryId is being updated, verify it exists
  if (payload.categoryId) {
    const categoryExists = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    });

    if (!categoryExists) {
      throw new Error("Category not found");
    }
  }

  const result = await prisma.medicine.update({
    where: {
      id: medicineId,
    },
    data: payload,
    include: {
      category: true,
    },
  });

  return result;
};

const deleteMedicine = async (medicineId: string, userId: string) => {
  const medicine = await prisma.medicine.findUnique({
    where: {
      id: medicineId,
    },
  });

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  if (medicine.sellerId !== userId) {
    throw new Error("Unauthorized to delete this medicine");
  }

  await prisma.medicine.delete({
    where: { id: medicineId },
  });
};

const getAllMedicinesBySellerId = async (sellerId: string) => {
  const medicines = await prisma.medicine.findMany({
    where: {
      sellerId,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return medicines;
};

export const medicineService = {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  getAllMedicinesBySellerId,
};