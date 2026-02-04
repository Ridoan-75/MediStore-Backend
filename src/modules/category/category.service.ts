import { prisma } from "../../lib/prisma";

const createCategory = async ({
  name,
  description,
  imageUrl,
}: {
  name: string;
  description?: string;
  imageUrl?: string;
}) => {
  const result = await prisma.category.create({
    data: {
      name,
      description: description ?? null,
      imageUrl: imageUrl ?? null,
    },
  });
  return result;
};

const getAllCategories = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};

const getCategoryById = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  return category;
};

const updateCategory = async (
  categoryId: string,
  data: { name?: string; description?: string; imageUrl?: string },
) => {
  return await prisma.category.update({
    where: {
      id: categoryId,
    },
    data,
  });
};

const deleteCategory = async (categoryId: string) => {
  return await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};