import createError from "http-errors";
import { Medicine, Prisma } from "../../../generated/prisma/client";

import { MedicineWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { FilterOptions, PaginationOptions } from "../../types";

const createMedicine = async (payload: Medicine) => {
  // check if the category exists
  await prisma.category.findUniqueOrThrow({
    where: { id: payload.categoryId },
  });

  // check if the medicine with same slug and brand exists
  const existingMedicine = await prisma.medicine.findUnique({
    where: { slug: payload.slug, brand: payload.brand },
  });

  if (existingMedicine) {
    throw createError(409, "Medicine with this slug already exists");
  }

  const newMedicine = await prisma.medicine.create({
    data: payload,
  });
  return newMedicine;
};

const updateMedicineById = async (id: string, payload: Partial<Medicine>) => {
  // check if the medicine exists
  await prisma.medicine.findUniqueOrThrow({
    where: { id },
  });

  const updatedMedicine = await prisma.medicine.update({
    where: { id },
    data: payload,
  });
  return updatedMedicine;
};

const getMedicineById = async (id: string) => {
  const medicine = await prisma.medicine.findUniqueOrThrow({
    where: { id },
  });
  return medicine;
};

const getAllMedicines = async ({
  searchTerm,
  status,
  categoryId,
  id,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: FilterOptions) => {
  const andClauses: MedicineWhereInput[] = [];

  if (searchTerm) {
    andClauses.push({
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          brand: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (status) {
    andClauses.push({
      status: {
        equals: status,
      },
    });
  }

  if (categoryId) {
    andClauses.push({ categoryId });
  }

  if (id) {
    andClauses.push({ id });
  }
  const result = await prisma.medicine.findMany({
    where: {
      AND: andClauses,
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder as Prisma.SortOrder,
    },
  });

  const total = await prisma.medicine.count({
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

const deleteMedicineById = async (id: string) => {
  // check if the medicine exists
  await prisma.medicine.findUniqueOrThrow({
    where: { id },
  });

  // Delete related cart items and order items first to avoid foreign key constraints

  await prisma.$transaction((tx) =>
    Promise.all([
      tx.cartItem.deleteMany({
        where: { medicineId: id },
      }),
      tx.orderItem.deleteMany({
        where: { medicineId: id },
      }),
      tx.medicine.delete({
        where: { id },
      }),
    ]),
  );
};

const getMedicineBySellerId = async (
  sellerId: string,
  options: PaginationOptions,
) => {
  const medicines = await prisma.medicine.findMany({
    where: { sellerId },
    skip: options.skip,
    take: options.limit,
    orderBy: {
      [options.sortBy]: options.sortOrder as Prisma.SortOrder,
    },
  });
  const total = await prisma.medicine.count({
    where: { sellerId },
  });
  return {
    data: medicines,
    pagination: {
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit),
    },
  };
};

export const medicineServices = {
  createMedicine,
  updateMedicineById,
  getMedicineById,
  getAllMedicines,
  deleteMedicineById,
  getMedicineBySellerId,
};
