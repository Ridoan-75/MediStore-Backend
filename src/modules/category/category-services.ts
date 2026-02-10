import createError from "http-errors";
import { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCategory = async (payload: Category) => {
  const isExist = await prisma.category.findUnique({
    where: { slug: payload.slug },
  });

  if (isExist) {
    throw createError(409, "Category with this slug already exists");
  }

  const newCategory = await prisma.category.create({
    data: payload,
  });
  return newCategory;
};

const getCategoryBySlug = async (slug: string) => {
  const category = await prisma.category.findUniqueOrThrow({
    where: { slug },
  });
  return category;
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUniqueOrThrow({
    where: { id },
  });

  return category;
};

const updateCategoryById = async (id: string, payload: Partial<Category>) => {
  // check if category exists
  await prisma.category.findUniqueOrThrow({
    where: { id },
  });

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: payload,
  });

  return updatedCategory;
};

const deleteCategoryById = async (id: string) => {
  // check if category exists
  await prisma.category.findFirstOrThrow({
    where: { id },
  });

  await prisma.category.delete({
    where: { id },
  });
};

const getAllCategories = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};

export const categoryServices = {
  createCategory,
  getCategoryBySlug,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  getAllCategories,
};
