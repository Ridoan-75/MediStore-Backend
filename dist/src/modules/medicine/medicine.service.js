import { prisma } from "../../lib/prisma";
const createMedicine = async (payload, userId) => {
    const result = await prisma.medicine.create({
        data: {
            ...payload,
            sellerId: userId,
        },
        include: {
            category: true,
        },
    });
    return result;
};
const getAllMedicines = async ({ search, category, minPrice, maxPrice, page, limit, skip, sortBy, sortOrder, }) => {
    const andConditions = [];
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
    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
        andConditions.push({
            price: {
                ...(minPrice !== undefined && { gte: minPrice }),
                ...(maxPrice !== undefined && { lte: maxPrice }),
            },
        });
    }
    const Allmedicines = await prisma.medicine.findMany({
        where: {
            AND: andConditions,
        },
        include: {
            category: true,
        },
        take: limit,
        skip: skip,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = await prisma.medicine.count({
        where: {
            AND: andConditions,
        },
    });
    return {
        data: Allmedicines,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
const getMedicineById = async (medicineId) => {
    const medicine = await prisma.medicine.findUnique({
        where: { id: medicineId },
        include: {
            category: true,
        },
    });
    return medicine;
};
const deleteMedicine = async (medicineId, userId) => {
    const medicine = await prisma.medicine.findUnique({
        where: {
            id: medicineId,
        },
    });
    if (!medicine) {
        throw new Error("Medicine not found");
    }
    console.log("seller id:", medicine.sellerId);
    if (medicine.sellerId !== userId) {
        throw new Error("Unauthorized to delete this medicine");
    }
    await prisma.medicine.delete({
        where: { id: medicineId },
    });
};
const updateMedicine = async (payload, userId, medicineId) => {
    // Verify the medicine belongs to the seller
    await prisma.medicine.findFirstOrThrow({
        where: {
            id: medicineId,
            sellerId: userId,
        },
    });
    const result = await prisma.medicine.update({
        where: {
            id: medicineId,
        },
        data: {
            ...payload,
        },
        include: {
            category: true,
        },
    });
    return result;
};
const getAllMedicinesBySellerId = async (sellerId) => {
    const medicines = await prisma.medicine.findMany({
        where: {
            sellerId,
        },
        include: {
            category: true,
        },
    });
    return medicines;
};
export const medicineService = {
    createMedicine,
    getAllMedicines,
    getMedicineById,
    deleteMedicine,
    updateMedicine,
    getAllMedicinesBySellerId,
};
//# sourceMappingURL=medicine.service.js.map